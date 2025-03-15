const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");
const XRPLStaking = require("../services/xrplService");
const { setupTrustLine, getExistingOffers, purchaseCruViaMakeOfferABI } = require("../helpers/xrplHelper");

// Middleware to validate request
const validateRequest = (req, res, next) => {
  if (!req.body.walletSecret || !req.body.amount) {
    return res.status(400).json({ error: "Missing wallet secret or amount." });
  }
  next();
};

// ✅ GET User's PFMU Balance
router.get("/get-user-pfmu/:address", async (req, res) => {
  try {
    const { address } = req.params;
    const xrplService = new XRPLService();
    const balance = await xrplService.getUserPFMU(address);
    res.status(200).json({ success: true, balance });
  } catch (error) {
    console.error("❌ Error fetching PFMU balance:", error);
    res.status(500).json({ success: false, error: "Failed to fetch PFMU balance" });
  }
});

// ✅ POST Stake PFMU Tokens
router.post("/stake-pfmu", validateRequest, async (req, res) => {
  try {
    const { walletSecret, amount } = req.body;
    if (!walletSecret || !amount) {
      return res.status(400).json({ success: false, error: "Missing walletSecret or amount" });
    }

    const xrplService = new XRPLService();
    const result = await xrplService.stakePFMU(walletSecret, amount);
    res.status(200).json({ success: true, transaction: result });
  } catch (error) {
    console.error("❌ Error staking PFMU:", error);
    res.status(500).json({ success: false, error: "Failed to stake PFMU" });
  }
});

router.post("/buy-pfmu", validateRequest, async (req, res) => {
  console.log("/buy-pfmu");
  const { walletSecret, amount } = req.body;

  if (!walletSecret || !amount) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const client = new xrpl.Client(XRPLStaking.XRPL_SERVER);
  await client.connect();

  try {
    console.log("XRPL_SERVER: ", XRPLStaking.XRPL_SERVER);
    // Load wallet from secret
    const wallet = xrpl.Wallet.fromSeed(walletSecret);
    console.log("Wallet loaded:", wallet.classicAddress);

    await setupTrustLine(client, wallet, XRPLStaking.PFMU_CURRENCY, XRPLStaking.ISSUER_ADDRESS);
    console.log("TrustSet transaction submitted");

    //Create Offer
    const existingOffers = await getExistingOffers(client, XRPLStaking.PFMU_CURRENCY, XRPLStaking.ISSUER_ADDRESS);
    let offer;

    if (existingOffers.length > 0) {
      console.log("Using existing offer:", existingOffers[0]);
      offer = {
        TakerPays: existingOffers[0].TakerPays,
        TakerGets: existingOffers[0].TakerGets,
      };
    } else {
      console.log("No existing offers found, creating a new offer...");
      offer = {
        TakerPays: {
          currency: "XRP",
          issuer: XRPLStaking.ISSUER_ADDRESS,
          value: amount.toString(),
        },
        TakerGets: {
          currency: XRPLStaking.PFMU_CURRENCY,
          issuer: XRPLStaking.ISSUER_ADDRESS,
          value: (amount / 2).toString(), // Example conversion rate (update dynamically)
        },
      };
    }

    // Prepare Payment Transaction
    const purchaseResult = await purchaseCruViaMakeOfferABI(client, wallet, generatedOffer, amount);
    console.log("CRU purchase successful:", purchaseResult);

    if (!purchaseResult.success) {
      await client.disconnect();
      return res.status(400).json({ error: "CRU purchase failed", details: purchaseResult });
    } else {
      console.log("CRU purchase successful:", purchaseResult);
      return res.json({
        message: "PFMU purchase successful!",
        transactionHash: purchaseResult.transactionHash,
      });
    }
  } catch (error) {
    if (client.isConnected()) {
      await client.disconnect();
      console.log("Disconnected from XRPL client");
    }

    console.error("Error in /buy-pfmu:", error);
    return res.status(500).json({ error: error.message });
  } finally {
    if (client.isConnected()) {
      await client.disconnect();
      console.log("Disconnected from XRPL client");
    }
  }
});

module.exports = router;

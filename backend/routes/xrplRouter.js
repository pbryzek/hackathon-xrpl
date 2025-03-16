const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");
const XRPLStaking = require("../services/xrplService");
const { setupTrustLine, purchaseCruViaMakeOfferABI } = require("../helpers/xrplHelper");
const { getUserPFMUs, stakePFMU } = require("../services/bondService");

async function createAndFundWallet() {
  const client = new xrpl.Client("wss://s.altnet.rippletest.net:51233");
  await client.connect();

  // 🔹 Generate a new wallet
  const newWallet = xrpl.Wallet.generate();
  console.log("Mnemonic:", newWallet.mnemonic);
  console.log("Classic Address:", newWallet.classicAddress);
  console.log("Seed:", newWallet.seed);
  console.log("Private Key:", newWallet.privateKey);

  // 🔹 FUND THE WALLET USING THE TESTNET FAUCET
  console.log("Funding wallet with Testnet XRP...");
  const faucetResult = await client.fundWallet(newWallet);

  console.log("Wallet funded:", faucetResult);

  // 🔹 VERIFY WALLET ACTIVATION
  const accountInfo = await client.request({
    command: "account_info",
    account: newWallet.classicAddress,
    ledger_index: "current",
  });

  console.log("Account Info:", accountInfo);

  await client.disconnect();
  return newWallet;
}

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
    const balance = await getUserPFMUs(address);
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
    const result = await stakePFMU(walletSecret, amount);
    if (result) {
      res.status(200).json({ success: true, transaction: result });
    } else {
      res.status(500).json({ success: false, error: "PFMU Stake already at capacity" });
    }
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
  console.log("XRPL_SERVER: ", XRPLStaking.XRPL_SERVER);
  await client.connect();
  try {
    const newWallet = await createAndFundWallet();
    console.log("Our new wallet is:", newWallet.address);
    await setupTrustLine(client, newWallet, XRPLStaking.PFMU_CURRENCY_HEX, XRPLStaking.ISSUER_ADDRESS);
    console.log("TrustSet transaction submitted");
    const accountInfo = await client.request({
      command: "account_info",
      account: XRPLStaking.ISSUER_ADDRESS,
      ledger_index: "validated",
    });
    console.log("Available XRP:", accountInfo.result.account_data.Balance / 1000000, "XRP");
    const trustLines = await client.request({
      command: "account_lines",
      account: XRPLStaking.ISSUER_ADDRESS,
    });
    console.log(trustLines);

    //Create Offer
    const xrpl_service = new XRPLStaking();

    const existingOffers = await xrpl_service.getSellOffers();
    //const existingOffers = await getExistingOffers(client, XRPLStaking.PFMU_CURRENCY, XRPLStaking.ISSUER_ADDRESS);
    let offer;

    if (existingOffers.length > 0) {
      console.log("Using existing offer:", existingOffers[0]);
      offer = existingOffers[0];
    } else {
      console.log("No existing offers found, creating a new offer...");
      offer = {
        TakerPays: {
          currency: "XRP",
          issuer: XRPLStaking.ISSUER_ADDRESS,
          value: amount.toString(),
        },
        TakerGets: {
          currency: XRPLStaking.PFMU_CURRENCY_HEX,
          issuer: XRPLStaking.ISSUER_ADDRESS,
          value: (amount / 2).toString(), // Example conversion rate (update dynamically)
        },
      };
    }

    // Prepare Payment Transaction
    console.log("purhasing crus...");
    const purchaseResult = await purchaseCruViaMakeOfferABI(client, newWallet, offer, amount);
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
    console.log("/buy-pfmu finished without crashing");
    if (client.isConnected()) {
      await client.disconnect();
      console.log("Disconnected from XRPL client");
    }
  }
});

module.exports = router;

const express = require("express");
const router = express.Router();
const xrpl = require("xrpl");
const XRPLStaking = require("../services/xrplService");

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
router.post("/stake-pfmu", async (req, res) => {
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
  const { walletSecret, amount } = req.body;

  try {
    console.log("/buy-pfmu");
    console.log(XRPLStaking.XRPL_SERVER);
    const client = new xrpl.Client(XRPLStaking.XRPL_SERVER);
    await client.connect();

    // Load wallet from secret
    const wallet = xrpl.Wallet.fromSeed(walletSecret);

    console.log("TrustSet /buy-pfmu");

    // Prepare a Trust Set transaction if required
    const trustSetTx = {
      TransactionType: "TrustSet",
      Account: wallet.classicAddress,
      LimitAmount: {
        currency: CURRENCY_CODE,
        issuer: ISSUER_ADDRESS,
        value: "1000000", // Set a high enough trust limit
      },
    };

    const preparedTrustSet = await client.autofill(trustSetTx);
    const signedTrustSet = wallet.sign(preparedTrustSet);
    await client.submitAndWait(signedTrustSet.tx_blob);

    // Prepare Payment Transaction
    const paymentTx = {
      TransactionType: "Payment",
      Account: wallet.classicAddress,
      Destination: ISSUER_ADDRESS,
      Amount: {
        currency: CURRENCY_CODE,
        value: amount,
        issuer: ISSUER_ADDRESS,
      },
    };

    const preparedPayment = await client.autofill(paymentTx);
    const signedPayment = wallet.sign(preparedPayment);
    const result = await client.submitAndWait(signedPayment.tx_blob);

    await client.disconnect();

    if (result.result.meta.TransactionResult === "tesSUCCESS") {
      return res.json({
        message: "PFMU purchase successful!",
        transactionHash: result.result.hash,
      });
    } else {
      return res.status(400).json({
        error: "Transaction failed",
        details: result.result.meta,
      });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;

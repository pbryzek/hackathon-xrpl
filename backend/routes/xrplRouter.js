const express = require("express");
const router = express.Router();

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
    const { userSecret, amount } = req.body;
    if (!userSecret || !amount) {
      return res.status(400).json({ success: false, error: "Missing userSecret or amount" });
    }

    const xrplService = new XRPLService();
    const result = await xrplService.stakePFMU(userSecret, amount);
    res.status(200).json({ success: true, transaction: result });
  } catch (error) {
    console.error("❌ Error staking PFMU:", error);
    res.status(500).json({ success: false, error: "Failed to stake PFMU" });
  }
});

module.exports = router;

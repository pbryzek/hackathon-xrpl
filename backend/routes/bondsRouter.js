const express = require("express");
const router = express.Router();
const { getAllBonds, addBond, getPendingBonds, getClosedBonds, getBondById } = require("../services/bondService");

const { successJSON, failJSON } = require("../utils/responseUtils");
const Bond = require("../models/Bond");

// Get all Active Green Bonds
router.get("/active", async (req, res) => {
  try {
    const bonds = await getAllBonds();

    // Filter active bonds
    const activeBonds = bonds.filter(bond => {
      const totalInvested = bond.investors.reduce((sum, investor) => sum + investor.investmentAmount, 0);
      return totalInvested < bond.amount;
    });
    res.status(200).json(successJSON("activeBonds: success", activeBonds));
  } catch (err) {
    res.status(500).json(failJSON(err));
  }
});

// Get all Closed Green Bonds
router.get("/closed", async (req, res) => {
  try {
    const closedBonds = await getClosedBonds();
    res.status(200).json(successJSON("closedBonds: success", closedBonds));
  } catch (err) {
    res.status(500).json(failJSON(err));
  }
});

// Express API route for pending bonds
router.get("/all", async (req, res) => {
  try {
    const allBonds = await getAllBonds();
    res.status(200).json(successJSON("allBonds: success", { all_bonds: allBonds }));
  } catch (err) {
    console.error("Error fetching all bonds:", err);
    res.status(500).json(failJSON(err.message));
  }
});

// Express API route for pending bonds
router.get("/pending", async (req, res) => {
  try {
    const pendingBonds = await getPendingBonds();
    res.status(200).json(successJSON("pendingBonds: success", { pending_bonds: pendingBonds }));
  } catch (err) {
    console.error("Error fetching pending bonds:", err);
    res.status(500).json(failJSON(err.message));
  }
});

// Get Bond Id
router.get("/:id", async (req, res) => {
  const bond = await getBondById(req.params.id);
  if (!bond) return res.status(404).json(failJSON("Bond not found"));
  res.status(200).json(successJSON("Bond found: success", bond));
});

// Issue a new Green Bond
router.post("/", async (req, res) => {
  try {
    const { name, amount, issuer, interestRate, description } = req.body;
    if (!name || !amount || !issuer || !interestRate || !description) {
      return res
        .status(400)
        .json(failJSON("Missing required fields: name, amount, issuer, interestRate, and description."));
    }
    const newBond = new Bond(name, issuer, amount, interestRate, description);
    await addBond(newBond);
    res.status(200).json(successJSON("Green Bond issued successfully", newBond));
  } catch (err) {
    res.status(500).json(failJSON(err.message));
  }
});

// Stake in a Green Bond
router.post("/:id/stake", async (req, res) => {
  try {
    const { amount, project, issuanceDate, userSecret } = req.body;
    if (!amount || !project || !issuanceDate || !userSecret) {
      return res.status(400).json(failJSON("Missing required fields: amount, project, issuanceDate, userSecret"));
    }
    const bond = await getBondById(req.params.id);
    if (!bond) return res.status(404).json(failJSON("Bond not found"));

    bond.stakePFMU(userSecret, amount, project, issuanceDate, expirationDate);
    await updateBondsFile(bond);

    res.status(200).json(successJSON("PFMU stake successful", bond));
  } catch (err) {
    res.status(500).json(failJSON(err.message));
  }
});

// Invest in a Green Bond
router.post("/:id/invest", async (req, res) => {
  try {
    const { name, amount, bondId, walletAddress } = req.body;
    if (!name || !amount || !bondId || !walletAddress) {
      return res.status(400).json(failJSON("Missing required fields: name, amount, bondId, walletAddress"));
    }
    const bond = await getBondById(req.params.id);
    if (!bond) return res.status(404).json(failJSON("Bond not found"));
    bond.addInvestor(name, amount, bondId, walletAddress);
    await updateBondsFile(bond);
    res.status(200).json(successJSON("Investment successful", bond));
  } catch (err) {
    res.status(500).json(failJSON(err.message));
  }
});

module.exports = router;

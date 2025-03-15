require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Get all Green Bonds
app.get("/activeBonds", async (req, res) => {
  try {
    const retData = {
      active_bonds: [],
    };
    res.status(200).json(createSuccessJSON("activeBonds: success", retData));
  } catch (err) {
    res.status(500).json(createFailJSON(err));
  }
});

// Issue a new Green Bond
app.post("/activeBonds", async (req, res) => {
  try {
    const newBond = new GreenBond(req.body);
    await newBond.save();
    res.status(201).json({ message: "Green Bond issued successfully", bond: newBond });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/pendingBonds", async (req, res) => {
  const retData = {
    pending_bonds: [],
  };
  res.status(200).json(createSuccessJSON("activeBonds: success", retData));
});

// Issue a new Green Bond
app.post("/pendingBonds", async (req, res) => {
  try {
    const bonds = readBondsFromFile();
    const { name, amount, issuer, interestRate, description, investors } = req.body;

    const threeMonths = 1000;
    const maturityDate = Date.now().toString() + threeMonths;
    const newBond = {
      name: name,
      issuer: issuer,
      amount: amount,
      interestRate: interestRate,
      maturityDate: maturityDate,
      description: description,
      investors: investors,
    };

    bonds.push(newBond);
    writeBondsToFile(bonds);

    res.status(201).json({ message: "Green Bond issued successfully", bond: newBond });
  } catch (err) {
    res.status(500).json(createFailJSON(err.message));
  }
});

// Get Green Bond details by ID
app.get("/bonds/:id", async (req, res) => {
  try {
    const bond = await Bond.findById(req.params.id);
    if (!bond) return res.status(404).json({ message: "Bond not found" });
    res.status(200).json(bond);
  } catch (err) {
    res.status(500).json(createFailJSON(err.message));
  }
});

// Invest in a Green Bond
app.post("/bonds/:id/invest", async (req, res) => {
  try {
    const { name, amount } = req.body;
    const bond = await Bond.findById(req.params.id);
    if (!bond) return res.status(404).json({ message: "Bond not found" });

    bond.investors.push({ name, amount });
    await bond.save();
    res.status(200).json({ message: "Investment successful", bond });
  } catch (err) {
    res.status(500).json(createFailJSON(err.message));
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

function createSuccessJSON(msg, data) {
  let retData = {
    success: true,
    message: msg,
    data: data,
  };
  return retData;
}

/**
 * Creates a JSON object with success set to false and a specified message.
 *
 * @param {string} msg - The message to be included in the JSON object.
 * @return {Object} retData - The JSON object with success, message, and data properties.
 */
function createFailJSON(msg) {
  let retData = {
    success: false,
    message: msg,
  };
  return retData;
}

const fs = require("fs");
const path = require("path");

const BONDS_FILE = path.join(__dirname, "pendingBonds.json");

// Helper function to read existing bonds
const readBondsFromFile = () => {
  try {
    if (fs.existsSync(BONDS_FILE)) {
      const data = fs.readFileSync(BONDS_FILE, "utf8");
      return JSON.parse(data) || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error reading bonds file:", error);
    return [];
  }
};

// Helper function to write bonds to file
const writeBondsToFile = bonds => {
  try {
    fs.writeFileSync(BONDS_FILE, JSON.stringify(bonds, null, 2), "utf8");
  } catch (error) {
    console.error("Error writing bonds file:", error);
  }
};

// Issue a new Green Bond (write to JSON file)
app.post("/pendingBonds", (req, res) => {
  try {
    const bonds = readBondsFromFile();

    const newBond = {
      id: Date.now().toString(),
      ...req.body,
    };

    bonds.push(newBond);
    writeBondsToFile(bonds);

    res.status(201).json({ message: "Green Bond issued successfully", bond: newBond });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

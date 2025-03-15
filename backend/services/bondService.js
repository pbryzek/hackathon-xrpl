const fs = require("fs").promises;
const path = require("path");
const BONDS_FILE = path.resolve(__dirname, "../data/bonds.json");
const XRPLStaking = require("../services/xrplService");
const PFMU = require("../models/Pfmu");

async function getBondById(id) {
  try {
    const data = await fs.readFile(BONDS_FILE, "utf-8");
    const bonds = JSON.parse(data);
    for (const bond of bonds) {
      console.log(bond.id);
      if (bond.id == id) {
        return bond;
      }
    }
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
}

// Function to get all bonds from JSON file
async function getAllBonds() {
  try {
    const data = await fs.readFile(BONDS_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error("Error reading bonds file:", error);
    return [];
  }
}

// Function to get pending bonds
async function getPendingBonds() {
  try {
    const bonds = await getAllBonds();
    let pendingBonds = [];
    for (const bond of bonds) {
      let total_pfmus = 0;
      for (const pfmu of bond.pfmus) {
        total_pfmus += pfmu.quantity;
      }
      if (total_pfmus < bond.pfmus_capacity) {
        pendingBonds.push(bond);
      }
    }
    return pendingBonds;
  } catch (error) {
    console.error("Error fetching pending bonds:", error);
    return [];
  }
}

// Function to get pending bonds
async function getActiveBonds() {
  const bonds = await getAllBonds();
  let activeBonds = [];
  for (const bond of bonds) {
    let pfmusStaked = 0;
    for (pfmu of bond.pfmus) {
      pfmusStaked += pfmu.amount;
    }
    console.log("pfmusStaked " + pfmusStaked);
    console.log("bond.pfmus_capacity " + bond.pfmus_capacity);

    if (pfmusStaked >= bond.pfmus_capacity) {
      activeBonds.push(bond);
    }
  }
  console.log("activeBonds activeBonds " + activeBonds);
  return activeBonds;
}

// Function to get pending bonds
async function getClosedBonds() {
  try {
    const bonds = await getAllBonds();
    console.log("bonds ", bonds);

    // Filter closed Bonds
    const closedBonds = bonds.filter(bond => {
      const totalInvested = bond.investors.reduce((sum, investor) => sum + investor.investmentAmount, 0);
      return totalInvested >= bond.amount;
    });

    return closedBonds;
  } catch (error) {
    console.error("Error fetching closed bonds:", error);
    return [];
  }
}

// Helper function to read existing bonds
const readBondsFromFile = async () => {
  try {
    if (fileExists(BONDS_FILE)) {
      const data = await fs.readFile(BONDS_FILE, "utf8");
      return JSON.parse(data) || [];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error reading bonds file:", error);
    return [];
  }
};

async function fileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// ✅ Auto-Increment and Add a New Bond
async function addBond(newBond) {
  try {
    // Get all bonds
    const bonds = await getAllBonds();

    // Get the last bond's ID and increment it (fallback to 1 if no bonds exist)
    const lastId = bonds.length > 0 ? Math.max(...bonds.map(bond => bond.id)) : 0;
    const newId = lastId + 1;

    // Assign the new ID to the bond
    const bondWithId = { id: newId, ...newBond };

    // Add to the array and write to file
    bonds.push(bondWithId);
    await writeBondsToFile(bonds);

    console.log(`✅ Bond added successfully with ID: ${newId}`);
    return bondWithId;
  } catch (error) {
    console.error("❌ Error adding bond:", error);
    return null;
  }
}

// Helper function to write bonds to file
async function writeBondsToFile(bonds) {
  try {
    await fs.writeFile(BONDS_FILE, JSON.stringify(bonds, null, 2), "utf-8");
    console.log("Bonds file updated successfully!");
  } catch (error) {
    console.error("Error writing bonds file:", error);
  }
}

// Function to update bond in the file
async function updateBondsFile(updatedBond) {
  try {
    const data = await fs.readFile(BONDS_FILE, "utf-8");
    let bonds = JSON.parse(data);

    // Replace the bond in the array
    bonds = bonds.map(bond => (bond.id === updatedBond.id ? updatedBond : bond));

    // Write back the updated list
    await fs.writeFile(BONDS_FILE, JSON.stringify(bonds, null, 2));
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
}

async function stakePFMU(walletSecret, amount, project, issuanceDate, expirationDate, bond) {
  let total_amount = 0;
  for (const bond_pfmu of bond.pfmus) {
    total_amount += bond_pfmu.amount;
  }

  if (total_amount >= bond.pfmus_capacity) {
    console.error("Error unable to stake: as this would exceed the PFMU capacity");
    return;
  }
  const pfmu = new PFMU(amount, project, issuanceDate, expirationDate);
  const staking = new XRPLStaking();
  staking.stakePFMU(walletSecret, pfmu);
  bond.pfmus.push(pfmu);
  await updateBondsFile(bond);
}

// Export the functions
module.exports = {
  updateBondsFile,
  writeBondsToFile,
  readBondsFromFile,
  getBondById,
  getPendingBonds,
  getAllBonds,
  getClosedBonds,
  addBond,
  stakePFMU,
  getActiveBonds,
};

const fs = require("fs").promises;
const path = require("path");
const BONDS_FILE = path.resolve(__dirname, "../data/bonds.json");

const getBondById = async id => {
  try {
    const data = await fs.readFile(BONDS_FILE, "utf-8");
    const bonds = JSON.parse(data);
    return bonds.find(bond => bond.id === id);
  } catch (error) {
    console.error("Error reading JSON file:", error);
    return null;
  }
};

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
async function getClosedBonds() {
  try {
    const bonds = await getAllBonds();

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

// Helper function to write bonds to file
async function writeBondsToFile(bonds) {
  try {
    console.log(BONDS_FILE);
    console.log(JSON.stringify(bonds, null, 2));

    await fs.writeFile(BONDS_FILE, JSON.stringify(bonds, null, 2), "utf-8");
    console.log("Bonds file updated successfully!");
  } catch (error) {
    console.error("Error writing bonds file:", error);
  }
}

// Function to update bond in the file
async function updateBondsFile(updatedBond) {
  try {
    const data = await fs.readFile(bondsFilePath, "utf-8");
    let bonds = JSON.parse(data);

    // Replace the bond in the array
    bonds = bonds.map(bond => (bond.id === updatedBond.id ? updatedBond : bond));

    // Write back the updated list
    await fs.writeFile(bondsFilePath, JSON.stringify(bonds, null, 2));
  } catch (error) {
    console.error("Error writing to JSON file:", error);
  }
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
};

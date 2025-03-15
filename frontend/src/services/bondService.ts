const BOND_DOMAIN = import.meta.env.BOND_DOMAIN || 'http://localhost:5001'; // ✅ Ensure this is correctly set

// ✅ Fetch User PFMU Balance
export const getUserPFMUs = async () => {
  try {
    const url = `${BOND_DOMAIN}/get-user-pfmu/rrrrrrrrrrrrrrrrrrrrrhoLvTp`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.pfmuBalance;
  } catch (error) {
    console.error("Error fetching user PFMUs:", error);
    throw error;
  }
};

// ✅ Stake PFMU
export const stakePFMU = async (bondId: string) => {
  try {
    
    const url = `${BOND_DOMAIN}/stake-pfmu`;
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bondId })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error staking PFMU:", error);
    throw error;
  }
};

// ✅ Fetch Active Bonds
export const getActiveBonds = async () => {
  try {
    const url = `${BOND_DOMAIN}/bonds/active`;
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching active bonds:", error);
    throw error;
  }
};

export const getPendingBonds = async () => {
  try {
    const url = `${BOND_DOMAIN}/bonds/pending`;
    console.log("Fetching pending bonds from:", url); // ✅ Debugging

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API Response:", data); // ✅ Debugging API response structure

    return data.data.pending_bonds || []; // ✅ Correctly extracts "pending_bonds"
  } catch (error) {
    console.error("Error fetching pending bonds:", error);
    throw error;
  }
};



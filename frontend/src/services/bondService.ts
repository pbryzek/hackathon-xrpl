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
    
    const url = `${BOND_DOMAIN}/stake?project=Brazil Rancho Da Montanha 03182024&issuanceDate=2025-01-31T00:00:00Z&userSecret=SECRETSECRETSECRETSECRET`;
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
    console.log("Fetching active bonds from:", url);
    
    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Active bonds response:", data);
    
    // Process the response to extract bonds
    if (data.bonds && Array.isArray(data.bonds)) {
      return { bonds: data.bonds };
    } else if (data.data && data.data.bonds && Array.isArray(data.data.bonds)) {
      return { bonds: data.data.bonds };
    } else if (Array.isArray(data)) {
      return { bonds: data };
    } else {
      console.warn("Unexpected response structure from bonds/active:", data);
      return { bonds: [] };
    }
  } catch (error) {
    console.error("Error fetching active bonds:", error);
    return { bonds: [] }; // Return empty array instead of throwing to prevent cascading errors
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



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

export const buyPFMUTokens = async (amount: number, walletAddress: string) => {
  try {
    const url = `${BOND_DOMAIN}/xrpl/buy-pfmu`;
    console.log("🔹 API Request: ", url);
    console.log("🔹 Sending Wallet Address:", walletAddress, "Amount:", amount);

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: amount,
        walletSecret: walletAddress, // 🔹 Make sure this matches the backend
      }),
    });

    if (!response.ok) {
      console.error("❌ HTTP error! Status:", response.status);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ API Response:", data);
    return data;
  } catch (error) {
    console.error("❌ Error buying PFMU tokens:", error);
    throw error;
  }
};


// ✅ Stake PFMU with Wallet Address
export const stakePFMU = async (walletAddress: string, bondId: string) => {
  try {
    const url = `${BOND_DOMAIN}/stake?project=Brazil Rancho Da Montanha 03182024&issuanceDate=2025-01-31T00:00:00Z&userSecret=${walletAddress}`;

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bondId }),
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

// ✅ Fetch All Bonds
export const getAllBonds = async () => {
  try {
    const url = `${BOND_DOMAIN}/bonds/all`;
    console.log("Fetching all bonds from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("All bonds response:", data);

    // Handle the specific response structure we're seeing in the console
    if (data.data && data.data.all_bonds && Array.isArray(data.data.all_bonds)) {
      return data.data.all_bonds;
    } else if (data.data && data.data.bonds) {
      return data.data.bonds;
    } else if (data.bonds) {
      return data.bonds;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      console.warn("Unexpected response structure from bonds/all:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching all bonds:", error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};

// ✅ Fetch Open Bonds
export const getOpenBonds = async () => {
  try {
    const url = `${BOND_DOMAIN}/bonds/open`;
    console.log("Fetching open bonds from:", url);

    // Add timeout to prevent hanging requests
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal
    });

    clearTimeout(timeoutId); // Clear the timeout if the request completes

    if (!response.ok) {
      console.error(`HTTP error! Status: ${response.status}`);
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Open bonds response:", data);

    // Handle different possible response structures
    if (data.data && data.data.open_bonds && Array.isArray(data.data.open_bonds)) {
      return data.data.open_bonds;
    } else if (data.data && data.data.bonds && Array.isArray(data.data.bonds)) {
      return data.data.bonds;
    } else if (data.open_bonds && Array.isArray(data.open_bonds)) {
      return data.open_bonds;
    } else if (data.bonds && Array.isArray(data.bonds)) {
      return data.bonds;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data.success && data.data && Array.isArray(data.data)) {
      // Handle the format seen in the console: {success: true, message: 'Open Bonds: success', data: Array(1)}
      return data.data;
    } else {
      console.warn("Unexpected response structure from bonds/open:", data);
      return [];
    }
  } catch (error) {
    // Check if it's an abort error (timeout)
    if (error.name === 'AbortError') {
      console.error("Request timed out when fetching open bonds");
    } else {
      console.error("Error fetching open bonds:", error);
    }

    // Return empty array instead of throwing to prevent cascading errors
    return [];
  }
};

// ✅ Invest in a Bond
export const investInBond = async (bondId: string, amount: number, name: string) => {
  try {
    const url = `${BOND_DOMAIN}/bonds/${bondId}/invest`;
    console.log("Investing in bond:", bondId, "amount:", amount, "investor name:", name);
    
    // Using a default wallet address for demo purposes
    const walletAddress = "X7CKi2abDKpCYJRswXKL9dbQmSpR9q8RhCVh6DnLkbB9R8M";
    
    // Ensure the name is properly formatted to avoid confusion with bond names/IDs
    const formattedName = name.startsWith('Investor:') ? name : `Investor: ${name}`;
    
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formattedName,
        amount: amount,
        bondId: bondId,
        walletAddress: walletAddress
      })
    });
    
    if (!response.ok) {
      // Try to get more detailed error information from the response
      try {
        const errorData = await response.json();
        console.error("Investment error details:", errorData);
        throw new Error(`HTTP error! Status: ${response.status}, Details: ${JSON.stringify(errorData)}`);
      } catch (parseError) {
        // If we can't parse the error response, throw the original error
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error investing in bond:", error);
    throw error;
  }
};

// ✅ Fetch All Active Bonds (both open and closed)
export const getAllActiveBonds = async () => {
  try {
    console.log("Fetching all active bonds (open and closed)...");
    
    // Fetch both open and closed bonds in parallel
    const [openBondsResponse, closedBondsResponse] = await Promise.all([
      getOpenBonds(),
      getClosedBonds()
    ]);
    
    // Add status field to each bond
    const openBonds = Array.isArray(openBondsResponse) 
      ? openBondsResponse.map(bond => ({ ...bond, status: 'open' }))
      : [];
      
    const closedBonds = Array.isArray(closedBondsResponse) 
      ? closedBondsResponse.map(bond => ({ ...bond, status: 'closed' }))
      : [];
    
    // Combine the two arrays
    const allActiveBonds = [...openBonds, ...closedBonds];
    
    console.log(`Combined ${openBonds.length} open bonds and ${closedBonds.length} closed bonds`);
    
    return allActiveBonds;
  } catch (error) {
    console.error("Error fetching all active bonds:", error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};

// ✅ Fetch Closed Bonds
export const getClosedBonds = async () => {
  try {
    const url = `${BOND_DOMAIN}/bonds/closed`;
    console.log("Fetching closed bonds from:", url);

    const response = await fetch(url, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Closed bonds response:", data);

    // Handle different possible response structures
    if (data.data && data.data.closed_bonds && Array.isArray(data.data.closed_bonds)) {
      return data.data.closed_bonds;
    } else if (data.data && data.data.bonds && Array.isArray(data.data.bonds)) {
      return data.data.bonds;
    } else if (data.closed_bonds && Array.isArray(data.closed_bonds)) {
      return data.closed_bonds;
    } else if (data.bonds && Array.isArray(data.bonds)) {
      return data.bonds;
    } else if (Array.isArray(data)) {
      return data;
    } else if (data.success && data.data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn("Unexpected response structure from bonds/closed:", data);
      return [];
    }
  } catch (error) {
    console.error("Error fetching closed bonds:", error);
    return []; // Return empty array instead of throwing to prevent cascading errors
  }
};




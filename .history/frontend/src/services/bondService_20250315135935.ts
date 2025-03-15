const BOND_DOMAIN = import.meta.env.VITE_BOND_DOMAIN || 'http://localhost:5001'; // Ensure this is set correctly

export const getUserPFMUs = async () => {
<<<<<<< HEAD
    try {
      const response = await fetch("http://localhost:5000/get-user-pfmu", {
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
  
  export const stakePFMU = async (bondId: string) => {
    try {
      const response = await fetch("http://localhost:5000/stake-pfmu", {
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
=======
  try {
    const response = await fetch(`${BOND_DOMAIN}/xrpl/get-user-pfmu`, {
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

export const stakePFMU = async (bondId: string) => {
  try {
    const response = await fetch(`${BOND_DOMAIN}/bonds/${bondId}/stake`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        bondId,
        // Add other required fields based on the backend API
        amount: 1, // Default amount, adjust as needed
        project: "Default Project", // Default project, adjust as needed
        walletSecret: "YOUR_WALLET_SECRET", // This should be provided by the user securely
        issuanceDate: new Date().toISOString(),
        expirationDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString() // 1 year from now
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
>>>>>>> e20cc3792aaacc558d2178e9ca65886a8a0a045d
    }

    return await response.json();
  } catch (error) {
    console.error("Error staking PFMU:", error);
    throw error;
  }
};

export const getActiveBonds = async () => {
  try {
    console.log("Fetching active bonds from:", `${BOND_DOMAIN}/bonds/active`);
    const response = await fetch(`${BOND_DOMAIN}/bonds/active`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Active bonds response:", data);
    
    // Transform the backend bond data to match the frontend Bond interface
    if (data && data.data) {
      return data.data.map((bond: any) => {
        console.log("Processing bond:", bond);
        return {
          id: bond.id.toString(),
          name: bond.name || "Unnamed Bond",
          issuer: bond.issuer || "Unknown Issuer",
          type: "Corporate", // Default type, adjust based on actual data
          rating: "AA", // Default rating, adjust based on actual data
          yield: bond.interestRate ? (bond.interestRate / 10000) : 4.5, // Convert to percentage
          maturityDate: new Date(bond.maturityDate).toISOString().split('T')[0],
          price: 100, // Default price, adjust based on actual data
          couponRate: bond.interestRate ? (bond.interestRate / 10000) : 4.5, // Convert to percentage
          minimumInvestment: 1000, // Default minimum investment, adjust based on actual data
          status: "Active",
          risk: "Medium", // Default risk, adjust based on actual data
          term: typeof bond.description === 'number' ? `${bond.description} Year` : "5 Year", // Using description as term if it's a number
          description: typeof bond.description === 'string' ? bond.description : "Sustainable green bond for environmental projects."
        };
      });
    }
    
    return [];
  } catch (error) {
    console.error("Error fetching active bonds:", error);
    throw error;
  }
};

// Helper function to calculate term from dates
const calculateTermFromDates = (createdDate: string, maturityDate: string): string => {
  const start = new Date(createdDate);
  const end = new Date(maturityDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return "Unknown";
  }
  
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365));
  
  return `${diffYears} Year`;
};

// Add function to get bond by ID
export const getBondById = async (bondId: string) => {
  try {
    console.log("Fetching bond by ID from:", `${BOND_DOMAIN}/bonds/${bondId}`);
    const response = await fetch(`${BOND_DOMAIN}/bonds/${bondId}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Bond by ID response:", data);
    
    if (data && data.data) {
      const bond = data.data;
      console.log("Processing bond by ID:", bond);
      return {
        id: bond.id.toString(),
        name: bond.name || "Unnamed Bond",
        issuer: bond.issuer || "Unknown Issuer",
        type: "Corporate", // Default type, adjust based on actual data
        rating: "AA", // Default rating, adjust based on actual data
        yield: bond.interestRate ? (bond.interestRate / 10000) : 4.5, // Convert to percentage
        maturityDate: new Date(bond.maturityDate).toISOString().split('T')[0],
        price: 100, // Default price, adjust based on actual data
        couponRate: bond.interestRate ? (bond.interestRate / 10000) : 4.5, // Convert to percentage
        minimumInvestment: 1000, // Default minimum investment, adjust based on actual data
        status: "Active",
        risk: "Medium", // Default risk, adjust based on actual data
        term: typeof bond.description === 'number' ? `${bond.description} Year` : "5 Year", // Using description as term if it's a number
        description: typeof bond.description === 'string' ? bond.description : "Sustainable green bond for environmental projects."
      };
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching bond by ID:", error);
    throw error;
  }
};


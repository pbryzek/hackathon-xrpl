const BOND_DOMAIN = import.meta.env.BOND_DOMAIN || 'http://localhost:5000'; // Ensure this is set correctly

export const getUserPFMUs = async () => {
    try {
      const url=BOND_DOMAIN+"/get-user-pfmu";
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
  
  export const stakePFMU = async (bondId: string) => {
    try {
      const url=BOND_DOMAIN+"/stake-pfmu";
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
  

  export const getActiveBonds = async (bondId: string) => {
    try {
      const url=BOND_DOMAIN+"/bonds/active";
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
  
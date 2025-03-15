const BOND_DOMAIN = import.meta.env.VITE_BOND_DOMAIN || 'http://localhost:5001'; // Ensure this is set correctly

export const getUserPFMUs = async () => {
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
    }
  };
  
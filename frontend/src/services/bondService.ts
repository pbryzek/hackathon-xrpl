const BOND_DOMAIN = import.meta.env.VITE_BOND_DOMAIN || "http://localhost:5000"; // ✅ Uses env variable

export const getUserPFMUs = async () => {
  try {
    const response = await fetch(`${BOND_DOMAIN}/get-user-pfmu`, { // ✅ Uses domain var
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
    const response = await fetch(`${BOND_DOMAIN}/stake-pfmu`, { // ✅ Uses domain var
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

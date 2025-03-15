import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // ✅ Import Link for proper navigation

// API Calls
const getUserPFMUs = async () => {
  try {
    const response = await fetch("http://localhost:5001/get-user-pfmu", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data.pfmuBalance;
  } catch (error) {
    console.error("Error fetching user PFMUs:", error);
    return null;
  }
};

const stakePFMU = async (bondId: string) => {
  try {
    const response = await fetch("http://localhost:5001/stake-pfmu", {
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

const bonds = [
  {
    id: "solar-california",
    title: "Solar Energy Farm - California",
    category: "Solar Energy",
    yield: "5.2%",
    term: "5 years",
    minInvestment: "$5,000",
    impact: "15,000 tons CO₂ reduction/year",
    funded: "$367K",
    goal: "$1.2M",
  },
  {
    id: "wind-texas",
    title: "Wind Power Project - Texas",
    category: "Wind Energy",
    yield: "4.8%",
    term: "7 years",
    minInvestment: "$10,000",
    impact: "22,500 tons CO₂ reduction/year",
    funded: "$581K",
    goal: "$1.2M",
  },
];

const BondPage = () => {
  const [pfmuBalance, setPfmuBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stakeMessage, setStakeMessage] = useState<string | null>(null);

  // Fetch PFMU balance on mount
  useEffect(() => {
    const fetchBalance = async () => {
      const balance = await getUserPFMUs();
      setPfmuBalance(balance);
      setIsLoading(false);
    };
    fetchBalance();
  }, []);

  // Handle Staking
  const handleStake = async (bondId: string) => {
    setStakeMessage(null);
    try {
      const response = await stakePFMU(bondId);
      setStakeMessage(`Successfully staked in ${bondId}!`);
    } catch (error) {
      setStakeMessage("Error staking. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="header flex justify-between items-center w-full px-6">
        <h1 className="logo text-2xl">XRPL Green Bonds</h1>
        <nav className="flex space-x-4">
          <Link to="/bonds" className="nav-link active">Bonds</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/" className="nav-link">Sign In</Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="mt-20 text-center">
        <h2 className="text-4xl font-bold">Green Bond Offerings</h2>
        <p className="mt-2 text-lg opacity-75">
          Invest in verified environmental projects with transparent impact metrics and competitive returns.
        </p>
      </section>

      {/* PFMU Balance */}
      <div className="mt-6 text-center">
        {isLoading ? (
          <p>Loading PFMU balance...</p>
        ) : (
          <p className="text-lg">Your PFMU Balance: <strong>{pfmuBalance ?? "Error loading balance"}</strong></p>
        )}
      </div>

      {/* Bonds Listing */}
      <div className="flex flex-wrap justify-center gap-8 mt-8">
        {bonds.map((bond) => (
          <div key={bond.id} className="glass-card p-6 w-96">
            <h3 className="text-xl font-semibold">{bond.title}</h3>
            <p className="text-sm opacity-75">{bond.category}</p>
            <p><strong>Yield:</strong> {bond.yield}</p>
            <p><strong>Term:</strong> {bond.term}</p>
            <p><strong>Minimum:</strong> {bond.minInvestment}</p>
            <p><strong>Impact:</strong> {bond.impact}</p>
            <div className="flex justify-between mt-4 text-sm opacity-75">
              <span>Funded: {bond.funded}</span>
              <span>Goal: {bond.goal}</span>
            </div>
            <button
              className="glass-button mt-4 w-full"
              onClick={() => handleStake(bond.id)}
            >
              Stake PFMU
            </button>
          </div>
        ))}
      </div>

      {/* Stake Message */}
      {stakeMessage && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{stakeMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BondPage;

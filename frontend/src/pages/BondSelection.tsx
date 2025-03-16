import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingBonds, stakePFMU } from "../services/bondService"; // ✅ Import API services

const BondPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingBonds, setPendingBonds] = useState<any[]>([]);
  const [stakeMessage, setStakeMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bonds = await getPendingBonds();
        setPendingBonds(bonds);
      } catch (error) {
        console.error("Error fetching pending bonds:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Handle Staking
  const handleStake = async (bondId: string) => {
    setStakeMessage(null);
    try {
      await stakePFMU(bondId);
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
      <section className="mt-50 text-center">
        <div className="green-bond-offerings">
          <h2 className="text-4xl font-bold">Green Bond Offerings</h2>
        </div>
        <p className="mt-2 text-lg opacity-75">
          Invest in verified environmental projects with transparent impact metrics and competitive returns.
        </p>
      </section>

      {/* Pending Bonds Listing */}
      <div className="mt-6 text-center">
        {isLoading ? (
          <p>Loading pending bonds...</p>
        ) : pendingBonds.length === 0 ? (
          <p>No pending bonds available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8 place-items-center w-full max-w-6xl">
            {pendingBonds.map((bond) => (
              <div key={bond.id} className="bond-card glass-card p-6 w-full max-w-[400px]">
                <h3 className="text-xl font-semibold text-green-300">{bond.name}</h3> 
                <p className="text-sm opacity-75"><strong>Issuer:</strong> {bond.issuer}</p>
                <p><strong>Interest Rate:</strong> {bond.interestRate}%</p>
                <p><strong>Created Date:</strong> {new Date(bond.createdDate).toLocaleDateString()}</p>
                <p><strong>Maturity Date:</strong> {new Date(bond.maturityDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {bond.description}</p>
                <p><strong>Capacity:</strong> {bond.pfmus_capacity}</p>
                <p><strong>Investors:</strong> {bond.investors.length}</p>

                {/* ✅ New Field: Number of Stakers */}
                <p><strong>Number of Stakers:</strong> {bond.pfmus.length}</p>

                {/* ✅ Progress Bar */}
                <div className="progress-bar-container mt-4">
                  <div className="progress-bar" style={{ width: `${bond.pfmus_capacity * 100}%` }}></div>
                </div>

                {/* ✅ Stake PFMU Button */}
                <button
                  className="stake-button mt-4 w-full"
                  onClick={() => handleStake(bond.id)}
                >
                  Stake PFMU
                </button>
              </div>
            ))}
          </div>
        )}
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

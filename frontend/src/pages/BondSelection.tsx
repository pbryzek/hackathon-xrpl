import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  // getUserPFMUs,  // ✅ Commented out (not currently needed)
  // stakePFMU,  // ✅ Commented out (not currently needed)
  getPendingBonds 
} from "../services/bondService"; // ✅ Import API services

const BondPage = () => {
  // const [pfmuBalance, setPfmuBalance] = useState<number | null>(null); // ✅ Commented out (not currently needed)
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [stakeMessage, setStakeMessage] = useState<string | null>(null);
  const [pendingBonds, setPendingBonds] = useState<any[]>([]); // ✅ Store pending bonds

  // ✅ Fetch pending bonds on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // const balance = await getUserPFMUs(); // ✅ Commented out (not currently needed)
        const bonds = await getPendingBonds();
        // setPfmuBalance(balance); // ✅ Commented out (not currently needed)
        setPendingBonds(bonds);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Commented out staking functionality
  /*
  const handleStake = async (bondId: string) => {
    setStakeMessage(null);
    try {
      await stakePFMU(bondId);
      setStakeMessage(`Successfully staked in ${bondId}!`);
    } catch (error) {
      setStakeMessage("Error staking. Try again.");
    }
  };
  */

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

      {/* Pending Bonds Listing */}
      <div className="mt-6 text-center">
        {isLoading ? (
          <p>Loading pending bonds...</p>
        ) : pendingBonds.length === 0 ? (
          <p>No pending bonds available.</p>
        ) : (
          <div className="flex flex-wrap justify-center gap-8 mt-8">
            {pendingBonds.map((bond) => (
              <div key={bond.id} className="glass-card p-6 w-96">
                <h3 className="text-xl font-semibold">{bond.name}</h3> {/* ✅ Adjusted property to match API */}
                <p className="text-sm opacity-75"><strong>Issuer:</strong> {bond.issuer}</p>
                <p><strong>Interest Rate:</strong> {bond.interestRate}</p>
                <p><strong>Created Date:</strong> {new Date(bond.createdDate).toLocaleDateString()}</p>
                <p><strong>Maturity Date:</strong> {new Date(bond.maturityDate).toLocaleDateString()}</p>
                <p><strong>Description:</strong> {bond.description}</p>
                <p><strong>Capacity:</strong> {bond.pfmus_capacity}</p>
                <p><strong>Investors:</strong> {bond.investors.length}</p>

                {/* <button
                  className="glass-button mt-4 w-full"
                  onClick={() => handleStake(bond.id)}
                >
                  Stake PFMU
                </button> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stake Message (Hidden for now) */}
      {stakeMessage && (
        <div className="mt-4 text-center">
          <p className="text-lg font-semibold">{stakeMessage}</p>
        </div>
      )}
    </div>
  );
};

export default BondPage;

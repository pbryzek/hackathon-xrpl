import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPendingBonds, stakePFMU, buyPFMUTokens } from "../services/bondService"; // ✅ Import API services

const BondPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [pendingBonds, setPendingBonds] = useState<any[]>([]);
  const [stakeMessage, setStakeMessage] = useState<string | null>(null);
  const [buyTokensLoading, setBuyTokensLoading] = useState(false);
  const [tokenAmount, setTokenAmount] = useState<number>(100); // Default amount
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);

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

  // Clear success notification after 5 seconds
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showSuccessNotification) {
      timer = setTimeout(() => {
        setShowSuccessNotification(false);
        setStakeMessage(null);
      }, 5000);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [showSuccessNotification]);

  // ✅ Handle Staking
  const handleStake = async (bondId: string) => {
    setStakeMessage(null);
    try {
      await stakePFMU(bondId);
      setStakeMessage(`Successfully staked in ${bondId}!`);
      setShowSuccessNotification(true);
    } catch (error) {
      setStakeMessage("Error staking. Try again.");
    }
  };

  // ✅ Handle Buy PFMU Tokens
  const handleBuyTokens = async () => {
    setBuyTokensLoading(true);
    setStakeMessage(null);
    
    try {
      const result = await buyPFMUTokens(tokenAmount);
      console.log("Token purchase successful:", result);
      setStakeMessage(`Successfully purchased ${tokenAmount} PFMU tokens!`);
      setShowSuccessNotification(true);
      setShowTokenModal(false);
    } catch (error) {
      console.error("Error purchasing tokens:", error);
      setStakeMessage("Error purchasing tokens. Please try again.");
    } finally {
      setBuyTokensLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      {/* Header */}
      <header className="header flex justify-between items-center w-full px-6">
        <Link to="/" className="logo text-2xl no-underline flex items-center gap-2">
          <span className="text-green-600">XRPL</span> Green Bonds
        </Link>
        <nav className="flex space-x-4">
          <Link to="/bonds" className="nav-link active">Bonds</Link>
          <Link to="/marketplace" className="nav-link">Marketplace</Link>
          <Link to="/" className="nav-link">Sign In</Link>
        </nav>
      </header>

      {/* Hero Section with Buy Tokens Button */}
      <div className="container mx-auto px-6 mt-50">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="green-bond-offerings text-center sm:text-left">
            <h2 className="text-4xl font-bold">Green Bond Offerings</h2>
          </div>
          {/* Buy Tokens Button */}
          <button 
            className="buy-tokens-button flex items-center gap-2"
            onClick={() => setShowTokenModal(true)}
            disabled={buyTokensLoading}
          >
            {buyTokensLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                  <circle cx="8" cy="8" r="6" />
                  <path d="M18.09 10.37A6 6 0 1 1 10.34 18" />
                  <path d="M7 6h1v4" />
                  <path d="m16.71 13.88.7.71-2.82 2.82" />
                </svg>
                Buy Tokens
              </>
            )}
          </button>
        </div>
        <p className="text-lg opacity-75 text-center mb-8">
          Invest in verified environmental projects with transparent impact metrics and competitive returns.
        </p>
      </div>

      {/* Token Purchase Modal */}
      {showTokenModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="glass-card max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">Buy PFMU Tokens</h3>
            <p className="mb-4">Enter the amount of PFMU tokens you want to purchase:</p>
            
            <div className="mb-4">
              <label htmlFor="tokenAmount" className="block mb-2">Amount:</label>
              <input 
                type="number" 
                id="tokenAmount"
                value={tokenAmount}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (value > 0) {
                    setTokenAmount(value);
                  }
                }}
                className="w-full p-2 rounded bg-white bg-opacity-20 border border-white border-opacity-30 text-white"
                min="1"
                required
              />
              {tokenAmount <= 0 && (
                <p className="text-red-300 text-sm mt-1">Amount must be greater than 0</p>
              )}
            </div>
            
            <div className="flex justify-end space-x-3">
              <button 
                className="px-4 py-2 rounded bg-white bg-opacity-20 hover:bg-opacity-30 transition-all"
                onClick={() => setShowTokenModal(false)}
                disabled={buyTokensLoading}
              >
                Cancel
              </button>
              <button 
                className="glass-button"
                onClick={handleBuyTokens}
                disabled={buyTokensLoading || tokenAmount <= 0}
              >
                {buyTokensLoading ? 'Processing...' : 'Confirm Purchase'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Notification */}
      {showSuccessNotification && stakeMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
          <div className="glass-card bg-green-500 bg-opacity-20 border border-green-300 border-opacity-50 py-3 px-6 rounded-lg shadow-lg flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-300">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            <p className="text-white font-medium">{stakeMessage}</p>
          </div>
        </div>
      )}

      {/* Stake Message (only show if not in notification) */}
      {stakeMessage && !showSuccessNotification && (
        <div className="mt-4 text-center glass-card py-3 px-6 mb-6">
          <p className="text-lg font-semibold">{stakeMessage}</p>
        </div>
      )}

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
    </div>
  );
};

export default BondPage;

import React, { useState, useEffect } from "react";
import { getUserPFMUs, stakePFMU } from "../services/bondService";

const BondSelection: React.FC = () => {
  const [bonds, setBonds] = useState([
    { id: "bond1", name: "Green Bond Alpha", requiredPFMU: 100, status: "Open" },
    { id: "bond2", name: "Sustainable Energy Bond", requiredPFMU: 200, status: "Pending" },
    { id: "bond3", name: "Eco-Innovation Bond", requiredPFMU: 50, status: "Open" }
  ]);
  const [userPFMUs, setUserPFMUs] = useState<number>(0);
  const [selectedBond, setSelectedBond] = useState<any>(null);
  const [isStaking, setIsStaking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserPFMUs();
  }, []);

  const fetchUserPFMUs = async () => {
    try {
      setError(null);
      const pfmuBalance = await getUserPFMUs();
      setUserPFMUs(pfmuBalance);
    } catch (error) {
      setError("Failed to fetch your PFMU balance. Please try again.");
    }
  };

  const handleSelectBond = (bond: any) => {
    setSelectedBond(bond);
  };

  const handleStake = async () => {
    if (!selectedBond) {
      setError("Please select a bond before staking.");
      return;
    }

    setIsStaking(true);
    try {
      setError(null);
      await stakePFMU(selectedBond.id);
      alert(`Successfully staked into ${selectedBond.name}!`);
      fetchUserPFMUs();
      setSelectedBond(null); // Reset selection after staking
    } catch (error) {
      setError("Staking failed. Please check your balance and try again.");
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="floating glass-card text-center w-[500px]">
        <h2 className="text-2xl font-semibold text-primary mb-4">Select a Green Bond</h2>
        <p className="text-lg text-white/80">Your PFMUs: {userPFMUs}</p>

        {/* 🔥 Display error messages */}
        {error && (
          <div className="text-red-500 bg-red-100 p-2 rounded-lg my-3">
            {error}
          </div>
        )}

        {/* 🔹 Display Bonds */}
        <div className="mt-4">
          {bonds.map((bond) => (
            <div
              key={bond.id}
              onClick={() => handleSelectBond(bond)}
              className={`cursor-pointer bg-secondary text-white p-4 rounded-lg mb-3 shadow-md 
                ${selectedBond?.id === bond.id ? "border-2 border-green-400" : "border border-transparent"}`}
            >
              <h3 className="text-lg font-bold">{bond.name}</h3>
              <p>Required PFMUs: {bond.requiredPFMU}</p>
              <p>Status: {bond.status}</p>
            </div>
          ))}
        </div>

        {/* 🔹 Show Selected Bond */}
        {selectedBond && (
          <div className="bg-gray-800 text-white p-3 rounded-md mt-3">
            <h3 className="text-lg font-bold">{selectedBond.name}</h3>
            <p>Requires: {selectedBond.requiredPFMU} PFMUs</p>
            <button
              className="mt-2 px-4 py-2 rounded-lg bg-primary text-white disabled:opacity-50"
              disabled={userPFMUs < selectedBond.requiredPFMU || isStaking}
              onClick={handleStake}
            >
              {isStaking ? "Staking..." : "Confirm Stake"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BondSelection;

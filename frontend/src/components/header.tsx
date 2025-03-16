import React, { useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { WalletContext } from "./WalletContext"; // ✅ Import Wallet Context

const Header: React.FC = () => {
  const location = useLocation();
  const { walletAddress, walletBalance, setWalletAddress, setWalletBalance } = useContext(WalletContext);

  const isActive = (path: string) => location.pathname.startsWith(path);

  // ✅ Restore Wallet from LocalStorage (Ensures Header Updates)
  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    const storedBalance = localStorage.getItem("walletBalance") || "0";

    if (storedAddress && !walletAddress) {
      setWalletAddress(storedAddress);
    }
    if (storedBalance !== walletBalance) {
      setWalletBalance(storedBalance);
    }
  }, [walletBalance, walletAddress, setWalletAddress, setWalletBalance]); // ✅ Depend on walletBalance

  return (
    <header className="header bg-light-green w-full">
      <div className="container mx-auto flex justify-between items-center px-8 py-3 w-full">

        {/* ✅ Left Side - Logo */}
        <Link to="/" className="logo no-underline flex items-center gap-2">
          <span className="text-green-600 font-bold text-2xl">XRPL</span> 
          <span className="text-gray-900 font-semibold text-xl">Green Bonds</span>
        </Link>

        {/* ✅ Right Side - Navbar + Wallet Info */}
        <div className="flex items-center space-x-6 pr-10">
          <nav className="flex space-x-6">
            <Link to="/bonds" className={`nav-link ${isActive('/bonds') ? 'active' : ''}`}>
              Bonds
            </Link>
            <Link to="/marketplace" className={`nav-link ${isActive('/marketplace') ? 'active' : ''}`}>
              Marketplace
            </Link>
          </nav>

          {/* ✅ Wallet Display - Styled */}
          {walletAddress ? (
            <div className="wallet-info flex items-center bg-white text-gray-900 px-4 py-2 rounded-lg shadow-md">
              <span className="wallet-balance font-semibold">{walletBalance ?? "0"} XRP</span>
              <span className="wallet-address text-gray-600 text-sm ml-2">
                ({walletAddress.substring(0, 6)}...{walletAddress.slice(-4)})
              </span>
            </div>
          ) : (
            <Link to="/" className={`nav-link ${isActive('/') ? 'active' : ''}`}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;

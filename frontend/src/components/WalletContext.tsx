import React, { createContext, useState, useEffect, useContext } from "react";

// ✅ Define Context Type
interface WalletContextType {
  walletAddress: string | null;
  walletBalance: string | null;
  setWalletAddress: (address: string | null) => void;
  setWalletBalance: (balance: string | null) => void;
}

// ✅ Default State (Prevents Undefined Errors)
const defaultState: WalletContextType = {
  walletAddress: null,
  walletBalance: null,
  setWalletAddress: () => {},
  setWalletBalance: () => {},
};

// ✅ Create Context
export const WalletContext = createContext<WalletContextType>(defaultState);

// ✅ Custom Hook for Using Wallet Context
export const useWallet = () => useContext(WalletContext);

// ✅ Provider that Restores Wallet Automatically
export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [walletBalance, setWalletBalance] = useState<string | null>(null);

  useEffect(() => {
    const storedAddress = localStorage.getItem("walletAddress");
    const storedBalance = localStorage.getItem("walletBalance") || "0";

    if (storedAddress) {
      setWalletAddress(storedAddress);
      setWalletBalance(storedBalance);
      console.log("✅ Wallet Restored:", storedAddress, "Balance:", storedBalance);
    }
  }, []);

  return (
    <WalletContext.Provider value={{ walletAddress, walletBalance, setWalletAddress, setWalletBalance }}>
      {children}
    </WalletContext.Provider>
  );
};

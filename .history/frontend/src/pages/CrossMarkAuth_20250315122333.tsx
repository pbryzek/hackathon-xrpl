import React, { useState, useEffect } from "react";
import sdk from "@crossmarkio/sdk";
import * as xrpl from "xrpl";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const CrossMarkAuth: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Crossmark session will not restore automatically.");
  }, []);

  const signInWithCrossmark = async () => {
    setIsLoading(true);
    try {
      console.log("User clicked sign-in, starting authentication...");
      const { response } = await sdk.methods.signInAndWait();
      if (!response || !response.data || !response.data.address) {
        throw new Error("Failed to authenticate with Crossmark");
      }
      const userAccount = response.data.address;
      setAccount(userAccount);
      fetchBalance(userAccount);
      toast.success("Successfully connected to CrossMark wallet");
      setTimeout(() => navigate("/bonds"), 1500);
    } catch (error) {
      console.error("Crossmark sign-in failed:", error);
      toast.error("Failed to connect to CrossMark wallet");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBalance = async (walletAddress: string) => {
    try {
      const client = new xrpl.Client("wss://s.altnet.rippletest.net/");
      await client.connect();
      const response = await client.request({
        command: "account_info",
        account: walletAddress,
        ledger_index: "validated",
      });
      const xrpBalance = xrpl.dropsToXrp(response.result.account_data.Balance);
      setBalance(xrpBalance.toString());
      client.disconnect();
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div className="container mx-auto mt-32 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6 hero-text">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
            Sustainable Investing on the <span className="text-green-400">XRPL</span>
          </h1>
          <p className="text-xl opacity-80 max-w-xl">
            Access verified green bonds on the XRP Ledger blockchain — transparent, secure, and environmentally conscious investing for a sustainable future.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button onClick={signInWithCrossmark} disabled={isLoading} className="glass-button">
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
            <button onClick={() => navigate("/marketplace")} className="bg-transparent text-white px-6 py-3 rounded-xl hover:bg-white/10 transition-all duration-300">
              Explore Marketplace
            </button>
          </div>
          {/* Key Features */}
          <div className="feature-section">
            {["Fast Settlement", "Secure", "Transparent"].map((title, index) => (
              <div key={index} className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="feature-title">{title}</h3>
                <p className="feature-text">{index === 0 ? "Instant transactions on XRPL" : index === 1 ? "Enterprise-grade security" : "Fully verifiable on-chain"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossMarkAuth;

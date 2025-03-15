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
    <div className="container mx-auto mt-200 px-6 pt-48">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8 hero-text">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Sustainable Investing on the <span className="text-green-400">XRPL</span>
          </h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Access verified green bonds on the XRP Ledger blockchain — transparent, secure, and environmentally conscious investing for a sustainable future.
          </p>
          <div className="pt-6 flex flex-wrap gap-6">
            <button onClick={signInWithCrossmark} disabled={isLoading} className="glass-button px-8 py-4 text-lg">
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
            <button onClick={() => navigate("/marketplace")} className="bg-transparent text-white px-8 py-4 text-lg rounded-xl hover:bg-white/10 transition-all duration-300">
              Explore Marketplace
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 text-center">
            {[
              { title: "Fast Settlement", description: "Instant transactions on XRPL", icon: "⚡" },
              { title: "Secure", description: "Enterprise-grade security", icon: "🔒" },
              { title: "Transparent", description: "Fully verifiable on-chain", icon: "📜" },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-8 bg-white/10 rounded-lg shadow-xl">
                <div className="feature-icon flex items-center justify-center w-14 h-14 bg-green-600/30 rounded-full mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-xl text-white">{feature.title}</h3>
                <p className="text-md text-gray-300 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrossMarkAuth;


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
    // Do NOT check localStorage or auto-authenticate
  }, []);

  const signInWithCrossmark = async () => {
    setIsLoading(true);
    try {
      console.log("User clicked sign-in, starting authentication...");
      
      // Step 1: Authenticate via Crossmark
      const { response } = await sdk.methods.signInAndWait();
      if (!response || !response.data || !response.data.address) {
        throw new Error("Failed to authenticate with Crossmark");
      }

      const userAccount = response.data.address;
      setAccount(userAccount);
      fetchBalance(userAccount);
      
      // Step 2: Authentication successful, inform user
      toast.success("Successfully connected to CrossMark wallet");
      
      // Navigate to bonds after successful authentication
      setTimeout(() => {
        navigate("/bonds");
      }, 1500);
      
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

  const handleMarketplaceClick = () => {
    navigate("/marketplace");
  };
  
  return (
    <div className="container mx-auto mt-60 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Hero Section */}
        <div className="space-y-6 hero-text">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight">
            Sustainable Investing on the <span className="text-green-400">XRPL</span>
          </h1>
          <p className="text-xl opacity-80 max-w-xl">
            Access verified green bonds on the XRP Ledger blockchain — transparent, 
            secure, and environmentally conscious investing for a sustainable future.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <button 
              onClick={signInWithCrossmark}
              disabled={isLoading}
              className="glass-button"
            >
              {isLoading ? "Connecting..." : "Connect Wallet"}
            </button>
            <button 
              onClick={handleMarketplaceClick}
              className="bg-transparent text-white px-6 py-3 rounded-xl 
                        hover:bg-white/10 transition-all duration-300"
            >
              Explore Marketplace
            </button>
          </div>
          
          {/* Key Features */}
          <div className="flex justify-center gap-8 mt-40 text-center">
            {[
              { title: "Fast Settlement", description: "Instant transactions on XRPL", icon: "⚡" },
              { title: "Secure", description: "Enterprise-grade security", icon: "🔒" },
              { title: "Transparent", description: "Fully verifiable on-chain", icon: "📜" },
            ].map((feature, index) => (
              <div key={index} className="flex flex-col items-center p-8 bg-white/10 rounded-lg shadow-xl w-1/3">
                <div className="feature-icon flex items-center justify-center w-14 h-14 bg-green-600/30 rounded-full mb-4">
                  <span className="text-3xl">{feature.icon}</span>
                </div>
                <h3 className="font-semibold text-xl text-white">{feature.title}</h3>
                <p className="text-md text-gray-300 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        {/* Authentication Card */}
        <div className="flex justify-center items-center">
        <div className="w-full max-w-md glass-card mt-10 mx-auto">
            <div className="flex flex-col space-y-1.5 p-6">
              <h3 className="text-2xl font-semibold leading-none tracking-tight text-center text-green-300">
                Sign In with CrossMark
              </h3>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {!account ? (
                <>
                  <div className="flex justify-center p-6">
                    <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-lg flex items-center justify-center shadow-lg shadow-green-500/20 floating">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                  </div>
                  <p className="text-center text-sm opacity-80">
                    Connect your XRPL wallet securely using CrossMark to access green bond offerings, manage your portfolio, and track performance.
                  </p>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="p-4 bg-green-800/20 rounded-lg">
                      <p className="text-lg text-white font-medium">Wallet Connected</p>
                      <p className="text-sm font-mono bg-black/20 p-2 rounded mt-2 break-all">{account}</p>
                      <p className="text-sm mt-3 text-green-300">Balance: {balance} XRP</p>
                    </div>
                  </div>
                </>
              )}
            </div>
            <div className="connect-wallet-button">
              <div className="flex items-center p-6 pt-0 justify-center">
                <button 
                  onClick={signInWithCrossmark} 
                  disabled={isLoading || !!account}
                  className={`glass-button w-full ${(isLoading || !!account) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? "Connecting..." : account ? "Connected" : "Connect Wallet"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-100 mb-10">
        <div className="glass-card text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-green-300">$120M+</h3>
          <p className="text-sm opacity-70">Total Bond Value</p>
        </div>
        <div className="glass-card text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-green-300">14</h3>
          <p className="text-sm opacity-70">Green Projects</p>
        </div>
        <div className="glass-card text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-green-300">3,200+</h3>
          <p className="text-sm opacity-70">Investors</p>
        </div>
        <div className="glass-card text-center">
          <h3 className="text-3xl md:text-4xl font-bold text-green-300">99.9%</h3>
          <p className="text-sm opacity-70">Uptime</p>
        </div>
      </div>
    </div>
  );
};

export default CrossMarkAuth;
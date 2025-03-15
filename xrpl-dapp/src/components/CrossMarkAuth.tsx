import React, { useState, useEffect } from "react";
import sdk from "@crossmarkio/sdk";
import * as xrpl from "xrpl";

const CrossmarkAuth: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    console.log("Crossmark session will not restore automatically.");
    // Do NOT check localStorage or auto-authenticate
  }, []);
  

  const signInWithCrossmark = async () => {
    setIsLoading(true);
    try {
      console.log("User clicked sign-in, starting authentication...");
      
      const { response } = await sdk.methods.signInAndWait(); // User-initiated
      if (!response || !response.data || !response.data.address) {
        throw new Error("Failed to authenticate with Crossmark");
      }
  
      const userAccount = response.data.address;
      setAccount(userAccount);
      fetchBalance(userAccount);
    } catch (error) {
      console.error("Crossmark sign-in failed:", error);
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
    <div className="flex justify-center items-center h-screen bg-background">
      <div className="floating glass-card text-center w-[400px]">
        <h2 className="text-2xl font-semibold text-primary mb-4">XRPL + Crossmark DApp</h2>

        {!account ? (
          <button
            onClick={signInWithCrossmark}
            disabled={isLoading}
            className="glass-button transition-all duration-300"
          >
            {isLoading ? "Signing in..." : "Sign in with Crossmark"}
          </button>
        ) : (
          <>
            <p className="text-lg text-white/90 mb-2">Connected Wallet:</p>
            <p className="text-white text-lg font-bold">{account}</p>
            <p className="text-sm text-white/70 mt-2">Balance: {balance} XRP</p>
          </>
        )}
      </div>
    </div>
  );
};

export default CrossmarkAuth;

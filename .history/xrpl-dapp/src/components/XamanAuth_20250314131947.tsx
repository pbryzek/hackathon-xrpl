import React, { useState, useEffect } from "react";
import { XummPkce } from "xumm-oauth2-pkce";
import * as xrpl from "xrpl";

const xumm = new XummPkce( "bedfb834-633e-4443-9dcc-eebf2bfd9562","http://localhost:5173",
);

const XamanAuth: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [balance, setBalance] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const storedAccount = localStorage.getItem("xrplAccount");
    if (storedAccount) {
      setAccount(storedAccount);
      fetchBalance(storedAccount);
    }
  }, []);

  const connectWallet = async () => {
    setIsLoading(true);
    try {
      await xumm.authorize();
      const state = await xumm.state();

      if (!state) {
        throw new Error("Xumm state is undefined!");
      }

      const userAccount = state?.me?.account ?? null;
      if (!userAccount) {
        throw new Error("Failed to retrieve XRPL account from Xumm.");
      }

      setAccount(userAccount);
      localStorage.setItem("xrplAccount", userAccount);
      fetchBalance(userAccount);
    } catch (error) {
      console.error("Xumm authentication failed:", error);
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
        <h2 className="text-2xl font-semibold text-primary mb-4">XRPL + Xaman DApp</h2>

        {!account ? (
          <button
            onClick={connectWallet}
            disabled={isLoading}
            className="bg-secondary text-white px-5 py-2 rounded-lg hover:bg-opacity-80 transition"
          >
            {isLoading ? "Connecting..." : "Connect Xaman Wallet"}
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

export default XamanAuth;

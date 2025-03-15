import React, { useState, useEffect } from "react";
import { XummPkce } from "xumm-oauth2-pkce";
import * as xrpl from "xrpl";

const xumm = new XummPkce("YOUR_XUMM_API_KEY");

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
      const userAccount = state.me?.account || null;
      if (userAccount) {
        setAccount(userAccount);
        localStorage.setItem("xrplAccount", userAccount);
        fetchBalance(userAccount);
      }
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
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>XRPL + Xaman DApp</h2>
      {!account ? (
        <button onClick={connectWallet} disabled={isLoading}>
          {isLoading ? "Connecting..." : "Connect Xaman Wallet"}
        </button>
      ) : (
        <>
          <p><strong>Connected Wallet:</strong> {account}</p>
          <p><strong>Balance:</strong> {balance} XRP</p>
        </>
      )}
    </div>
  );
};

export default XamanAuth;

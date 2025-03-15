import React, { useState, useEffect } from "react";
import { XummPkce } from "xumm-oauth2-pkce";  // Correct SDK for frontend
import * as xrpl from "xrpl";  // Import XRPL.js

const xumm = new XummPkce("bedfb834-633e-4443-9dcc-eebf2bfd9562");  // Replace with your Xumm API Key

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
      const { me } = await xumm.authorize();  // Correct method for OAuth2
      const userAccount = me?.sub;  // Get XRPL address
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
      setBalance(xrpBalance);
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

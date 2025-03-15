const xrpl = require("xrpl");
require("dotenv").config(); // Load environment variables

class XRPLStaking {
  static XRPL_SERVER = "wss://s.altnet.rippletest.net:51233"; // XRPL Testnet
  static ISSUER_ADDRESS = "rIssuerAddress"; // Change to actual issuer
  static STAKING_ACCOUNT_SECRET = process.env.STAKING_ACCOUNT_SECRET; // Staking Account Private Key

  // PFMU and GBOND Currency Codes
  static PFMU_CURRENCY = "PFMU-BRA-03182024";
  static GBOND_CURRENCY_PREFIX = "GBOND-";
  static GBOND_CURRENCY = XRPLStaking.GBOND_CURRENCY_PREFIX + XRPLStaking.PFMU_CURRENCY;

  constructor() {}

  // ✅ Connect to XRPL
  async connectClient() {
    this.client = new xrpl.Client(XRPLStaking.XRPL_SERVER);
    await this.client.connect();
    console.log("✅ Connected to XRPL");
  }

  // ✅ Disconnect from XRPL
  async disconnectClient() {
    if (this.client) {
      await this.client.disconnect();
      console.log("✅ Disconnected from XRPL");
    }
  }

  // ✅ Stake PFMU Tokens
  async stakePFMU(userSecret, amount) {
    await this.connectClient();
    const userWallet = xrpl.Wallet.fromSeed(userSecret);
    const stakingWallet = xrpl.Wallet.fromSeed(XRPLStaking.STAKING_ACCOUNT_SECRET);

    const tx = {
      TransactionType: "Payment",
      Account: userWallet.classicAddress,
      Destination: stakingWallet.classicAddress,
      Amount: {
        currency: this.PFMU_CURRENCY,
        issuer: this.ISSUER_ADDRESS,
        value: amount.toString(),
      },
      DestinationTag: 1001, // Staking identifier
    };

    const prepared = await this.client.autofill(tx);
    const signed = userWallet.sign(prepared);
    const result = await this.client.submitAndWait(signed.tx_blob);

    console.log(`✅ PFMU Staked: ${amount}`, result);
    await this.disconnectClient();
  }

  // ✅ Reward User with GBOND Tokens
  async rewardGBOND(userAddress, rewardAmount) {
    await this.connectClient();
    const stakingWallet = xrpl.Wallet.fromSeed(this.STAKING_ACCOUNT_SECRET);

    const tx = {
      TransactionType: "Payment",
      Account: stakingWallet.classicAddress,
      Destination: userAddress,
      Amount: {
        currency: this.GBOND_CURRENCY,
        issuer: this.ISSUER_ADDRESS,
        value: rewardAmount.toString(),
      },
      DestinationTag: 1001,
    };

    const prepared = await this.client.autofill(tx);
    const signed = stakingWallet.sign(prepared);
    const result = await this.client.submitAndWait(signed.tx_blob);

    console.log(`✅ GBOND Reward Sent: ${rewardAmount}`, result);
    await this.disconnectClient();
  }

  // ✅ Unstake PFMU After Maturity
  async unstakePFMU(userAddress, unstakeAmount) {
    await this.connectClient();
    const stakingWallet = xrpl.Wallet.fromSeed(this.STAKING_ACCOUNT_SECRET);

    const tx = {
      TransactionType: "Payment",
      Account: stakingWallet.classicAddress,
      Destination: userAddress,
      Amount: {
        currency: this.PFMU_CURRENCY,
        issuer: this.ISSUER_ADDRESS,
        value: unstakeAmount.toString(),
      },
      DestinationTag: 1001, // Unstake identifier
    };

    const prepared = await this.client.autofill(tx);
    const signed = stakingWallet.sign(prepared);
    const result = await this.client.submitAndWait(signed.tx_blob);

    console.log(`✅ PFMU Unstaked: ${unstakeAmount}`, result);
    await this.disconnectClient();
  }
}

module.exports = XRPLStaking;

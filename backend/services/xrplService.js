const xrpl = require("xrpl");
require("dotenv").config(); // Load environment variables

class XRPLStaking {
  static XRPL_SERVER = "wss://s.altnet.rippletest.net:51233"; // XRPL Testnet
  static ISSUER_ADDRESS = "rnQfo2qJeBhoZQRnPfXDH5JuxFhYrHLHxH"; // Change to actual issuer
  static PFMU_XRP_CONVERSION = 10.5;
  static STAKING_ACCOUNT_SECRET = process.env.STAKING_ACCOUNT_SECRET; // Staking Account Private Key

  // PFMU and GBOND Currency Codes
  static PFMU_CURRENCY = "PFMU-BRA-03182024";
  static PFMU_CURRENCY_HEX = "50464D552D4252412D3033313832303234000000";

  static GBOND_CURRENCY_PREFIX = "GBOND-";
  static GBOND_CURRENCY = XRPLStaking.GBOND_CURRENCY_PREFIX + XRPLStaking.PFMU_CURRENCY;

  static PFMU_TOKEN = {
    currency: "50464D552D4252412D3033313832303234000000",
    issuer: "rAzPNHTi8ydnARBRDUFVobEHpJ6SmbZqv",
  };

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
  async stakePFMU(walletSecret, pfmu) {
    console.log("stakePFMU");

    // TODO enable XRPL logic.
    if (true) {
      return;
    }
    await this.connectClient();
    const userWallet = xrpl.Wallet.fromSeed(walletSecret);
    const stakingWallet = xrpl.Wallet.fromSeed(XRPLStaking.STAKING_ACCOUNT_SECRET);

    const tx = {
      TransactionType: "Payment",
      Account: userWallet.classicAddress,
      Destination: stakingWallet.classicAddress,
      Amount: {
        currency: XRPLStaking.PFMU_CURRENCY,
        issuer: XRPLStaking.ISSUER_ADDRESS,
        value: pfmu.amount.toString(),
      },
      DestinationTag: 1001, // Staking identifier
    };

    const prepared = await this.client.autofill(tx);
    const signed = userWallet.sign(prepared);
    const result = await this.client.submitAndWait(signed.tx_blob);

    console.log(`✅ PFMU Staked: ${pfmu.amount}`, result);
    await this.disconnectClient();
  }

  // ✅ Reward User with GBOND Tokens
  async rewardGBOND(userAddress, rewardAmount) {
    await this.connectClient();
    const stakingWallet = xrpl.Wallet.fromSeed(XRPLStaking.STAKING_ACCOUNT_SECRET);

    const tx = {
      TransactionType: "Payment",
      Account: stakingWallet.classicAddress,
      Destination: userAddress,
      Amount: {
        currency: XRPLStaking.GBOND_CURRENCY,
        issuer: XRPLStaking.ISSUER_ADDRESS,
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
    const stakingWallet = xrpl.Wallet.fromSeed(XRPLStaking.STAKING_ACCOUNT_SECRET);

    const tx = {
      TransactionType: "Payment",
      Account: stakingWallet.classicAddress,
      Destination: userAddress,
      Amount: {
        currency: XRPLStaking.PFMU_CURRENCY,
        issuer: XRPLStaking.ISSUER_ADDRESS,
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

  async formatOffers(offers, isBuy, currency = "XRP") {
    return offers.map(offer => {
      const takerPays = offer.TakerPays;
      const takerGets = offer.TakerGets;

      const takerPaysAmount =
        typeof takerPays === "string"
          ? parseFloat(takerPays) / 1e6 // XRP in drops
          : parseFloat(takerPays.value);

      const takerGetsAmount =
        typeof takerGets === "string"
          ? parseFloat(takerGets) / 1e6 // XRP in drops
          : parseFloat(takerGets.value);

      const price = isBuy
        ? (takerPaysAmount / takerGetsAmount).toFixed(4)
        : (takerGetsAmount / takerPaysAmount).toFixed(4);

      const amount = isBuy ? takerGetsAmount.toFixed(4) : takerPaysAmount.toFixed(4);

      const totalPrice = (parseFloat(price) * parseFloat(amount)).toFixed(4);

      return {
        price: `${price} (${currency})`,
        amount: `${amount} PFMU-BRA-03182024`,
        totalPrice: `${totalPrice} (${currency})`,
      };
    });
  }

  async getBuyOffers() {
    console.log("getBuyOffers");

    await this.connectClient();

    try {
      const xrpBuyResponse = await this.client.request({
        command: "book_offers",
        taker_pays: { currency: "XRP" },
        taker_gets: XRPLStaking.PFMU_TOKEN,
        ledger_index: "validated",
      });

      console.log("xrpBuyResponse", xrpBuyResponse);

      const formattedXRPBuyOffers = await this.formatOffers(xrpBuyResponse.result.offers, true, "XRP");

      const usdBuyResponse = await this.client.request({
        command: "book_offers",
        taker_pays: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" },
        taker_gets: XRPLStaking.PFMU_TOKEN,
        ledger_index: "validated",
      });

      console.log("usdBuyResponse", usdBuyResponse);

      const formattedUSDBuyOffers = await this.formatOffers(usdBuyResponse.result.offers, true, "USD");
      console.log(formattedUSDBuyOffers);

      const combinedBuyOffers = [...formattedXRPBuyOffers, ...formattedUSDBuyOffers];
      console.log("Buy Offers:\n", combinedBuyOffers);
      return combinedBuyOffers;
    } catch (error) {
      console.error("Error fetching offers:", error.message);
    } finally {
      await this.disconnectClient();
    }
  }

  async getSellOffers() {
    const client = new xrpl.Client("wss://s2.ripple.com");
    await client.connect();

    try {
      const xrpSellResponse = await client.request({
        command: "book_offers",
        taker_pays: XRPLStaking.PFMU_TOKEN,
        taker_gets: { currency: "XRP" },
        ledger_index: "validated",
      });

      const formattedXRPSellOffers = await this.formatOffers(xrpSellResponse.result.offers, false, "XRP");

      const usdSellResponse = await client.request({
        command: "book_offers",
        taker_pays: XRPLStaking.PFMU_TOKEN,
        taker_gets: { currency: "USD", issuer: "rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B" },
        ledger_index: "validated",
      });

      const formattedUSDSellOffers = await this.formatOffers(usdSellResponse.result.offers, false, "USD");

      //const combinedSellOffers = [...formattedXRPSellOffers, ...formattedUSDSellOffers];
      const combinedSellOffers = [...xrpSellResponse.result.offers, ...usdSellResponse.result.offers];

      console.log("Sell Offers:\n", combinedSellOffers);
      return combinedSellOffers;
    } catch (error) {
      console.error("Error fetching offers:", error.message);
    } finally {
      await client.disconnect();
    }
  }
}

module.exports = XRPLStaking;

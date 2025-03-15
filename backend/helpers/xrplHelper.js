const xrpl = require("xrpl");

class CruBuyData {
    constructor(
      num_crus_purchased,
      num_crus_open_orders,
      date,
      buyTxLink,
      currencyCode,
    ) {
      this.num_crus_purchased = num_crus_purchased;
      this.num_crus_open_orders = num_crus_open_orders;
      this.date = date;
      this.buyTxLink = buyTxLink;
      this.currencyCode = currencyCode;
    }
}

/**
 * Sets up a Trust Line if needed
 */
async function setupTrustLine(client, wallet, currencyCode, issuerAddress) {
  const trustSetTx = {
    TransactionType: "TrustSet",
    Account: wallet.classicAddress,
    LimitAmount: {
      currency: currencyCode,
      issuer: issuerAddress,
      value: "1000000",
    },
  };

  const preparedTrustSet = await client.autofill(trustSetTx);
  const signedTrustSet = wallet.sign(preparedTrustSet);
  return await client.submitAndWait(signedTrustSet.tx_blob);
}

/**
 * Fetches existing offers from the XRPL DEX
 */
async function getExistingOffers(client, currencyCode, issuerAddress) {
    try {
      const response = await client.request({
        command: "book_offers",
        taker_gets: {
          currency: currencyCode,  // The asset being purchased (CRU)
          issuer: issuerAddress,
        },
        taker_pays: {
          currency: "XRP", 
          issuer: issuerAddress,
        },
        ledger_index: "validated",
        limit: 10, // Fetch up to 10 offers
      });
  
      return response.result.offers || [];
    } catch (error) {
      console.error("Error fetching existing offers:", error);
      return [];
    }
  }

/**
 * Places a Buy Order for CRUs on XRPL DEX
 */
async function purchaseCruViaMakeOfferABI(client, wallet, offer, amount) {
  offer.TakerGets.value = amount + "";
  console.log("offer.TakerGets.currency: ", offer.TakerGets.currency);

  const memoData = {amount};
  const preBuyAmt = await getBalancefromLines(wallet.address, client, offer.TakerGets.currency);
  const cruResults = await offerCreate(client, wallet, offer.TakerPays, offer.TakerGets, memoData);

  if (!cruResults.success) {
    return cruResults;
  }

  return handleCruOfferResult(wallet.address, cruResults, offer.TakerGets.value, preBuyAmt, offer.TakerGets.currency, client);
}

async function handleCruOfferResult(cruWalletAddress, cruResults, amount, preBuyAmt, currencyCode, client) {
    const transResult = cruResults.data.result.meta.TransactionResult;
  
    if (transResult === "tesSUCCESS") {
      return await handleSuccessfulCruOffer(cruWalletAddress, cruResults, amount, preBuyAmt, currencyCode, client);
    } else if (transResult === "tecUNFUNDED_OFFER") {
      return createFailJSON(
        `CRUs failed to buy because of insufficient funds. Attempted to buy ${amount} PFMUs.`
      );
    } else {
      return createFailJSON(
        `CRUs failed to buy. Unaccounted for status: ${transResult}`
      );
    }
}

async function offerCreate(client, wallet, takerGets, takerPays, memoData) {
    await tecPathCheck(client, wallet.address);
    console.log("takerPays: ", takerPays);
    const offerCreateTx = {
        TransactionType: "OfferCreate",
        Account: wallet.classicAddress,
        TakerGets: takerGets,
        TakerPays: takerPays,
        Memos: [JsonToMemo(memoData)],
    };
    return await prepareSignSubmitTxWithRetry(client, offerCreateTx, wallet);
}  

async function handleSuccessfulCruOffer(cruWalletAddress, cruResults, amount, preBuyAmt, currencyCode, client) {
    const postBuyAmt = await getBalancefromLines(cruWalletAddress, client, currencyCode);

    const boughtAmt = (postBuyAmt - preBuyAmt).toFixed(4);
    console.log("postBuyAmt: ", postBuyAmt);
    console.log("preBuyAmt: ", preBuyAmt);
    console.log("boughtAmt: ", boughtAmt);
    if (boughtAmt > 0) {
      const cruBuyData = createCruBuyData(cruResults, boughtAmt, amount, amtCstToSpend, currencyCode);

      if (spendResult.success) {
        return createSuccessJSON(
          `All ${amount} CRUs were successfully purchased.`,
          cruBuyData
        );
      } else {
        return createSuccessJSON(
          `${boughtAmt} of ${amount} CRUs successfully purchased.`,
          cruBuyData
        );
      }
    } else {
      return createFailJSON(
        `CRUs offer made successfully but not fulfilled for ${companyName}. Try a different offer.`
      );
    }
}

/**
 * Creates a CruBuyData object.
 *
 * @param {Object} cruResults - The results of the CRU offer.
 * @param {number} boughtAmt - The amount of CRUs bought.
 * @param {number} amount - The total amount of CRUs attempted to buy.
 * @param {string} currencyCode - The currency code of the CRU token.
 * @return {CruBuyData} A new CruBuyData object.
 */
function createCruBuyData(cruResults, boughtAmt, amount, currencyCode) {
    return new CruBuyData(
      boughtAmt, //num_crus_purchased,
      (amount - boughtAmt).toFixed(4),                              //num_crus_open_orders,
      xrplDateToIso(cruResults.data.result.date),                   //date,
      `${XRPL_TX_URL}${cruResults.data.result.hash}`,               //buyTxLink,
      fromHexToCurrency(cruResults.data.result.TakerPays.currency),//currencyCode,
    );
}

function fromHexToCurrency(hex){
    try {
      if (hex.length > 3) {
        const bytes = Buffer.from(hex, "hex");
        const str = bytes.toString("utf8");
        return str.replace(/\0/g, "");
      }
    } catch (error) {
      console.error("Error in fromHexToCurrency: ", error);
      
    }
    return hex;
}

function xrplDateToIso(xrplDate) {
    const date = new Date((xrplDate + 946684800) * 1000);
    return formatDateToReadableString(date.toISOString());
}

function formatDateToReadableString(dateString) {
    const date = new Date(dateString);
    const timeZone = "GMT";
    const options = {
      timeZone: timeZone,
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    return date.toLocaleString('en-US', options) + " " + timeZone;
  }


/* purchaseCruViaMakeOfferAbi helper functions*/
async function getBalancefromLines(address, client, currency_code) {
    const accountLine = await accountLinesAPI(address, client);
    return accountLine.result.lines.find(line => line.currency === currency_code)?.balance || 0;
}
  
async function accountLinesAPI(address, client) {
    return await client.request({
        command: "account_lines",
        account: address,
    });
}

/**
 * Creates a success JSON object with a message and data.
 *
 * @param {string} msg - The success message.
 * @param {any} data - The data to be included in the JSON object.
 * @return {object} The success JSON object.
 */
function createSuccessJSON(msg, data) {
    return {
      success: true,
      message: msg,
      data: data,
    };
  }
  
  /**
   * Creates a JSON object with success set to false and a specified message.
   *
   * @param {string} msg - The message to be included in the JSON object.
   * @return {Object} retData - The JSON object with success, message, and data properties.
   */
  function createFailJSON(msg) {
    return {
      success: false,
      message: msg,
    };
  }


module.exports = {
  connectXRPL,
  setupTrustLine,
  getExistingOffers,
  purchaseCruViaMakeOfferABI,
};

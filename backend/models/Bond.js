const XRPLStaking = require("../services/xrplService");

class Bond {
  static MATURITY_LENGTH = 6;
  static NUM_PFMUS = 0.1;

  constructor(name, issuer, interestRate, description) {
    this.pfmus_capacity = Bond.NUM_PFMUS;
    this.pfmus = [];
    this.name = name;
    this.issuer = issuer;
    this.interestRate = interestRate;
    this.createdDate = new Date();
    this.maturityDate = this.createdDate.setMonth(this.createdDate.getMonth() + Bond.MATURITY_LENGTH);
    this.description = description;
    this.investors = [];
  }

  // Method to add an investor
  addInvestor(name, amount, bondType, walletAddress) {
    const investor = new Investor(name, amount, bondType, walletAddress);
    this.investors.push(investor);
  }

  getPfmuAmount() {
    let totalAmount = 0;
    for (let pfmu in this.pfmus) {
      totalAmount += pfmu.amount;
    }
    return totalAmount;
  }

  stakePFMU(userSecret, amount, project, issuanceDate, expirationDate) {
    if (this.pfmus_staked.length + amount >= this.pfmus_capacity) {
      console.error("Error unable to stake: as this would exceed the PFMU capacity");
      return;
    }

    const staking = new XRPLStaking();
    staking.stakePFMU(userSecret, amount);

    const newPFMU = new PFMU(amount, project, issuanceDate, expirationDate);
    this.pfmus_staked.push(newPFMU);
  }

  getDetails() {
    return {
      name: this.name,
      issuer: this.issuer,
      amount: this.amount,
      interestRate: this.interestRate,
      createdDate: this.createdDate,
      maturityDate: this.maturityDate,
      description: this.description,
      investors: this.investors,
    };
  }
}

module.exports = Bond;

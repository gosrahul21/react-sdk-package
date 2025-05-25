export interface BankDetails {
  city: string;
  ifsc: string;
  micr: string;
  name: string;
  branch: string;
  pincode: string;
  neftifsc: string;
  accountNo: string;
  accountType: string;
}

export interface Fund {
  age: number;
  amc: string;
  nav: string;
  bank: BankDetails;
  dpId: string;
  isin: string;
  email: string;
  folio: string;
  mobile: string;
  amcName: string;
  isDemat: string;
  navDate: string;
  rtaName: string;
  gainLoss: string;
  newFolio: string;
  planMode: string;
  purAllow: string;
  redAllow: string;
  sipAllow: string;
  stpAllow: string;
  swpAllow: string;
  swtAllow: string;
  validPan: string;
  assetType: string;
  costValue: string;
  kycStatus: string;
  taxStatus: string;
  brokerCode: string;
  brokerName: string;
  decimalNav: number;
  schemeCode: string;
  schemeName: string;
  schemeType: string;
  decimalUnits: number;
  investorName: string;
  schemeOption: string;
  decimalAmount: number;
  lienUnitsFlag: string;
  modeOfHolding: string;
  nomineeStatus: string;
  availableUnits: string;
  closingBalance: string;
  availableAmount: string;
  currentMktValue: string;
  emailRelationship: string;
  idcwChangeAllowed: string;
  lienEligibleUnits: string;
  transactionSource: string;
  gainLossPercentage: string;
  mobileRelationship: string;
}

export interface Offer {
  index: number;
  rateOfInterest: string;
  totalLoanAmount: number;
  timeDuration: string;
  loanProvider: string;
}

export interface Summary {
  amc: string;
  amcName: string;
  isDemat: string;
  gainLoss: string;
  costValue: string;
  currentMktValue: string;
  gainLossPercentage: string;
}

export interface PortfolioData {
  totalPortfolio: {
    schemes: Fund[];
    summary: Summary[];
  }[];
  bestOffers: Offer[];
  otherOffers: Offer[];
  eligibleFunds: Fund[];
  nonEligibleFunds: Fund[];
}

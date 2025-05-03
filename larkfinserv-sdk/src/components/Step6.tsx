import axios from "axios";
import React, { useEffect, useState } from "react";

interface BankDetails {
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

interface Fund {
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

interface Offer {
  rateOfInterest: string;
  totalLoanAmount: number;
  timeDuration: string;
  loanProvider: string;
}

interface Summary {
  amc: string;
  amcName: string;
  isDemat: string;
  gainLoss: string;
  costValue: string;
  currentMktValue: string;
  gainLossPercentage: string;
}

interface PortfolioData {
  totalPortfolio: {
    schemes: Fund[];
    summary: Summary[];
  }[];
  bestOffers: Offer[];
  otherOffers: Offer[];
  eligibleFunds: Fund[];
  nonEligibleFunds: Fund[];
}

interface Step6Props {
  onProceed: (selectedOffer: Offer) => void;
  mobileNumber: string;
  sessionId: string;
}

const Step6: React.FC<Step6Props> = ({
  onProceed,
  mobileNumber,
  sessionId,
}) => {
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>({
    "totalPortfolio": [
      {
        "schemes": [
          {
            "age": 36,
            "amc": "H",
            "nav": "1197.182",
            "bank": {
              "city": "GAUR CITY",
              "ifsc": "ICIC0007391",
              "micr": "",
              "name": "ICICI Bank Ltd",
              "branch": "GAUR CITY",
              "pincode": "",
              "neftifsc": "ICIC0007391",
              "accountNo": "777701460694",
              "accountType": "PSB"
            },
            "dpId": "",
            "isin": "INF179K01YV8",
            "email": "shivani@larktrading.in",
            "folio": "33959435",
            "mobile": "+919999460694",
            "amcName": "HDFC Mutual Fund",
            "isDemat": "N",
            "navDate": "29-Apr-2025",
            "rtaName": "CAMS",
            "gainLoss": "1996.07",
            "newFolio": "N",
            "planMode": "D",
            "purAllow": "Y",
            "redAllow": "Y",
            "sipAllow": "Y",
            "stpAllow": "Y",
            "swpAllow": "Y",
            "swtAllow": "Y",
            "validPan": "Y",
            "assetType": "EQUITY",
            "costValue": "60000.00",
            "kycStatus": "3",
            "taxStatus": "01",
            "brokerCode": "DIRECT",
            "brokerName": "Direct",
            "decimalNav": 3,
            "schemeCode": "44T",
            "schemeName": "HDFC Large Cap Fund - Direct Plan - Growth Option",
            "schemeType": "Equity(G)",
            "decimalUnits": 3,
            "investorName": "SHIVANI  TAYAL",
            "schemeOption": "Growth",
            "decimalAmount": 2,
            "lienUnitsFlag": "N",
            "modeOfHolding": "Single",
            "nomineeStatus": "O",
            "availableUnits": "51.785",
            "closingBalance": "51.79",
            "availableAmount": "61996.07",
            "currentMktValue": "61996.07",
            "emailRelationship": "SE",
            "idcwChangeAllowed": "False",
            "lienEligibleUnits": "51.785",
            "transactionSource": "Online",
            "gainLossPercentage": "3.33",
            "mobileRelationship": "SE"
          }
        ],
        "summary": [
          {
            "amc": "H",
            "amcName": "HDFC Mutual Fund",
            "isDemat": "N",
            "gainLoss": "1996.07",
            "costValue": "60000.00",
            "currentMktValue": "61996.07",
            "gainLossPercentage": "3.33"
          }
        ]
      }
    ],
    "bestOffers": [
      {
        "rateOfInterest": "4.50 - 36.00%",
        "totalLoanAmount": 27000,
        "timeDuration": "12 - 120 months",
        "loanProvider": "DSP"
      }
    ],
    "otherOffers": [],
    "eligibleFunds": [
      {
        "age": 36,
        "amc": "H",
        "nav": "1197.182",
        "bank": {
          "city": "GAUR CITY",
          "ifsc": "ICIC0007391",
          "micr": "",
          "name": "ICICI Bank Ltd",
          "branch": "GAUR CITY",
          "pincode": "",
          "neftifsc": "ICIC0007391",
          "accountNo": "777701460694",
          "accountType": "PSB"
        },
        "dpId": "",
        "isin": "INF179K01YV8",
        "email": "shivani@larktrading.in",
        "folio": "33959435",
        "mobile": "+919999460694",
        "amcName": "HDFC Mutual Fund",
        "isDemat": "N",
        "navDate": "29-Apr-2025",
        "rtaName": "CAMS",
        "gainLoss": "1996.07",
        "newFolio": "N",
        "planMode": "D",
        "purAllow": "Y",
        "redAllow": "Y",
        "sipAllow": "Y",
        "stpAllow": "Y",
        "swpAllow": "Y",
        "swtAllow": "Y",
        "validPan": "Y",
        "assetType": "EQUITY",
        "costValue": "60000.00",
        "kycStatus": "3",
        "taxStatus": "01",
        "brokerCode": "DIRECT",
        "brokerName": "Direct",
        "decimalNav": 3,
        "schemeCode": "44T",
        "schemeName": "HDFC Large Cap Fund - Direct Plan - Growth Option",
        "schemeType": "Equity(G)",
        "decimalUnits": 3,
        "investorName": "SHIVANI  TAYAL",
        "schemeOption": "Growth",
        "decimalAmount": 2,
        "lienUnitsFlag": "N",
        "modeOfHolding": "Single",
        "nomineeStatus": "O",
        "availableUnits": "51.785",
        "closingBalance": "51.79",
        "availableAmount": "61996.07",
        "currentMktValue": "61996.07",
        "emailRelationship": "SE",
        "idcwChangeAllowed": "False",
        "lienEligibleUnits": "51.785",
        "transactionSource": "Online",
        "gainLossPercentage": "3.33",
        "mobileRelationship": "SE"
      }
    ],
    "nonEligibleFunds": []
  });
  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueType, setIssueType] = useState("PORTFOLIO_FETCH_ERROR");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedHolding, setExpandedHolding] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"eligible" | "nonEligible">("eligible");
  const [isLoading, setIsLoading] = useState(false);

  const toggleHoldingExpansion = (schemeCode: string) => {
    setExpandedHolding(expandedHolding === schemeCode ? null : schemeCode);
  };

  const handleReportIssue = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (!issueType) {
        throw new Error("Please select an issue type");
      }

      const trimmedDescription = description.trim();
      if (!trimmedDescription) {
        throw new Error("Please describe the issue");
      }
      if (trimmedDescription.length < 20) {
        throw new Error("Description must be at least 20 characters");
      }
      if (trimmedDescription.length > 500) {
        throw new Error("Description cannot exceed 500 characters");
      }

      if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        throw new Error("Valid mobile number is required");
      }

      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("Session expired. Please refresh the page.");
      }

      const {
        apiKey,
        apiSecret,
        sessionId: storedSessionId,
      } = JSON.parse(sdkCredentials);

      if (!apiKey || !apiSecret) {
        throw new Error("Invalid session credentials");
      }

      const currentSessionId = sessionId || storedSessionId;
      if (!currentSessionId) {
        throw new Error("Session ID is required");
      }

      const requestData = {
        phone: `+91${mobileNumber}`,
        sessionId: currentSessionId,
        issueType,
        description: trimmedDescription,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/report-issue`,
        requestData,
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowReportIssue(false);
          setSubmitSuccess(false);
          setDescription("");
          setIssueType("PORTFOLIO_FETCH_ERROR");
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Failed to report issue");
      }
    } catch (err) {
      let errorMessage = "Failed to report issue";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleReportIssue = () => {
    setShowReportIssue(!showReportIssue);
    if (!showReportIssue) {
      setIssueType("PORTFOLIO_FETCH_ERROR");
      setDescription("");
      setSubmitSuccess(false);
    }
  };

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const sdkCredentials = sessionStorage.getItem("sdkCredentials");
        if (!sdkCredentials) {
          throw new Error("Session expired. Please refresh the page.");
        }
        const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/loan-sdk/get-offers`,
          {
            phone: `+91${mobileNumber}`,
            sessionId: sessionId,
          },
          {
            headers: {
              "X-SDK-Key": apiKey,
              "X-SDK-Secret": apiSecret,
            },
          }
        );
        
        setPortfolioData(response.data);
      } catch (error) {
        console.error("Error fetching offers:", error);
        setError("Failed to load offers. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchOffers();
  }, [mobileNumber, sessionId]);

  if (isLoading) {
    return (
      <div className="flex flex-col h-full max-w-xl mx-auto bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
        <p className="mt-4 text-gray-600">Loading offers...</p>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="flex flex-col h-full max-w-xl mx-auto bg-gray-50 items-center justify-center p-6">
        <p className="text-red-500 mb-4">{error || "No offers data available"}</p>
        <button
          onClick={() => window.location.reload()}
          className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate total portfolio value
  const totalPortfolioValue = portfolioData.totalPortfolio.reduce(
    (sum, item) => sum + parseFloat(item.summary[0].currentMktValue),
    0
  );

  // Calculate total eligible value
  const totalEligibleValue = portfolioData.eligibleFunds.reduce(
    (sum, fund) => sum + parseFloat(fund.currentMktValue),
    0
  );

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto bg-gray-50">
      {!showReportIssue && (
        <div className="flex-1 overflow-y-scroll p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Loan Eligibility & Offers
          </h2>

          {/* Portfolio Summary */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
            <h3 className="text-lg font-bold text-gray-800 mb-2">
              Portfolio Overview
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
              <div>
                <p>Total Portfolio Value</p>
                <p className="font-medium">
                  ₹{totalPortfolioValue.toLocaleString()}
                </p>
              </div>
              <div>
                <p>Eligible Value</p>
                <p className="font-medium">
                  ₹{totalEligibleValue.toLocaleString()}
                </p>
              </div>
            </div>

            {portfolioData.totalPortfolio.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Asset Summary
                </h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {portfolioData.totalPortfolio.map((item, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <p>
                        <span className="font-medium">{item.summary[0].amcName}:</span>{" "}
                        {item.schemes.length} funds worth ₹
                        {parseFloat(item.summary[0].currentMktValue).toLocaleString()}
                      </p>
                      <p className="text-xs mt-1">
                        {portfolioData.eligibleFunds.length} eligible,{" "}
                        {portfolioData.nonEligibleFunds.length} not eligible
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Holdings Section with Tabs */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white mb-6">
            <div className="flex border-b border-gray-200 mb-3">
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "eligible"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("eligible")}
              >
                Eligible Funds ({portfolioData.eligibleFunds.length})
              </button>
              <button
                className={`py-2 px-4 font-medium ${
                  activeTab === "nonEligible"
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("nonEligible")}
              >
                Non-Eligible Funds ({portfolioData.nonEligibleFunds.length})
              </button>
            </div>

            <div className="space-y-3">
              {activeTab === "eligible" ? (
                portfolioData.eligibleFunds.length > 0 ? (
                  portfolioData.eligibleFunds.map((fund) => (
                    <HoldingCard
                      key={fund.schemeCode}
                      fund={fund}
                      expandedHolding={expandedHolding}
                      toggleHoldingExpansion={toggleHoldingExpansion}
                      isEligible={true}
                    />
                  ))
                ) : (
                  <div className="text-center py-4 text-gray-500">
                    No eligible funds found
                  </div>
                )
              ) : portfolioData.nonEligibleFunds.length > 0 ? (
                portfolioData.nonEligibleFunds.map((fund) => (
                  <HoldingCard
                    key={fund.schemeCode}
                    fund={fund}
                    expandedHolding={expandedHolding}
                    toggleHoldingExpansion={toggleHoldingExpansion}
                    isEligible={false}
                  />
                ))
              ) : (
                <div className="text-center py-4 text-gray-500">
                  No non-eligible funds found
                </div>
              )}
            </div>
          </div>

          {/* Offers */}
          {portfolioData.bestOffers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Best Offers</h3>
              {portfolioData.bestOffers.map((offer, index) => {
                const isSelected = selectedOffer?.loanProvider === offer.loanProvider;
                return (
                  <div
                    key={`${offer.loanProvider}-${index}`}
                    className={`border rounded-lg p-4 ${
                      isSelected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800">
                        {offer.loanProvider}
                      </h3>
                      {index === 0 && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                          Best Offer
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Loan Amount</p>
                        <p className="font-medium">
                          ₹{offer.totalLoanAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest Rate</p>
                        <p className="font-medium">
                          {offer.rateOfInterest}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tenure</p>
                        <p className="font-medium">
                          {offer.timeDuration}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Offer"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {/* Other Offers */}
          {portfolioData.otherOffers.length > 0 && (
            <div className="space-y-4 mt-6">
              <h3 className="text-lg font-bold text-gray-800">Other Offers</h3>
              {portfolioData.otherOffers.map((offer, index) => {
                const isSelected = selectedOffer?.loanProvider === offer.loanProvider;
                return (
                  <div
                    key={`${offer.loanProvider}-${index}`}
                    className={`border rounded-lg p-4 ${
                      isSelected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold text-gray-800">
                        {offer.loanProvider}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                      <div>
                        <p className="text-gray-500">Loan Amount</p>
                        <p className="font-medium">
                          ₹{offer.totalLoanAmount.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Interest Rate</p>
                        <p className="font-medium">
                          {offer.rateOfInterest}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tenure</p>
                        <p className="font-medium">
                          {offer.timeDuration}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedOffer(offer)}
                      className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition cursor-pointer ${
                        isSelected
                          ? "bg-green-600 text-white"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {isSelected ? "Selected" : "Select Offer"}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Report Issue Form */}
      {showReportIssue && (
        <div className="flex-1 overflow-y-scroll p-6">
          <div className="border border-gray-200 rounded-lg p-6 bg-white">
            {submitSuccess ? (
              <div className="text-center text-green-600 font-medium py-4">
                Issue reported successfully!
              </div>
            ) : (
              <>
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Report an Issue
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
                  >
                    <option value="PORTFOLIO_FETCH_ERROR">
                      Portfolio Fetch Error
                    </option>
                    <option value="OFFER_ISSUE">Offer Issue</option>
                    <option value="SELL_INVESTMENT_REQUEST">
                      Sell Investment Request
                    </option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md outline-green-600 focus:ring-green-500 focus:border-green-500"
                    rows={5}
                    placeholder="Please describe the issue in detail..."
                  />
                </div>
                {error && (
                  <div className="mb-4 text-red-600 text-sm">{error}</div>
                )}
                <div className="flex space-x-3">
                  <button
                    onClick={toggleReportIssue}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md font-medium text-gray-700 cursor-pointer hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleReportIssue}
                    disabled={isSubmitting || !description}
                    className={`flex-1 py-2 px-4 rounded-md font-medium ${
                      isSubmitting || !description
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-green-600 text-white hover:bg-green-700 cursor-pointer"
                    }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Issue"}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer buttons */}
      <div className="flex-[0.3] border-t border-gray-300 bg-white p-4 shadow-inner">
        {!showReportIssue ? (
          <>
            <button
              disabled={!selectedOffer}
              onClick={() => selectedOffer && onProceed(selectedOffer)}
              className={`w-full py-3 rounded-lg font-semibold transition cursor-pointer mb-2 ${
                selectedOffer
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-green-300 text-gray-600 cursor-not-allowed"
              }`}
            >
              Proceed with Application
            </button>

            <button
              onClick={toggleReportIssue}
              className="w-full py-2 text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer"
            >
              Report an Issue
            </button>
          </>
        ) : null}
      </div>
    </div>
  );
};

interface HoldingCardProps {
  fund: Fund;
  expandedHolding: string | null;
  toggleHoldingExpansion: (schemeCode: string) => void;
  isEligible: boolean;
}

const HoldingCard: React.FC<HoldingCardProps> = ({
  fund,
  expandedHolding,
  toggleHoldingExpansion,
  isEligible,
}) => {
  return (
    <div
      key={fund.schemeCode}
      className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
    >
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={() => toggleHoldingExpansion(fund.schemeCode)}
      >
        <div>
          <h4 className="font-medium text-gray-800">{fund.schemeName}</h4>
          <p className="text-sm text-gray-500">
            {fund.availableUnits} units @ ₹{fund.nav}
          </p>
        </div>
        <div className="text-right">
          <p className="font-medium">₹{parseFloat(fund.currentMktValue).toLocaleString()}</p>
          {isEligible ? (
            <p className="text-xs text-green-500">Eligible</p>
          ) : (
            <p className="text-xs text-red-500">Not eligible</p>
          )}
        </div>
      </div>

      {expandedHolding === fund.schemeCode && (
        <div className="mt-2 pl-2 border-l-2 border-green-200">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div>
              <p className="text-gray-500">AMC</p>
              <p>{fund.amcName}</p>
            </div>
            <div>
              <p className="text-gray-500">Investor</p>
              <p>{fund.investorName}</p>
            </div>
            <div>
              <p className="text-gray-500">Cost Value</p>
              <p>₹{fund.costValue}</p>
            </div>
            <div>
              <p className="text-gray-500">Current Value</p>
              <p>₹{fund.currentMktValue}</p>
            </div>
            <div>
              <p className="text-gray-500">Gain/Loss</p>
              <p className={parseFloat(fund.gainLoss) >= 0 ? "text-green-600" : "text-red-600"}>
                ₹{fund.gainLoss} ({fund.gainLossPercentage}%)
              </p>
            </div>
            <div>
              <p className="text-gray-500">Bank Account</p>
              <p>{fund.bank.name} ({fund.bank.accountNo})</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Step6;
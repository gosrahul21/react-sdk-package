import axios from "axios";
import React, { useState } from "react";

interface Eligibility {
  lenderId: string;
  lenderName: string;
  loanToValueRatio: number;
  maxLoanAmount: number;
  assetType: string;
}

interface Holding {
  schemeCode: string;
  schemeName: string;
  isin: string;
  units: number;
  nav: number;
  currentValue: number;
  eligibility: Eligibility[];
}

interface PortfolioData {
  totalPortfolioValue: number;
  totalEligibleValue: number;
  processedLoanAmount?: number;
  holdings: Holding[];
  bestOffers: {
    lenderId: string;
    lenderName: string;
    lenderCode: string;
    maxLoanAmount: number;
    interestRateRange: {
      min: number;
      max: number;
    };
    processingFee: number;
    tenureRange: {
      min: number;
      max: number;
    };
  }[];
  summary: {
    assetType: string;
    totalValue: number;
    totalEligibleValue: number;
    fundCount: number;
    eligibleFundCount: number;
  }[];
}

interface Step6Props {
  portfolioData: PortfolioData;
  onProceed: (selectedOffer: PortfolioData["bestOffers"][0]) => void;
  mobileNumber: string;
  sessionId: string;
}

const Step6: React.FC<Step6Props> = ({
  portfolioData,
  onProceed,
  mobileNumber,
  sessionId,
}) => {
  const {
    totalPortfolioValue,
    totalEligibleValue,
    processedLoanAmount,
    holdings = [],
    bestOffers,
    summary = [],
  } = portfolioData;

  const [selectedOffer, setSelectedOffer] = useState<
    PortfolioData["bestOffers"][0] | null
  >(null);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueType, setIssueType] = useState("PORTFOLIO_FETCH_ERROR");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedHolding, setExpandedHolding] = useState<string | null>(null);

  const toggleHoldingExpansion = (schemeCode: string) => {
    setExpandedHolding(expandedHolding === schemeCode ? null : schemeCode);
  };

  const handleReportIssue = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate issue type
      if (!issueType) {
        throw new Error("Please select an issue type");
      }

      // Validate description
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

      // Validate mobile number
      if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        throw new Error("Valid mobile number is required");
      }

      // Get and validate SDK credentials
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

      // Validate session ID
      const currentSessionId = sessionId || storedSessionId;
      if (!currentSessionId) {
        throw new Error("Session ID is required");
      }

      // Prepare request data
      const requestData = {
        phone: `+91${mobileNumber}`,
        sessionId: currentSessionId,
        issueType,
        description: trimmedDescription,
      };

      // Make API call
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

      // Handle response
      if (response.data?.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setShowReportIssue(false);
          setSubmitSuccess(false);
          setDescription("");
          setIssueType("PORTFOLIO_FETCH_ERROR"); // Reset to default
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
    // Reset form when opening
    if (!showReportIssue) {
      setIssueType("PORTFOLIO_FETCH_ERROR");
      setDescription("");
      setSubmitSuccess(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto bg-gray-50">
      {/* Scrollable Content - Only show when not reporting an issue */}
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
              {processedLoanAmount && (
                <div>
                  <p>Processed Loan Amount</p>
                  <p className="font-medium text-green-700">
                    ₹{processedLoanAmount.toLocaleString()}
                  </p>
                </div>
              )}
            </div>

            {summary.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-700 mb-1">
                  Asset Summary
                </h4>
                <div className="bg-gray-50 p-3 rounded-md">
                  {summary.map((asset, index) => (
                    <div key={index} className="text-sm text-gray-600">
                      <p>
                        <span className="font-medium">{asset.assetType}:</span>{" "}
                        {asset.fundCount} funds worth ₹
                        {asset.totalValue.toLocaleString()} (₹
                        {asset.totalEligibleValue.toLocaleString()} eligible)
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Holdings Section */}
          <div className="border border-gray-200 rounded-lg p-4 bg-white mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">
              Your Holdings
            </h3>
            <div className="space-y-3">
              {holdings.map((holding) => (
                <div
                  key={holding.schemeCode}
                  className="border-b border-gray-100 pb-3 last:border-0 last:pb-0"
                >
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => toggleHoldingExpansion(holding.schemeCode)}
                  >
                    <div>
                      <h4 className="font-medium text-gray-800">
                        {holding.schemeName}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {holding.units.toFixed(2)} units @ ₹{holding.nav}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ₹{holding.currentValue.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">
                        {(
                          (holding.eligibility[0]?.maxLoanAmount /
                            holding.currentValue) *
                          100
                        ).toFixed(0)}
                        % LTV
                      </p>
                    </div>
                  </div>

                  {expandedHolding === holding.schemeCode && (
                    <div className="mt-2 pl-2 border-l-2 border-green-200">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">
                        Eligible Offers:
                      </h5>
                      <ul className="space-y-2">
                        {holding.eligibility.map((eligibility, idx) => (
                          <li key={idx} className="text-xs">
                            <div className="flex justify-between">
                              <span className="font-medium">
                                {eligibility.lenderName}
                              </span>
                              <span>
                                ₹{eligibility.maxLoanAmount.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between text-gray-500">
                              <span>{eligibility.loanToValueRatio}% LTV</span>
                              <span>{eligibility.assetType}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Offers */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-gray-800">Best Offers</h3>
            {bestOffers.map((offer, index) => {
              const isSelected = selectedOffer?.lenderId === offer.lenderId;
              return (
                <div
                  key={offer.lenderId}
                  className={`border rounded-lg p-4 ${
                    isSelected
                      ? "border-green-600 bg-green-50"
                      : "border-gray-200 bg-white"
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-gray-800">
                      {offer.lenderName}
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
                        ₹{offer.maxLoanAmount.toLocaleString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Interest Rate</p>
                      <p className="font-medium">
                        {offer.interestRateRange.min}% -{" "}
                        {offer.interestRateRange.max}%
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Processing Fee</p>
                      <p className="font-medium">{offer.processingFee}%</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tenure</p>
                      <p className="font-medium">
                        {offer.tenureRange.min} - {offer.tenureRange.max} months
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
        </div>
      )}

      {/* Report Issue Form - Takes full height when visible */}
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

export default Step6;
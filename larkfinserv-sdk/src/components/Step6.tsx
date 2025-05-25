import React, { useState } from "react";
import HoldingCard from "./HoldingCard";
import { useFetchOffers } from "../hooks/useFetchOffers";
import { useReportIssue } from "../hooks/useReportIssue";
import { Offer } from "../types";

interface Step6Props {
  onProceed: (selectedOffer: Offer) => void;
  mobileNumber: string;
  sessionId: string;
  partnerId: string;
}

const Step6: React.FC<Step6Props> = ({
  onProceed,
  mobileNumber,
  sessionId,
  partnerId,
}) => {
  const { portfolioData, isLoading, error } = useFetchOffers({
    mobileNumber,
    sessionId,
  });
  const {
    issueType,
    setIssueType,
    description,
    setDescription,
    isSubmitting,
    submitSuccess,
    handleReportIssue,
  } = useReportIssue({ mobileNumber, sessionId });

  const [selectedOffer, setSelectedOffer] = useState<Offer | null>(null);
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [expandedHolding, setExpandedHolding] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"eligible" | "nonEligible">(
    "eligible"
  );

  const toggleHoldingExpansion = (schemeCode: string) => {
    setExpandedHolding(expandedHolding === schemeCode ? null : schemeCode);
  };

  const toggleReportIssue = () => {
    setShowReportIssue(!showReportIssue);
    if (!showReportIssue) {
      setIssueType("PORTFOLIO_FETCH_ERROR");
      setDescription("");
    }
    window.parent?.postMessage(
      {
        type: "ELIGIBILITY_RESULT",
        status: "success",
        data: {
          mobileNumber,
          partnerId,
          result: {
            selectedOffer,
            sessionId,
            mobileNumber,
            partnerId,
          },
        },
      },
      import.meta.env.VITE_SDK_URL
    );
  };

  // if (error) {
  //   return (
  //     <div className="flex flex-col h-full max-w-xl mx-auto bg-gray-50 items-center">
  //       {/* <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div> */}
  //       <img
  //         className="mt-10"
  //         src={error.errorCode === "no_mf_investment" ? "Animation.gif" : ""}
  //         alt="error"
  //       />
  //       <p className="mt-4 text-gray-600 font-bold text-center">{error.error}</p>
  //     </div>
  //   );
  // }

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
        <p className="text-red-500 mb-4">{"No offers data available"}</p>
        <button
          onClick={() => window.location.reload()}
          className="py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 cursor-pointer"
        >
          Retry
        </button>
      </div>
    );
  }

  // Calculate total portfolio value
  const totalPortfolioValue = portfolioData?.totalPortfolio?.reduce(
    (sum, item) => sum + parseFloat(item.summary[0].currentMktValue),
    0
  );

  // Calculate total eligible value
  const totalEligibleValue = portfolioData?.eligibleFunds?.reduce(
    (sum, fund) => sum + parseFloat(fund.currentMktValue),
    0
  );

  const selectOffer = (offer: Offer) => {
    setSelectedOffer((prevOffer) =>
      prevOffer?.index === offer.index ? null : { ...offer, index: offer.index }
    );
  };

  return (
    <div className="flex flex-col h-full max-w-xl mx-auto bg-gray-50 py-2">
      {error && (
        <div className="flex flex-col flex-1 max-w-xl mx-auto bg-gray-50 justify-center items-center">
          {error.errorCode === "no_mf_investment" && (
            <img src="Animation.gif" alt="error" />
          )}
          <p className="mt-4 text-gray-600 font-bold text-center">
            {error.error}
          </p>
        </div>
      )}

      {!showReportIssue && !error && (
        <div className="flex-1 overflow-y-scroll p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Loan Eligibility & Offers
          </h2>

          {/* Offers */}
          {portfolioData.bestOffers.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Best Offers</h3>
              {portfolioData.bestOffers.map((offer, index) => {
                const isSelected =
                  selectedOffer?.loanProvider === offer.loanProvider;
                return (
                  <div
                    key={`${offer.loanProvider}-${index}`}
                    className={`border rounded-lg p-4 cursor-pointer ${
                      isSelected
                        ? "border-green-600 bg-green-50"
                        : "border-gray-200 bg-white"
                    }`}
                    onClick={() => selectOffer({ ...offer, index })}
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
                        <p className="font-medium">{offer.rateOfInterest}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tenure</p>
                        <p className="font-medium">{offer.timeDuration}</p>
                      </div>
                    </div>

                    <button
                      // onClick={() => selectOffer({ ...offer, index })}
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
                const isSelected =
                  selectedOffer?.loanProvider === offer.loanProvider;
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
                        <p className="font-medium">{offer.rateOfInterest}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Tenure</p>
                        <p className="font-medium">{offer.timeDuration}</p>
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
                        <span className="font-medium">
                          {item.summary[0].amcName}:
                        </span>{" "}
                        {item.schemes.length} funds worth ₹
                        {parseFloat(
                          item.summary[0].currentMktValue
                        ).toLocaleString()}
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
      <div className="flex-[0.3] border-t border-gray-300 bg-white p-4 pt-2 shadow-inner">
        {!showReportIssue ? (
          <>
            <button
              onClick={() => {
                console.log("proceeding to loan", selectedOffer);
                if (selectedOffer) {
                  onProceed(selectedOffer);
                } else {
                  window.parent?.postMessage(
                    {
                      type: "ELIGIBILITY_RESULT",
                      status: "success",
                      data: {
                        mobileNumber,
                        partnerId,
                        sessionId,
                        result: {
                          message: "User is not eligible for any offer",
                        },
                      },
                    },
                    import.meta.env.VITE_SDK_URL
                  );
                }
              }}
              className={`w-full py-3 rounded-lg font-semibold transition flex justify-center cursor-pointer mb-2 ${
                selectedOffer
                  ? "bg-green-600 text-white hover:bg-green-700"
                  : "bg-gray-200 text-gray-600 hover:bg-gray-300"
              }`}
            >
              {selectedOffer ? "Proceed with Application" : "Done for now"}
            </button>

            <button
              onClick={toggleReportIssue}
              className="w-full pb-2 text-sm text-gray-600 hover:text-gray-800 underline cursor-pointer"
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

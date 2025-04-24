import React, { useState } from "react";

interface PortfolioData {
  totalPortfolioValue: number;
  totalEligibleValue: number;
  processedLoanAmount?: number;
  existingHoldings?: {
    name: string;
    value: number;
  }[];
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
}

interface Step6Props {
  portfolioData: PortfolioData;
  onProceed: (selectedOffer: PortfolioData["bestOffers"][0]) => void;
  mobileNumber: string;
}

const Step6: React.FC<Step6Props> = ({ portfolioData, onProceed }) => {
  const {
    totalPortfolioValue,
    totalEligibleValue,
    processedLoanAmount,
    existingHoldings = [],
    bestOffers,
  } = portfolioData;

  const [selectedOffer, setSelectedOffer] = useState<PortfolioData["bestOffers"][0] | null>(
    // bestOffers[0] || null
  );

  return (
    <div className="flex flex-col h-[100vh] max-w-xl mx-auto bg-gray-50">
      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Loan Eligibility & Offers</h2>

        {/* Portfolio Summary */}
        <div className="border border-gray-200 rounded-lg p-4 bg-white mb-4">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Portfolio Overview</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-4">
            <div>
              <p>Total Portfolio Value</p>
              <p className="font-medium">₹{totalPortfolioValue.toLocaleString()}</p>
            </div>
            <div>
              <p>Eligible Value</p>
              <p className="font-medium">₹{totalEligibleValue.toLocaleString()}</p>
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

          {existingHoldings.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-gray-700 mb-1">Existing Holdings</h4>
              <ul className="list-disc list-inside text-sm text-gray-600">
                {existingHoldings.map((holding, index) => (
                  <li key={index}>
                    {holding.name}: ₹{holding.value.toLocaleString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Offers */}
        <div className="space-y-4">
          {bestOffers.map((offer, index) => {
            const isSelected = selectedOffer?.lenderId === offer.lenderId;
            return (
              <div
                key={offer.lenderId}
                className={`border rounded-lg p-4 ${
                  isSelected ? "border-green-600 bg-green-50" : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-bold text-gray-800">{offer.lenderName}</h3>
                  {index === 0 && (
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                      Best Offer
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Loan Amount</p>
                    <p className="font-medium">₹{offer.maxLoanAmount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Interest Rate</p>
                    <p className="font-medium">
                      {offer.interestRateRange.min}% - {offer.interestRateRange.max}%
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

      {/* Sticky Footer */}
      <div className="border-t bg-white p-4 shadow-inner">
        <button
          disabled={!selectedOffer}
          onClick={() => selectedOffer && onProceed(selectedOffer)}
          className={`w-full py-3 rounded-lg font-semibold transition cursor-pointer ${
            selectedOffer
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-green-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Proceed with Application
        </button>
      </div>
    </div>
  );
};

export default Step6;

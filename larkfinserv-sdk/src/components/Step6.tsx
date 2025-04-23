import { useState } from 'react';

interface LoanOffer {
  lender: string;
  loanAmount: string;
  roi: string;
  processingFee: string;
  tenure: string;
  eligibleInvestments: string[];
  nonEligibleInvestments: string[];
}

interface Step6Props {
  lenders: LoanOffer[];
  onProceed: () => void;
  mobileNumber: string;
}

export default function Step6({ lenders, onProceed, mobileNumber }: Step6Props) {
  const [showOfferDetails, setShowOfferDetails] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const bestOffer = lenders.length > 0 ? lenders[0] : null;

  const maskedMobile = mobileNumber 
    ? `${mobileNumber.substring(0, 3)}****${mobileNumber.substring(7)}`
    : '';

  const handleSendOtp = () => {
    // In a real app, this would call an API to send OTP
    setOtpSent(true);
    setShowOtpVerification(true);
  };

  const handleVerifyOtp = () => {
    // In a real app, this would verify OTP with backend
    onProceed();
  };

  if (showOtpVerification) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-green-800">Verify OTP</h2>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <p className="text-sm text-gray-600 mb-2">
            We've sent a 6-digit OTP to your mobile number ending with {maskedMobile}
          </p>
          
          <div className="mb-4">
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="Enter 6-digit OTP"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <button
              onClick={() => setShowOtpVerification(false)}
              className="text-gray-600 text-sm font-medium hover:text-gray-800"
            >
              Back to offers
            </button>
            
            <button
              onClick={handleVerifyOtp}
              disabled={otp.length !== 6}
              className={`py-2 px-4 rounded-md font-medium ${otp.length === 6 ? 'bg-green-700 text-white hover:bg-green-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              Verify & Proceed
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                // Resend OTP logic
                setOtp('');
              }}
              className="text-blue-600 text-sm font-medium hover:text-blue-800"
            >
              Resend OTP
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Loan Offers</h2>

      {lenders.length > 1 ? (
        <>
          <p className="text-gray-600">
            We've evaluated offers from multiple lenders. Here's the best
            one for you:
          </p>

          <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg">Best Offer</h3>
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Recommended
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-500">Loan Amount</p>
                <p className="font-medium">{bestOffer?.loanAmount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Interest Rate</p>
                <p className="font-medium">{bestOffer?.roi}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Processing Fee</p>
                <p className="font-medium">{bestOffer?.processingFee}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tenure</p>
                <p className="font-medium">{bestOffer?.tenure}</p>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-2">
              <span className="font-medium">Lending Partner:</span>{" "}
              {bestOffer?.lender}
            </p>

            <button
              onClick={() => setShowOfferDetails(!showOfferDetails)}
              className="text-blue-600 text-sm font-medium flex items-center"
            >
              {showOfferDetails ? "Hide details" : "View details"}
              <svg
                className={`w-4 h-4 ml-1 transition-transform ${
                  showOfferDetails ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {showOfferDetails && bestOffer && (
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    Eligible Investments
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {bestOffer.eligibleInvestments.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-1">
                    Non-Eligible Investments
                  </h4>
                  <ul className="list-disc list-inside text-sm text-gray-600">
                    {bestOffer.nonEligibleInvestments.map(
                      (item, index) => (
                        <li key={index}>{item}</li>
                      )
                    )}
                  </ul>
                </div>
              </div>
            )}
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h3 className="font-bold text-lg mb-4">Other Offers</h3>

            {lenders
              .filter((l) => l.lender !== bestOffer?.lender)
              .map((offer, index) => (
                <div key={index} className="mb-4 last:mb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">{offer.lender}</h4>
                    <span className="text-sm text-gray-500">
                      {offer.roi} interest
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Up to {offer.loanAmount}</span>
                    <span>{offer.tenure}</span>
                  </div>
                </div>
              ))}
          </div>
        </>
      ) : (
        <div className="border border-gray-200 rounded-lg p-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <p className="text-sm text-gray-500">Loan Amount</p>
              <p className="font-medium">₹3,00,000</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Interest Rate</p>
              <p className="font-medium">11.5%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Processing Fee</p>
              <p className="font-medium">1.8%</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Tenure</p>
              <p className="font-medium">24 months</p>
            </div>
          </div>

          <p className="text-sm text-gray-600 mb-4">
            <span className="font-medium">Lending Partner:</span> DEF
            Finance
          </p>

          <div className="bg-blue-50 p-3 rounded-md">
            <p className="text-sm text-blue-800">
              This offer is based on your eligible investments with our
              single lending partner.
            </p>
          </div>
        </div>
      )}

      <div className="bg-gray-50 p-3 rounded-md text-xs text-gray-600">
        <p className="font-medium mb-1">Disclaimer</p>
        <p>
          This offer is a tentative offer. Please proceed for credit
          sanction for final approval.
        </p>
      </div>

      <button
        onClick={handleSendOtp}
        className="w-full py-2 px-4 rounded-md bg-green-700 text-white font-medium hover:bg-green-800 cursor-pointer"
      >
        Proceed for Credit Sanction
      </button>
    </div>
  );
}
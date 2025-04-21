import { useState, useEffect } from "react";

const LoanEligibilityFlow = () => {
  const [step, setStep] = useState(1);
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [userExists, setUserExists] = useState(false);
  const [_otpSent, setOtpSent] = useState(false);
  const [_otpVerified, setOtpVerified] = useState(false);
  const [userIntent, setUserIntent] = useState("");
  const [panNumber, setPanNumber] = useState("");
  const [_panVerified, setPanVerified] = useState(false);
  const [panMismatch, setPanMismatch] = useState(false);
  const [hasInvestments, setHasInvestments] = useState(true);
  const [lenders, setLenders] = useState<any>([]);
  const [bestOffer, setBestOffer] = useState<any>(null);
  const [showOfferDetails, setShowOfferDetails] = useState(false);

  // Mock data for offers
  const mockOffers = [
    {
      lender: "ABC Bank",
      loanAmount: "₹5,00,000",
      roi: "10.5%",
      processingFee: "1.5%",
      tenure: "36 months",
      eligibleInvestments: [
        "Axis Bluechip Fund",
        "ICICI Prudential Equity Fund",
      ],
      nonEligibleInvestments: ["SBI Small Cap Fund"],
    },
    {
      lender: "XYZ Finance",
      loanAmount: "₹4,50,000",
      roi: "11.2%",
      processingFee: "1.2%",
      tenure: "24 months",
      eligibleInvestments: ["Axis Bluechip Fund", "Parag Parikh Flexi Cap"],
      nonEligibleInvestments: ["Nippon India Small Cap Fund"],
    },
  ];

  const handleCheckEligibility = () => {
    // In a real app, this would call an API to send OTP
    setOtpSent(true);
    // Mock user existence check - 50% chance user exists
    setUserExists(Math.random() > 0.5);
    setStep(2);
  };

  const handleVerifyOtp = () => {
    // In a real app, this would verify OTP with backend
    setOtpVerified(true);
    setStep(3);
  };

  const handleUserIntent = (intent: string) => {
    setUserIntent(intent);
    // setStep(4);
  };

  const handlePanSubmit = () => {
    // Mock verification - 20% chance of mismatch
    if (Math.random() < 0.2) {
      setPanMismatch(true);
    } else {
      setPanVerified(true);
      // 30% chance user has no investments
      setHasInvestments(Math.random() > 0.3);
      setStep(5);
    }
  };

  const handleConfirmNoInvestments = () => {
    // Proceed with loan application despite no investments
    setStep(6);
  };

  useEffect(() => {
    if (step === 5 && hasInvestments) {
      handleFlowComplete();
      // Simulate API call to get lenders
      setTimeout(() => {
        setLenders(mockOffers);
        // Find best offer (simple comparison by ROI)
        const best = mockOffers.reduce((prev, current) =>
          parseFloat(prev.roi) < parseFloat(current.roi) ? prev : current
        );
        setBestOffer(best);
        setStep(6);
      }, 1500);
    }
  }, [step, hasInvestments]);

  const handleFlowComplete = () => {
    if (window.opener) {
      // update
      window.opener.postMessage(
        {
          type: "ELIGIBILITY_RESULT",
          result: { eligible: true, limit: 250000 },
        },
        "*"
      ); // Replace * with actual origin in production
    } else {
      alert("Proceeding to loan application");
    }
  };

  // useEffect(() => {
  //   if (embedded) {
  //     const handleResize = () => {
  //       const height = document.documentElement.scrollHeight;
  //       window.parent.postMessage({
  //         type: 'HEIGHT_CHANGE',
  //         payload: { height }
  //       }, '*');
  //     };

  //     // Initial height notification
  //     handleResize();

  //     // Notify on step changes
  //     window.parent.postMessage({
  //       type: 'STEP_CHANGE',
  //       payload: { step }
  //     }, '*');

  //     // Add resize observer
  //     const resizeObserver = new ResizeObserver(handleResize);
  //     resizeObserver.observe(document.body);

  //     return () => resizeObserver.disconnect();
  //   }
  // }, [step, embedded]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6">
        {/* Progress indicator */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum
                    ? "bg-green-800 text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-1.5">
            <div
              className="bg-green-700 h-1.5 rounded-full"
              style={{ width: `${(step / 6) * 100}%` }}
            ></div>
          </div>
        </div>
        {/* Step 1: Mobile Number Input */}
        {step === 1 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800 text-center">
              Mutual Fund Loan
            </h2>
            <h3 className="text-gray-600 text-center">
              Quick Eligibility Check
            </h3>
            <p className="text-gray-600">Enter your mobile number to proceed</p>

            <div className="space-y-2">
              <label
                htmlFor="mobile"
                className="block text-sm font-medium text-gray-700"
              >
                Mobile Number
              </label>
              <input
                type="tel"
                id="mobile"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter 10-digit mobile number"
                value={mobileNumber}
                onChange={(e) =>
                  setMobileNumber(
                    e.target.value.replace(/\D/g, "").slice(0, 10)
                  )
                }
                maxLength={10}
              />
            </div>

            <button
              onClick={handleCheckEligibility}
              disabled={mobileNumber.length !== 10}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                mobileNumber.length === 10
                  ? "bg-green-700 hover:bg-green-800 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Check Eligibility
            </button>
          </div>
        )}
        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center text-green-800">
              Verify OTP
            </h2>

            {userExists ? (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-yellow-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">
                      Your account already exists. Please login via original
                      provider.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <p className="text-gray-600 text-center">
                  We've sent an OTP to +91{" "}
                  {mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, "******$3")}
                </p>

                <div className="space-y-2">
                  <label
                    htmlFor="otp"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) =>
                      setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                    }
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-between items-center text-sm">
                  <button className="text-blue-600 hover:text-blue-800">
                    Resend OTP
                  </button>
                  <span className="text-gray-500">00:30</span>
                </div>

                <button
                  onClick={handleVerifyOtp}
                  disabled={otp.length !== 6}
                  className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                    otp.length === 6
                      ? "bg-green-700 hover:bg-green-800 cursor-pointer"
                      : "bg-gray-400 cursor-not-allowed"
                  }`}
                >
                  Verify OTP
                </button>
              </>
            )}
          </div>
        )}
        {/* // Step 3: User Intent with proceed button */}
        {step === 3 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800">
              What brings you here?
            </h2>
            <p className="text-gray-600">Select your intent to proceed</p>

            <div className="space-y-3">
              <button
                onClick={() => handleUserIntent("exploring")}
                className={`w-full py-3 px-4 rounded-md border text-left ${
                  userIntent === "exploring"
                    ? "border-green-500 bg-green-50 cursor-pointer"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      userIntent === "exploring"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {userIntent === "exploring" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">
                    I don't need a loan, just exploring
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleUserIntent("future")}
                className={`w-full py-3 px-4 rounded-md border text-left ${
                  userIntent === "future"
                    ? "border-green-500 bg-green-50 cursor-pointer"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      userIntent === "future"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {userIntent === "future" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">
                    I may need a loan in future
                  </span>
                </div>
              </button>

              <button
                onClick={() => handleUserIntent("now")}
                className={`w-full py-3 px-4 rounded-md border text-left ${
                  userIntent === "now"
                    ? "border-green-500 bg-green-50 cursor-pointer"
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                      userIntent === "now"
                        ? "border-green-500 bg-green-500"
                        : "border-gray-400 bg-white"
                    }`}
                  >
                    {userIntent === "now" && (
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">I need a loan right away</span>
                </div>
              </button>
            </div>

            <button
              onClick={() => setStep(4)}
              disabled={!userIntent}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                userIntent
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Proceed
            </button>
          </div>
        )}
        {/* Step 4: PAN Input */}
        {step === 4 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800">
              PAN Verification
            </h2>

            {panMismatch ? (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-700">
                      Your phone number ******{mobileNumber.slice(-4)} is not
                      associated with your PAN. Please provide the correct phone
                      number.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-gray-600">
                Enter your PAN number for verification
              </p>
            )}

            <div className="space-y-2">
              <label
                htmlFor="pan"
                className="block text-sm font-medium text-gray-700"
              >
                PAN Number
              </label>
              <input
                type="text"
                id="pan"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
                placeholder="Enter 10-digit PAN"
                value={panNumber}
                onChange={(e) =>
                  setPanNumber(
                    e.target.value
                      .toUpperCase()
                      .replace(/[^A-Z0-9]/g, "")
                      .slice(0, 10)
                  )
                }
                maxLength={10}
              />
            </div>

            <button
              onClick={handlePanSubmit}
              disabled={panNumber.length !== 10}
              className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                panNumber.length === 10
                  ? "bg-green-600 hover:bg-green-700 cursor-pointer"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              Verify PAN
            </button>
          </div>
        )}
        {/* Step 5: Investment Check */}
        {step === 5 && !hasInvestments && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-green-800">
              Investment Check
            </h2>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-yellow-400"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    The response from MF Central indicates that you do not hold
                    any investment. Can you confirm?
                  </p>
                </div>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => setStep(1)}
                className="w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 cursor-pointer"
              >
                Go Back
              </button>
              <button
                onClick={handleConfirmNoInvestments}
                className="w-full py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                Confirm
              </button>
            </div>
          </div>
        )}
        {/* Step 6: Offer Display */}
        {step === 6 && (
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

                  {showOfferDetails && (
                    <div className="mt-4 space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">
                          Eligible Investments
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {bestOffer?.eligibleInvestments.map((item: any, index: any) => (
                            <li key={index}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-gray-700 mb-1">
                          Non-Eligible Investments
                        </h4>
                        <ul className="list-disc list-inside text-sm text-gray-600">
                          {bestOffer?.nonEligibleInvestments.map(
                            (item: any, index: any) => (
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
                    .filter((l: any) => l.lender !== bestOffer?.lender)
                    .map((offer: any, index: any) => (
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
              onClick={() => alert("Proceeding to loan application")}
              className="w-full py-2 px-4 rounded-md bg-green-700 text-white font-medium hover:bg-green-800 cursor-pointer"
            >
              Proceed for Credit Sanction
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoanEligibilityFlow;

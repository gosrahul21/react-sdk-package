import { useState, useEffect } from "react";
import VerifyPhoneStep1 from "./components/VerifyPhoneStep1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import Step4 from "./components/Step4";
import Step5 from "./components/Step5";
import Step6 from "./components/Step6";

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

  // const handleCheckEligibility = () => {
  //   // In a real app, this would call an API to send OTP
  //   setOtpSent(true);
  //   // Mock user existence check - 50% chance user exists
  //   setUserExists(Math.random() > 0.5);
  //   setStep(2);
  // };

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

  useEffect(() => {
    // Add this to your child application's initialization code
    window.addEventListener("message", (event) => {
      // Always verify the origin for security
      const allowedOrigins = [
        "https://larkfinserv.com",
        "http://localhost:5173", // for development
      ];

      if (!allowedOrigins.includes(event.origin)) {
        console.warn("Message from unauthorized origin:", event.origin);
        return;
      }

      // Check the message structure
      if (event.data && event.data.type === "SDK_INIT") {
        const { apiKey, apiSecret, partnerId, sessionId, userId, theme } =
          event.data.config;

        // Initialize your child application with this data
        initializeChildApp({
          apiKey,
          apiSecret,
          partnerId,
          sessionId,
          userId,
          theme,
        });

        // Optional: Send acknowledgement back to parent
        window.opener?.postMessage(
          {
            type: "SDK_INIT_ACK",
            status: "success",
          },
          event.origin
        );
      }
    });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("sessionId");
    const partnerId = params.get("partnerId");
    const userId = params.get("userId");
    const theme = params.get("theme");
    const apiKey = params.get("authKey");
    const apiSecret = params.get("authSecret");

    sessionStorage.setItem("sdkCredentials", JSON.stringify({
      sessionId,
      partnerId,
      userId,
      theme,
      apiKey,
      apiSecret,
    }));

    // console.log("sdkCredentials new", { sessionId, partnerId, userId, theme, apiKey, apiSecret });
    initializeChildApp({
      sessionId,
      partnerId,
      userId,
      theme,
      apiKey,
      apiSecret,
    });

  }, []);

  const [childAppConfig, setChildAppConfig] = useState<any>(null);

  // Initialize child app with this data
  const initializeChildApp = (config: any) => {
    // console.log("Initializing child app with config:", config);
    setChildAppConfig(config);
  };

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
          <VerifyPhoneStep1
            onSuccess={() => {
              setStep(2);
            }}
            mobileNumber={mobileNumber}
            setMobileNumber={setMobileNumber}
          />
        )}
        {/* Step 2: OTP Verification */}
        {step === 2 && (
          <Step2
            mobileNumber={mobileNumber}
            sessionId={childAppConfig?.sessionId}
            onSuccess={() => {
              setStep(3);
            }}
          />
        )}
        {/* // Step 3: User Intent with proceed button */}
        {step === 3 && (
          <Step3
            userIntent={userIntent}
            handleUserIntent={handleUserIntent}
            setStep={setStep}
          />
        )}
        {/* Step 4: PAN Input */}
        {step === 4 && (
          <Step4
            mobileNumber={mobileNumber}
            sessionId={childAppConfig?.sessionId}
            onSuccess={() => {
              setStep(5);
            }}
          />
        )}
        {step === 5 && !hasInvestments && (
          <Step5 onConfirm={() => setStep(6)} onBack={() => setStep(4)} />
        )}
        {step === 6 && (
          <Step6
            lenders={lenders}
            onProceed={() => alert("Proceeding to loan application")}
            mobileNumber={mobileNumber}
          />
        )}
      </div>
    </div>
  );
};

export default LoanEligibilityFlow;

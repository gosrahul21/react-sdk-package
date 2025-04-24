import { useState, useEffect } from "react";
import VerifyPhoneStep1 from "./components/VerifyPhoneStep1";
import Step2 from "./components/Step2";
import Step3 from "./components/Step3";
import VerifyPan from "./components/VerifyPan";
import Step6 from "./components/Step6";
import MFCentralResponseStep from "./components/MFCentralResponseStep";

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
  // const [hasInvestments, setHasInvestments] = useState(true);
  const [lenders, setLenders] = useState<any>([]);
  const [portfolioData, setPortfolioData] = useState<any>();


  const handleUserIntent = (intent: string) => {
    setUserIntent(intent);
    // setStep(4);
  };

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

    sessionStorage.setItem(
      "sdkCredentials",
      JSON.stringify({
        sessionId,
        partnerId,
        userId,
        theme,
        apiKey,
        apiSecret,
      })
    );

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

  const handlePortfolioData = (portfolioData: any) => {
    setPortfolioData(portfolioData);
    setStep(6);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-md mx-auto bg-white rounded-xl h-[100vh] shadow-md overflow-hidden p-6">
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
          <VerifyPan
            panNumber={panNumber}
            setPanNumber={setPanNumber}
            mobileNumber={mobileNumber}
            sessionId={childAppConfig?.sessionId}
            onSuccess={() => {
              setStep(5);
            }}
          />
        )}
        {step === 5 && (
          <MFCentralResponseStep
            mobileNumber={mobileNumber}
            panNumber={panNumber}
            onConfirm={(data: any) => handlePortfolioData(data)}
            onBack={() => setStep(4)}
          />
        )}
        {step === 6 && portfolioData && (
          <Step6
            portfolioData={portfolioData}
            onProceed={() => alert("Proceeding to loan application")}
            mobileNumber={mobileNumber}
          />
        )}
      </div>
    </div>
  );
};

export default LoanEligibilityFlow;

import axios from "axios";
import { useEffect, useState, useRef } from "react";

interface MFCentralResponseStepProps {
  mobileNumber: string;
  panNumber: string;
  onConfirm: (portfolioData?: any) => void;
  onBack: () => void;
}

export default function MFCentralResponseStep({
  mobileNumber,
  panNumber,
  onConfirm,
  onBack,
}: MFCentralResponseStepProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [otpSession, setOtpSession] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpVerificationError, setOtpVerificationError] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPortfolio = async () => {
    setError(null);
    try {
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) throw new Error("SDK credentials not found");

      const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/fetch-portfolio`,
        {
          sessionId,
          phone: `+91${mobileNumber}`,
          pan: panNumber,
        },
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      if (data) {
        setOtpSession(data.requiresOtp);
      } else {
        setError(data.message || "Unable to fetch portfolio.");
      }
    } catch (err) {
      let message = "Failed to fetch portfolio";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPortfolioOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      setOtpVerificationError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) throw new Error("SDK credentials not found");

      const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/verify-portfolio-otp`,
        { sessionId, otp },
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data.success) {
        setOtpVerified(true);
        setOtpVerificationError(null);
        setIsLoading(true);
        onConfirm(response.data.portfolioData);
      } else {
        throw new Error(response.data.message || "OTP verification failed");
      }
    } catch (err) {
      let message = "OTP verification failed";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      setOtpVerificationError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = () => {
    setOtp("");
    setCanResend(false);
    setResendTimer(60);
    fetchPortfolio(); // re-fetch initiates OTP again
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  useEffect(() => {
    if (!otpSession || otpVerified) return;

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSession, otpVerified]);

  useEffect(() => {
    if (otp.length === 6) {
      verifyPortfolioOtp();
    }
  }, [otp]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [otpSession]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Investment Check</h2>

      {isLoading ? (
        <div className="flex justify-center items-center">
          <svg className="animate-spin h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        </div>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : otpSession && !otpVerified ? (
        <div className="space-y-4">
          <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
            Enter OTP sent to +91 {mobileNumber}
          </label>
          <input
            ref={inputRef}
            id="otp"
            type="text"
            value={otp}
            maxLength={6}
            pattern="\d*"
            onChange={(e) => {
              if (/^\d*$/.test(e.target.value)) setOtp(e.target.value);
            }}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter the 6-digit OTP"
            inputMode="numeric"
          />
          <button
            onClick={verifyPortfolioOtp}
            disabled={otp.length !== 6}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${otp.length === 6 ? "bg-green-600 hover:bg-green-700" : "bg-gray-400 cursor-not-allowed"}`}
          >
            Verify OTP
          </button>
          {otpVerificationError && (
            <p className="text-red-600 text-sm" role="alert">{otpVerificationError}</p>
          )}
          <div className="flex justify-end">
            <button
              onClick={handleResendOtp}
              disabled={!canResend}
              className="text-sm text-blue-600 hover:underline disabled:text-gray-400"
            >
              {canResend ? "Resend OTP" : `Resend in ${resendTimer}s`}
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-sm text-yellow-700">
              The response from MF Central indicates that you do not hold any investment. Can you confirm?
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={onBack}
              className="w-full py-2 px-4 rounded-md border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
            >
              Go Back
            </button>
            <button
              onClick={async () => {
                setIsLoading(true);
                await onConfirm();
                setIsLoading(false);
              }}
              className="w-full py-2 px-4 rounded-md bg-blue-600 text-white font-medium hover:bg-blue-700"
            >
              Confirm
            </button>
          </div>
        </>
      )}
    </div>
  );
}

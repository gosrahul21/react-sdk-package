import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

interface UseMFCentralResponseProps {
  mobileNumber: string;
  panNumber: string;
  onConfirm: (portfolioData?: any) => void;
}

export function useMFCentralResponse({
  mobileNumber,
  panNumber,
  onConfirm,
}: UseMFCentralResponseProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(true);
  const [otpSession, setOtpSession] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRef = useRef<HTMLInputElement>(null);

  const fetchPortfolio = async () => {
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
        throw new Error(data.message || "Unable to fetch portfolio.");
      }
    } catch (err) {
      let message = "Failed to fetch portfolio";
      if (axios.isAxiosError(err)) {
        message = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        message = err.message;
      }
      enqueueSnackbar(message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const verifyPortfolioOtp = async () => {
    if (otp.length !== 6 || !/^\d+$/.test(otp)) {
      enqueueSnackbar("Please enter a valid 6-digit OTP.", {
        variant: "error",
      });
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
      enqueueSnackbar(message, { variant: "error" });
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

  return {
    isLoading,
    otpSession,
    otp,
    setOtp,
    otpVerified,
    canResend,
    resendTimer,
    handleResendOtp,
    inputRef,
  };
}

import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

interface UseOtpVerificationProps {
  mobileNumber: string;
  onSuccess: (data: any) => void;
}

export function useOtpVerification({
  mobileNumber,
  onSuccess,
}: UseOtpVerificationProps) {
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { enqueueSnackbar } = useSnackbar();

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return;

    setIsLoading(true);

    try {
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("SDK credentials not found");
      }

      const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/verify-otp`,
        {
          phone: `+91${mobileNumber}`,
          sessionId: sessionId,
          otp: otp,
        },
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      onSuccess(response.data);
    } catch (err) {
      let errorMessage = "Failed to verify OTP";

      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      enqueueSnackbar(errorMessage, {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setCountdown(30);
      // You might want to call the same API as Step1 to resend OTP
      enqueueSnackbar("OTP resent successfully", {
        variant: "success",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    } catch (err) {
      enqueueSnackbar("Failed to resend OTP", {
        variant: "error",
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      });
    }
  };

  return {
    otp,
    setOtp,
    isLoading,
    countdown,
    handleVerifyOtp,
    handleResendOtp,
  };
}

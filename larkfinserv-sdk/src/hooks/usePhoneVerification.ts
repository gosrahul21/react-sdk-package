import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

interface UsePhoneVerificationProps {
  mobileNumber: string;
  onSuccess: (data: any) => void;
}

export function usePhoneVerification({
  mobileNumber,
  onSuccess,
}: UsePhoneVerificationProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckEligibility = async () => {
    if (mobileNumber.length !== 10) return;

    setIsLoading(true);

    try {
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("SDK credentials not found");
      }

      const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/verify-phone`,
        {
          phone: `+91${mobileNumber}`,
          sessionId: sessionId,
        },
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": true,
          },
        }
      );

      onSuccess(response.data);
    } catch (err) {
      let errorMessage = "Failed to verify phone number";

      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message ||
            `Server error: ${err.response.status}`;
        } else if (err.request) {
          errorMessage =
            "No response from server. Please check your connection.";
        } else {
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }

      enqueueSnackbar(errorMessage, { variant: "error" });
      console.error("Phone verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, handleCheckEligibility };
}

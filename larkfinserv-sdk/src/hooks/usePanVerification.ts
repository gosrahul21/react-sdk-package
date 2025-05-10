import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

interface UsePanVerificationProps {
  mobileNumber: string;
  panNumber: string;
  sessionId: string;
  onSuccess: (data: any) => void;
}

export function usePanVerification({
  mobileNumber,
  panNumber,
  sessionId,
  onSuccess,
}: UsePanVerificationProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [isLoading, setIsLoading] = useState(false);
  const [panMismatch, setPanMismatch] = useState(false);

  const handlePanSubmit = async () => {
    if (panNumber.length !== 10) return;

    setIsLoading(true);
    setPanMismatch(false);

    try {
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("SDK credentials not found");
      }

      const { apiKey, apiSecret } = JSON.parse(sdkCredentials);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/verify-pan`,
        {
          pan: panNumber,
          phone: `+91${mobileNumber}`,
          sessionId: sessionId || JSON.parse(sdkCredentials).sessionId,
        },
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.status === "mismatch") {
        setPanMismatch(true);
        enqueueSnackbar("PAN not associated with this phone number", {
          variant: "error",
        });
      } else {
        onSuccess(response.data);
      }
    } catch (err) {
      let errorMessage = "Failed to verify PAN";
      if (axios.isAxiosError(err)) {
        errorMessage = err.response?.data?.message || err.message;
      } else if (err instanceof Error) {
        errorMessage = err.message;
      }
      enqueueSnackbar(errorMessage, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, panMismatch, handlePanSubmit };
}

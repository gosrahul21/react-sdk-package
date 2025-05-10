import { useState } from "react";
import axios from "axios";
import { useSnackbar } from "notistack";

interface UseReportIssueProps {
  mobileNumber: string;
  sessionId: string;
}

export function useReportIssue({
  mobileNumber,
  sessionId,
}: UseReportIssueProps) {
  const { enqueueSnackbar } = useSnackbar();
  const [issueType, setIssueType] = useState("PORTFOLIO_FETCH_ERROR");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleReportIssue = async () => {
    setIsSubmitting(true);

    try {
      if (!issueType) {
        throw new Error("Please select an issue type");
      }

      const trimmedDescription = description.trim();
      if (!trimmedDescription) {
        throw new Error("Please describe the issue");
      }
      if (trimmedDescription.length < 20) {
        throw new Error("Description must be at least 20 characters");
      }
      if (trimmedDescription.length > 500) {
        throw new Error("Description cannot exceed 500 characters");
      }

      if (!mobileNumber || !/^\d{10}$/.test(mobileNumber)) {
        throw new Error("Valid mobile number is required");
      }

      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("Session expired. Please refresh the page.");
      }

      const {
        apiKey,
        apiSecret,
        sessionId: storedSessionId,
      } = JSON.parse(sdkCredentials);

      if (!apiKey || !apiSecret) {
        throw new Error("Invalid session credentials");
      }

      const currentSessionId = sessionId || storedSessionId;
      if (!currentSessionId) {
        throw new Error("Session ID is required");
      }

      const requestData = {
        phone: `+91${mobileNumber}`,
        sessionId: currentSessionId,
        issueType,
        description: trimmedDescription,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/report-issue`,
        requestData,
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data?.success) {
        setSubmitSuccess(true);
        setTimeout(() => {
          setSubmitSuccess(false);
          setDescription("");
          setIssueType("PORTFOLIO_FETCH_ERROR");
        }, 2000);
      } else {
        throw new Error(response.data?.message || "Failed to report issue");
      }
    } catch (err) {
      let errorMessage = "Failed to report issue";
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
      setIsSubmitting(false);
    }
  };

  return {
    issueType,
    setIssueType,
    description,
    setDescription,
    isSubmitting,
    submitSuccess,
    handleReportIssue,
  };
}

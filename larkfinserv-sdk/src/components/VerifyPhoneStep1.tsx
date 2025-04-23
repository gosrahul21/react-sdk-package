import { useState } from "react";
import axios from "axios";

export default function VerifyPhoneStep1({
  onSuccess,
  mobileNumber,
  setMobileNumber,
}: {
  onSuccess: (data: any) => void;
  mobileNumber: string;
  setMobileNumber: (mobileNumber: string) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckEligibility = async () => {
    if (mobileNumber.length !== 10) return;

    setIsLoading(true);
    setError(null);

    try {
      // Retrieve credentials from sessionStorage
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("SDK credentials not found");
      }

      let { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);
      // (sdkKey = "sdk_test_6ee7e179854e3528d81425040e7409d8"),
      //   (sdkSecret = "secret_test_7971810b6de99f626eb580af6c24b5f7");
      // sessionId = "sdk_1745427431306_4fgm6o5onxk";
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
        // Handle different types of Axios errors
        if (err.response) {
          // Server responded with error status
          errorMessage =
            err.response.data?.message ||
            `Server error: ${err.response.status}`;
        } else if (err.request) {
          // Request was made but no response received
          errorMessage =
            "No response from server. Please check your connection.";
        } else {
          // Other Axios errors
          errorMessage = err.message;
        }
      } else if (err instanceof Error) {
        // Handle our custom error for missing credentials
        errorMessage = err.message;
      }

      setError(errorMessage);
      console.error("Phone verification error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800 text-center">
        Mutual Fund Loan
      </h2>
      <h3 className="text-gray-600 text-center">Quick Eligibility Check</h3>
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
            setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))
          }
          maxLength={10}
        />
      </div>

      {error && <div className="text-red-500 text-sm text-center">{error}</div>}

      <button
        onClick={handleCheckEligibility}
        disabled={mobileNumber.length !== 10 || isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          mobileNumber.length === 10 && !isLoading
            ? "bg-green-700 hover:bg-green-800 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Verifying...
          </span>
        ) : (
          "Check Eligibility"
        )}
      </button>
    </div>
  );
}

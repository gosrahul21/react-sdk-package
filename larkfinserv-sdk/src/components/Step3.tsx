import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { useState } from "react";

export default function Step3({
  mobileNumber,
  userIntent,
  handleUserIntent,
  setStep,
}: {
  mobileNumber: string;
  userIntent: string;
  handleUserIntent: (intent: string) => void;
  setStep: (step: number) => void;
}) {
  // const { enqueueSnackbar } = useSnackbar();

  const [isLoading, setIsLoading] = useState(false);

  const handleIntentSelection = (intent: string) => {
    handleUserIntent(intent);
  };

  const handleProceed = async () => {
    try {
      const sdkCredentials = sessionStorage.getItem("sdkCredentials");
      if (!sdkCredentials) {
        throw new Error("SDK credentials not found");
      }

      const { apiKey, apiSecret, sessionId } = JSON.parse(sdkCredentials);

      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/loan-sdk/update-loan-preference`,
        {
          phone: `+91${mobileNumber}`,
          sessionId: sessionId,
          preference: userIntent,
        },
        {
          headers: {
            "X-SDK-Key": apiKey,
            "X-SDK-Secret": apiSecret,
            "Content-Type": "application/json",
          },
        }
      );

      response.data && setStep(4);

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

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">
        What brings you here?
      </h2>
      <p className="text-gray-600">Select your intent to proceed</p>

      <div className="space-y-3">
        <button
          onClick={() => handleIntentSelection("check_eligibility")}
          className={`w-full py-3 px-4 rounded-md border text-left ${
            userIntent === "check_eligibility"
              ? "border-green-500 bg-green-50 cursor-pointer"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                userIntent === "check_eligibility"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {userIntent === "check_eligibility" && (
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
          onClick={() => handleIntentSelection("apply_later")}
          className={`w-full py-3 px-4 rounded-md border text-left ${
            userIntent === "apply_later"
              ? "border-green-500 bg-green-50 cursor-pointer"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                userIntent === "apply_later"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {userIntent === "apply_later" && (
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
            <span className="font-medium">I may need a loan in future</span>
          </div>
        </button>

        <button
          onClick={() => handleIntentSelection("need_now")}
          className={`w-full py-3 px-4 rounded-md border text-left ${
            userIntent === "need_now"
              ? "border-green-500 bg-green-50 cursor-pointer"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                userIntent === "need_now"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {userIntent === "need_now" && (
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
        onClick={handleProceed}
        disabled={!userIntent || isLoading}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          userIntent
            ? "bg-green-600 hover:bg-green-700 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Proceeding..." : "Proceed"}
      </button>
    </div>
  );
}

import { useOtpVerification } from "../hooks/useOtpVerification";

interface Step2Props {
  mobileNumber: string;
  sessionId: string;
  onSuccess: (data: any) => void;
  onBack?: () => void;
  userExists?: boolean;
}

export default function Step2({
  mobileNumber,
  onSuccess,
  onBack,
  userExists = false,
}: Step2Props) {
  const {
    otp,
    setOtp,
    isLoading,
    countdown,
    handleVerifyOtp,
    handleResendOtp,
  } = useOtpVerification({ mobileNumber, onSuccess });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-center text-green-800">
        Verify OTP
      </h2>

      {userExists ? (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-yellow-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Your account already exists. Please login via original provider.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          <p className="text-gray-600 text-center">
            We've sent an OTP to +91{" "}
            {mobileNumber.replace(/(\d{3})(\d{3})(\d{4})/, "******$3")}
          </p>

          <div className="space-y-2">
            <label
              htmlFor="otp"
              className="block text-sm font-medium text-gray-700"
            >
              Enter OTP
            </label>
            <input
              type="text"
              id="otp"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              maxLength={6}
            />
          </div>

          <div className="flex justify-between items-center text-sm">
            <button
              onClick={handleResendOtp}
              disabled={countdown > 0}
              className={`${
                countdown > 0
                  ? "text-gray-400"
                  : "text-blue-600 hover:text-blue-800"
              }`}
            >
              Resend OTP
            </button>
            <span className="text-gray-500">
              {countdown > 0
                ? `00:${countdown.toString().padStart(2, "0")}`
                : ""}
            </span>
          </div>

          <button
            onClick={handleVerifyOtp}
            disabled={otp.length !== 6 || isLoading}
            className={`w-full py-2 px-4 rounded-md text-white font-medium ${
              otp.length === 6 && !isLoading
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
              "Verify OTP"
            )}
          </button>

          {onBack && (
            <button
              onClick={onBack}
              className="w-full py-2 px-4 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50"
            >
              Back
            </button>
          )}
        </>
      )}
    </div>
  );
}

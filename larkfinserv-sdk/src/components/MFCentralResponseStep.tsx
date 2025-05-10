import { useMFCentralResponse } from "../hooks/useMFCentralResponse";
import LoadingButton from "./LoadingButton";
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
  const {
    isLoading,
    otpSession,
    otp,
    setOtp,
    otpVerified,
    canResend,
    resendTimer,
    handleResendOtp,
    inputRef,
    verifyPortfolioOtp,
  } = useMFCentralResponse({
    mobileNumber,
    panNumber,
    onConfirm,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">Investment Check</h2>

      {!otpSession ? (
        <div className="flex justify-center items-center">
          <svg
            className="animate-spin h-6 w-6 text-green-600"
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
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        </div>
      ) : otpSession && !otpVerified ? (
        <div className="space-y-4">
          <label
            htmlFor="otp"
            className="block text-sm font-medium text-gray-700"
          >
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
          <LoadingButton
            onClick={verifyPortfolioOtp}
            disabled={otp.length !== 6 || isLoading}
            isLoading={isLoading}
            loadingText="Verifying OTP..."
          >
            Verify OTP
          </LoadingButton>
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
              The response from MF Central indicates that you do not hold any
              investment. Can you confirm?
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
                // await onConfirm();
                console.log("Closing frame");
                window.parent.postMessage({ type: "CLOSE_FRAME" }, "*");
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

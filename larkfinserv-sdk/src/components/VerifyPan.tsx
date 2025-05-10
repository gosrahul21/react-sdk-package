import { usePanVerification } from "../hooks/usePanVerification";
import LoadingButton from "./LoadingButton";

interface VerifyPanProps {
  mobileNumber: string;
  panNumber: string;
  setPanNumber: (panNumber: string) => void;
  sessionId: string;
  onSuccess: (data: any) => void;
  onBack?: () => void;
}

export default function VerifyPan({
  mobileNumber,
  panNumber,
  setPanNumber,
  sessionId,
  onSuccess,
  onBack,
}: VerifyPanProps) {
  const { isLoading, panMismatch, handlePanSubmit } = usePanVerification({
    mobileNumber,
    panNumber,
    sessionId,
    onSuccess,
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">PAN Verification</h2>

      {panMismatch ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">
                Your phone number ******{mobileNumber.slice(-4)} is not
                associated with your PAN. Please provide the correct phone
                number.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-gray-600">Enter your PAN number for verification</p>
      )}

      <div className="space-y-2">
        <label
          htmlFor="pan"
          className="block text-sm font-medium text-gray-700"
        >
          PAN Number
        </label>
        <input
          type="text"
          id="pan"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 uppercase"
          placeholder="Enter 10-digit PAN"
          value={panNumber}
          onChange={(e) =>
            setPanNumber(
              e.target.value
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, "")
                .slice(0, 10)
            )
          }
          maxLength={10}
        />
      </div>

      <div className="flex flex-col space-y-3">
        <LoadingButton
          onClick={handlePanSubmit}
          disabled={panNumber.length !== 10 || isLoading}
          isLoading={isLoading}
          loadingText="Verifying..."
        >
          Verify PAN
        </LoadingButton>

        {onBack && (
          <button
            onClick={onBack}
            className="w-full py-2 px-4 rounded-md text-gray-700 font-medium border border-gray-300 hover:bg-gray-50"
          >
            Back
          </button>
        )}
      </div>
    </div>
  );
}

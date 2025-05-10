import { usePhoneVerification } from "../hooks/usePhoneVerification";
import LoadingButton from "./LoadingButton";

export default function VerifyPhoneStep1({
  onSuccess,
  mobileNumber,
  setMobileNumber,
}: {
  onSuccess: (data: any) => void;
  mobileNumber: string;
  setMobileNumber: (mobileNumber: string) => void;
}) {
  const { isLoading, handleCheckEligibility } = usePhoneVerification({
    mobileNumber,
    onSuccess,
  });

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

      <LoadingButton
        onClick={handleCheckEligibility}
        disabled={mobileNumber.length !== 10 || isLoading}
        isLoading={isLoading}
        loadingText="Verifying..."
      >
        Check Eligibility
      </LoadingButton>
    </div>
  );
}

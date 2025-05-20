export default function Step3({
  userIntent,
  handleUserIntent,
  setStep,
}: {
  userIntent: string;
  handleUserIntent: (intent: string) => void;
  setStep: (step: number) => void;
}) {
  // const { enqueueSnackbar } = useSnackbar();

  const handleIntentSelection = (intent: string) => {
    handleUserIntent(intent);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-green-800">
        What brings you here?
      </h2>
      <p className="text-gray-600">Select your intent to proceed</p>

      <div className="space-y-3">
        <button
          onClick={() => handleIntentSelection("exploring")}
          className={`w-full py-3 px-4 rounded-md border text-left ${
            userIntent === "exploring"
              ? "border-green-500 bg-green-50 cursor-pointer"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                userIntent === "exploring"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {userIntent === "exploring" && (
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
          onClick={() => handleIntentSelection("future")}
          className={`w-full py-3 px-4 rounded-md border text-left ${
            userIntent === "future"
              ? "border-green-500 bg-green-50 cursor-pointer"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                userIntent === "future"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {userIntent === "future" && (
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
          onClick={() => handleIntentSelection("now")}
          className={`w-full py-3 px-4 rounded-md border text-left ${
            userIntent === "now"
              ? "border-green-500 bg-green-50 cursor-pointer"
              : "border-gray-300 bg-gray-50 hover:border-gray-400"
          }`}
        >
          <div className="flex items-center">
            <div
              className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                userIntent === "now"
                  ? "border-green-500 bg-green-500"
                  : "border-gray-400 bg-white"
              }`}
            >
              {userIntent === "now" && (
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
        onClick={() => {
          setStep(4);
        }}
        disabled={!userIntent}
        className={`w-full py-2 px-4 rounded-md text-white font-medium ${
          userIntent
            ? "bg-green-600 hover:bg-green-700 cursor-pointer"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Proceed
      </button>
    </div>
  );
}

import { useEffect, useState } from "react";
import LoanEligibilitySDK from "frontend-sdk";
import "./App.css";

// Types for better type safety
type SDKStatus = "idle" | "loading" | "success" | "error" | "completed";

function App() {
  const [sdk, setSdk] = useState<LoanEligibilitySDK | null>(null);
  const [status, setStatus] = useState<SDKStatus>("idle");
  const [message, setMessage] = useState("Check Eligibility");
  const [error, setError] = useState<string | null>(null);

  // Initialize SDK
  useEffect(() => {
    try {
      const sdkInstance = new LoanEligibilitySDK({
        apiKey: import.meta.env.VITE_SDK_KEY,
        apiSecret: import.meta.env.VITE_SDK_SECRET,
        phoneNumber: "+917004572140",
      });

      // sdkInstance.openEligibilityCheck("popup");
      // Set up event handlers
      sdkInstance.on("initiated", () => {
        setStatus("loading");
        setMessage("Loading eligibility check...");
      });

      sdkInstance.on("ready", () => {
        setMessage("Please complete the form");
      });

      sdkInstance.on("completed", (result: any) => {
        setStatus("completed");
        setMessage("Eligibility check complete!");
        console.log("Eligibility result:", result);
      });

      sdkInstance.on("error", (err: any) => {
        setStatus("error");
        setError(err.message || "An error occurred");
        setMessage("Try Again");
        console.error("SDK Error:", err);
      });

      sdkInstance.on("closed", () => {
        if (status !== "completed") {
          setMessage("Check Eligibility");
          setStatus("idle");
        }
      });

      setSdk(sdkInstance);

      return () => {
        // Clean up event listeners
        sdkInstance.off("initiated", () => {});
        sdkInstance.off("ready", () => {});
        sdkInstance.off("completed", () => {});
        sdkInstance.off("error", () => {});
        sdkInstance.off("closed", () => {});
      };
    } catch (err) {
      setStatus("error");
      setError("Failed to initialize SDK");
      console.error("Initialization error:", err);
    }
  }, []);

  const handleClick = async () => {
    if (!sdk) {
      setError("SDK not initialized");
      return;
    }

    try {
      setError(null);
      await sdk.initialize({
        partnerId: import.meta.env.VITE_PARTNER_ID,
        apiKey: import.meta.env.VITE_SDK_KEY,
        apiSecret: import.meta.env.VITE_SDK_SECRET,
      });
      sdk.openEligibilityCheck("popup");
    } catch (err) {
      setStatus("error");
      setError("Failed to open eligibility check");
      console.error("Open error:", err);
    }
  };

  // Button state management
  const getButtonClass = () => {
    switch (status) {
      case "loading":
        return "button loading";
      case "error":
        return "button error";
      case "completed":
        return "button success";
      default:
        return "button";
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Loan Eligibility Check</h1>
        <p className="app-description">
          Check your eligibility for a loan in just a few simple steps
        </p>
      </header>

      <main className="app-main">
        <div className="card">
          <button
            onClick={handleClick}
            className={getButtonClass()}
            disabled={status === "loading"}
          >
            {status === "loading" ? (
              <>
                <span className="spinner"></span>
                {message}
              </>
            ) : (
              message
            )}
          </button>

          {error && (
            <div className="error-message">
              <p>{error}</p>
              {status === "error" && (
                <button
                  onClick={() => {
                    setError(null);
                    setStatus("idle");
                  }}
                  className="button retry"
                >
                  Retry
                </button>
              )}
            </div>
          )}

          {status === "completed" && (
            <div className="success-message">
              <p>✓ Eligibility check completed successfully</p>
              <p className="small">Check your console for detailed results</p>
            </div>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Powered by Your Company</p>
      </footer>
    </div>
  );
}

export default App;

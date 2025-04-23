import LoanEligibilitySDK from "./sdk";
const VITE_SDK_KEY="sdk_test_6ee7e179854e3528d81425040e7409d8"
const VITE_SDK_SECRET="secret_test_7971810b6de99f626eb580af6c24b5f7"
const sdk = new LoanEligibilitySDK({
  apiKey: VITE_SDK_KEY,
  apiSecret: VITE_SDK_SECRET,
  partnerId: "1234567890",
});

sdk.initialize({
  apiKey: VITE_SDK_KEY,
  apiSecret: VITE_SDK_SECRET,
  partnerId: "1234567890",
});




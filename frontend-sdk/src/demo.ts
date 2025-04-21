import LoanEligibilitySDK from './index';

// Initialize SDK
const eligibilitySDK = LoanEligibilitySDK.initialize({
    partnerId: 'acme_bank',
    partnerName: 'Acme Bank App',
    // authToken: 'partner_auth_token_123',
    theme: {
        primaryColor: '#3366cc',
        fontFamily: 'Arial'
    },
    environment: 'sandbox'
});

// Set up event handlers
eligibilitySDK.on('ready', () => {
    console.log('Eligibility checker is ready');
    
    // Optionally pre-fill some user data
    eligibilitySDK.sendData({
        name: 'John Doe',
        email: 'john@example.com'
    });
});

eligibilitySDK.on('completed', (result) => {
    console.log('Eligibility result:', result);
});

eligibilitySDK.on('error', (error) => {
    console.error('Error occurred:', error);
});

eligibilitySDK.on('closed', () => {
    console.log('Eligibility checker closed');
});

// Button click handler
document.getElementById("check-eligibility")?.addEventListener("click", () => {
  eligibilitySDK.openEligibilityCheck("popup");
});

export type EligibilityResult = {
  eligible: boolean;
  amount?: number;
  interestRate?: number;
  terms?: string[];
  reasons?: string[];
  mobile?: string;
  partnerId?: string;
  sessionId?: string;
  result?: {
    selectedOffer: any;
  };
};

export type PartnerConfig = {
  partnerId?: string;
  partnerName?: string;
  userId?: string;
  userData?: Record<string, unknown>;
  sessionId?: string;
  phoneNumber?: string;
  theme?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    logoUrl?: string;
    name?: string;
  };
  apiKey: string;
  apiSecret: string;
  environment?: 'sandbox' | 'production';
};

export type SDKEventType =
  | 'READY'
  | 'ELIGIBILITY_RESULT'
  | 'ERROR'
  | 'CLOSE'
  | 'INITIATED'
  | 'CLOSE_FRAME';

export type SDKMode = 'popup' | 'inline';

export interface SDKEventData {
  sessionId?: string;
  themeConfig?: Record<string, unknown>;
  error?: SDKError;
  result?: {
    status: string;
    data: Record<string, unknown>;
  };
}

export interface SDKEvent {
  type: SDKEventType;
  data: SDKEventData;
}

export interface SDKError {
  code: string;
  message: string;
}

export type EventHandler = (event: SDKEvent) => void;

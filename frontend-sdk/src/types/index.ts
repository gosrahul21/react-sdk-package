export type EligibilityResult = {
  eligible: boolean;
  amount?: number;
  interestRate?: number;
  terms?: string[];
  reasons?: string[];
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

export type SDKEvent = 
  | 'ready'
  | 'initiated'
  | 'completed'
  | 'closed'
  | 'error';

export type EventHandler<T = unknown> = (data: T) => void;

export type SDKError = {
  code: string;
  message: string;
  recoverable: boolean;
};
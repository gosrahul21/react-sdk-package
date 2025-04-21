export type EligibilityResult = {
  eligible: boolean;
  amount?: number;
  interestRate?: number;
  terms?: string[];
  reasons?: string[];
};

export type PartnerConfig = {
  partnerId: string;
  partnerName?: string;
  userId?: string;
  userData?: Record<string, unknown>;
  theme?: {
      primaryColor?: string;
      secondaryColor?: string;
      fontFamily?: string;
  };
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
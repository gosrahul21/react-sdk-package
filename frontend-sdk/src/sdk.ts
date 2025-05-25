import { SDK_API_URL, SDK_URL } from './config/constants';

import { PartnerConfig, SDKEvent, EventHandler, SDKEventData, SDKMode } from './types';

import axios from 'axios';

class LoanEligibilitySDK {
  private config: PartnerConfig;
  private iframe?: HTMLIFrameElement;
  private eventHandlers: Map<string, EventHandler> = new Map();
  private iframeUrl: string = '';
  private childWindow: Window | null = null;
  private apiKey: string = '';
  private apiSecret: string = '';
  private sessionToken: string = '';
  private popupWindow: Window | null = null;
  private containerId: string = 'larkfinserv-sdk-container';

  constructor(config: PartnerConfig) {
    this.config = config;
    // this.iframeUrl = this.generateIframeUrl();
    // this.validateConfig();
    this.generateSessionToken();
    this.setupMessageListener();
  }

  public async initialize(_config: PartnerConfig): Promise<void> {
    try {
      // Validate required configuration
      if (!this.config.apiKey || !this.config.apiSecret) {
        throw new Error('Missing required configuration: apiKey and apiSecret are required');
      }
      let endpoint = `${SDK_API_URL}/loan-sdk/init`;

      if (this.config.phoneNumber) {
        endpoint = `${endpoint}?phone=${this.config.phoneNumber}&isVerified=${true}`;
      }
      // Make API request
      const response = await axios.get(endpoint, {
        headers: {
          'X-SDK-Key': this.config.apiKey,
          'X-SDK-Secret': this.config.apiSecret,
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': true,
        },
        timeout: 10000, // 10 seconds timeout
      });
      // Validate response structure
      if (!response.data || !response.data.sessionId || !response.data.themeConfig) {
        throw new Error('Invalid response structure from initialization API');
      }

      // Update configuration
      this.config = {
        ...this.config,
        theme: response.data.themeConfig,
        sessionId: response.data.sessionId,
        partnerName: response.data.partnerName,
        partnerId: response.data.partnerId,
      };

      this.iframeUrl = this.generateIframeUrl();
    } catch (error: any) {
      console.log('error', error);
      let errorMessage = 'Failed to initialize SDK';

      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        if (error.response) {
          // Server responded with a status code outside 2xx
          errorMessage += `: ${error.response.status} - ${error.response.data?.message || 'No error message'}`;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage += ': No response received from server';
        } else {
          // Something happened in setting up the request
          errorMessage += `: ${error.message}`;
        }
      } else if (error instanceof Error) {
        // Handle other Error types
        errorMessage += `: ${error.message}`;
      }

      console.error(errorMessage, error);
      throw new Error(errorMessage);
    }
  }

  private validateConfig(): void {
    if (!this.config.partnerId) {
      throw new Error(
        'Missing required configuration: partnerId, partnerName, and authToken are required'
      );
    }
  }

  private setupMessageListener(): void {
    window.addEventListener('message', (event) => {
      // In production, check origin
      // if (event.origin !== LARKFINSERV_ORIGIN_URL) return; // add check for the larkfinserv-sdk hosted url
      console.log(event.origin, event.data, 'origin');
      const { data } = event;
      if (!data?.type) return;

      switch (data.type) {
        case 'READY':
          this.emitEvent('READY');
          break;
        case 'ELIGIBILITY_RESULT':
          console.log('ELIGIBILITY_RESULT', data);
          this.emitEvent('ELIGIBILITY_RESULT', data.data);
          // if not popup then close the frame
          this.closeFrame();
          break;
        case 'ERROR':
          this.closeFrame();
          this.emitEvent('ERROR', { error: data.data.error });
          break;
        case 'CLOSE':
          this.closeFrame();
          this.emitEvent('CLOSE');
          break;
        case 'CLOSE_FRAME':
          this.emitEvent('CLOSE_FRAME', data.data);
          this.closeFrame();
          break;
      }
    });
  }

  private generateSessionToken(): void {
    // In a real implementation, this would be a proper JWT or server-generated token
    this.sessionToken = btoa(
      JSON.stringify({
        partnerId: this.config.partnerId,
        timestamp: Date.now(),
        ttl: 3600, // 1 hour
      })
    );
  }

  private generateIframeUrl(): string {
    const baseUrl = this.config.environment === 'sandbox' ? SDK_URL : SDK_URL;

    const params = new URLSearchParams();
    params.append('authKey', this.config.apiKey);

    if (this.config.apiSecret) {
      params.append('authSecret', this.config.apiSecret);
    }

    if (this.config.sessionId) {
      params.append('sessionId', this.config.sessionId);
    }

    if (this.config.theme) {
      params.append('theme', JSON.stringify(this.config.theme));
    }

    if (this.config.phoneNumber) {
      params.append('phoneNumber', this.config.phoneNumber);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  public openEligibilityCheck(mode: SDKMode): void {
    if (mode === 'popup') {
      const width = 500;
      const height = 700;
      const left = (window.screen.width - width) / 2;
      const top = (window.screen.height - height) / 2;

      this.childWindow = window.open(
        this.iframeUrl,
        '_blank',
        `width=${width},height=${height},scrollbars=yes,left=${left},top=${top}`
      )!;
      this.onClosePopupListener();
      this.emitEvent('INITIATED');
      return;
    }
  
    if (mode === 'inline') {
      // Create backdrop overlay if it doesn't exist
      let backdrop = document.getElementById(this.containerId + '-backdrop');
      if (!backdrop) {
        backdrop = document.createElement('div');
        backdrop.id = this.containerId + '-backdrop';
        backdrop.style.position = 'fixed';
        backdrop.style.top = '0';
        backdrop.style.left = '0';
        backdrop.style.width = '100vw';
        backdrop.style.height = '100vh';
        backdrop.style.background = 'rgba(0,0,0,0.4)';
        backdrop.style.zIndex = '999';
        backdrop.style.opacity = '0';
        backdrop.style.transition = 'opacity 0.3s';
        document.body.appendChild(backdrop);
        setTimeout(() => {
          backdrop!.style.opacity = '1';
        }, 10);
        backdrop.onclick = () => {
          this.closeFrame();
          this.emitEvent('CLOSE_FRAME');
        };
      }
  
      // Create container if it doesn't exist
      let container = document.getElementById(this.containerId);
      if (!container) {
        container = document.createElement('div');
        container.id = this.containerId;
        container.setAttribute('role', 'dialog');
        container.setAttribute('aria-modal', 'true');
        container.setAttribute('tabindex', '-1');
        container.style.position = 'fixed';
        container.style.top = '50%';
        container.style.left = '50%';
        container.style.transform = 'translate(-50%, -50%)';
        container.style.width = '500px';
        container.style.maxWidth = '95vw';
        container.style.height = '700px';
        container.style.maxHeight = '95vh';
        container.style.backgroundColor = 'white';
        container.style.boxShadow = '0 0 20px rgba(0,0,0,0.3)';
        container.style.zIndex = '1000';
        container.style.borderRadius = '12px';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';
        document.body.appendChild(container);
        setTimeout(() => {
          container!.style.opacity = '1';
        }, 10);
      }
      container.innerHTML = '';
  
      // Create header with close button
      const header = document.createElement('div');
      header.style.padding = '10px 15px';
      header.style.display = 'flex';
      header.style.justifyContent = 'flex-end';
      header.style.alignItems = 'center';
      header.style.borderBottom = '1px solid #eee';
  
      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&times;'; // Using × symbol
      closeButton.style.background = 'none';
      closeButton.style.border = 'none';
      closeButton.style.fontSize = '24px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.padding = '0 10px';
      closeButton.style.color = '#666';
      closeButton.addEventListener('click', () => {
        this.closeFrame();
        this.emitEvent('CLOSE_FRAME');
      });
  
      header.appendChild(closeButton);
      container.appendChild(header);
  
      // Create iframe container
      const iframeContainer = document.createElement('div');
      iframeContainer.style.flex = '1';
      iframeContainer.style.overflow = 'hidden';
      iframeContainer.style.borderRadius = '0 0 12px 12px';
  
      // Create and append iframe
      this.iframe = document.createElement('iframe');
      this.iframe.src = this.iframeUrl;
      this.iframe.style.width = '100%';
      this.iframe.style.height = '100%';
      this.iframe.style.border = 'none';
      iframeContainer.appendChild(this.iframe);
      container.appendChild(iframeContainer);
  
      this.emitEvent('INITIATED');
    }
  }




  private onClosePopupListener(): void {
    // Check periodically if the popup is closed
    console.log('onClosePopupListener');
    const interval = setInterval(() => {
      console.log(this.childWindow, this.childWindow?.closed, 'closing status');
      if (this.childWindow && this.childWindow.closed) {
        clearInterval(interval); // Stop checking once closed
        this.childWindow = null;
        this.emitEvent('CLOSE_FRAME');
      }
    }, 500); // Check every 500ms
  }

  public closeFrame(): void {
    if (this.childWindow) {
      this.childWindow.close();
      this.childWindow = null;
    }

    // Remove inline modal and backdrop
    const container = document.getElementById(this.containerId);
    if (container) {
      // Fade out before removing
      container.style.opacity = '0';
      setTimeout(() => {
        container.remove();
      }, 300);
    }
    const backdrop = document.getElementById(this.containerId + '-backdrop');
    if (backdrop) {
      backdrop.style.opacity = '0';
      setTimeout(() => {
        backdrop.remove();
      }, 300);
    }
  }

  public on(event: SDKEvent['type'], handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, handler);
    }
  }

  public off(event: SDKEvent['type'], _handler: EventHandler): void {
    this.eventHandlers.delete(event);
  }

  public sendData(data: Record<string, unknown>): void {
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error('Eligibility check iframe not open');
    }

    this.iframe.contentWindow.postMessage(
      {
        type: 'USER_DATA_UPDATE',
        data,
        metadata: {
          partnerId: this.config.partnerId,
          // sessionToken: this.sessionToken,
        },
      },
      '*'
    ); // In production, specify exact origin
  }

  private emitEvent(eventType: SDKEvent['type'], data?: SDKEventData): void {
    const handler = this.eventHandlers.get(eventType);
    if (handler) {
      handler({ type: eventType, data: data || {} });
    }
  }

  private handleError(error: Error | unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          code: 'SDK_ERROR',
          message: error.message,
        },
      };
    }
    return {
      success: false,
      error: {
        code: 'SDK_ERROR',
        message: 'An unknown error occurred',
      },
    };
  }

  private handleCloseMessage(_event: MessageEvent<SDKEvent>): void {
    if (this.popupWindow) {
      this.popupWindow.close();
      this.emitEvent('CLOSE');
    }
  }
}

export default LoanEligibilitySDK;

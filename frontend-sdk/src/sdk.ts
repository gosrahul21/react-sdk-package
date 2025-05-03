import { SDK_API_URL, SDK_URL } from "./config/constants";
import {
  PartnerConfig,
  EligibilityResult,
  SDKEvent,
  EventHandler,
  SDKError,
} from "./types";
import axios from "axios";

class LoanEligibilitySDK {
  private config: PartnerConfig;
  private iframe?: HTMLIFrameElement;
  private eventHandlers: Map<SDKEvent, Set<EventHandler>> = new Map();
  private iframeUrl: string = "";
  private sessionToken: string = "";
  private static instance: LoanEligibilitySDK | null = null;

  constructor(config: PartnerConfig) {
    this.config = config;
    // this.iframeUrl = this.generateIframeUrl();
    // this.validateConfig();
    this.generateSessionToken();
    // this.setupMessageListener();  // comment this as of now
  }

  public async initialize(config: PartnerConfig): Promise<void> {
    try {
      // Validate required configuration
      if (!this.config.apiKey || !this.config.apiSecret) {
        throw new Error(
          "Missing required configuration: apiKey and apiSecret are required"
        );
      }
      let endpoint = `${SDK_API_URL}/loan-sdk/init`;

      if (this.config.phoneNumber) {
        endpoint = `${endpoint}?phoneNumber=${this.config.phoneNumber}&isVerified=${true}`;
      }
      // Make API request
      const response = await axios.get(endpoint, {
        headers: {
          "X-SDK-Key": this.config.apiKey,
          "X-SDK-Secret": this.config.apiSecret,
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": true,
        },
        timeout: 10000, // 10 seconds timeout
      });
      // Validate response structure
      if (
        !response.data ||
        !response.data.sessionId ||
        !response.data.themeConfig
      ) {
        throw new Error("Invalid response structure from initialization API");
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
      console.log("error", error);
      let errorMessage = "Failed to initialize SDK";

      if (axios.isAxiosError(error)) {
        // Handle Axios-specific errors
        if (error.response) {
          // Server responded with a status code outside 2xx
          errorMessage += `: ${error.response.status} - ${error.response.data?.message || "No error message"}`;
        } else if (error.request) {
          // Request was made but no response received
          errorMessage += ": No response received from server";
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
        "Missing required configuration: partnerId, partnerName, and authToken are required"
      );
    }
  }

  private setupMessageListener(): void {
    window.addEventListener("message", (event) => {
      // In production, check origin
      const { data } = event;
      if (!data?.type) return;

      switch (data.type) {
        case "READY":
          this.emitEvent("ready");
          break;
        case "ELIGIBILITY_RESULT":
          this.emitEvent("completed", data.result as EligibilityResult);
          break;
        case "ERROR":
          this.emitEvent("error", data.error as SDKError);
          break;
        case "CLOSE":
          this.emitEvent("closed");
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
    const baseUrl = this.config.environment === "sandbox" ? SDK_URL : SDK_URL;

    const params = new URLSearchParams();
    params.append("authKey", this.config.apiKey);

    if (this.config.apiSecret) {
      params.append("authSecret", this.config.apiSecret);
    }

    if (this.config.sessionId) {
      params.append("sessionId", this.config.sessionId);
    }

    if (this.config.theme) {
      params.append("theme", JSON.stringify(this.config.theme));
    }

    if (this.config.phoneNumber) {
      params.append("phoneNumber", this.config.phoneNumber);
    }

    return `${baseUrl}?${params.toString()}`;
  }

  public openEligibilityCheck(mode: "popup"): void {
    if (mode === "popup") {
      window.open(
        this.iframeUrl,
        "_blank",
        "width=500,height=700,scrollbars=yes"
      );

      // const checkLoaded = setInterval(() => {
      //   try {
      //     if (!popupWindow) return;

      //     // Send data securely via postMessage
      //     popupWindow?.postMessage(
      //       {
      //         type: "SDK_INIT",
      //         config: {
      //           apiKey: this.config.apiKey,
      //           apiSecret: this.config.apiSecret,
      //           partnerId: this.config.partnerId,
      //           sessionId: this.config.sessionId,
      //           userId: this.config.userId,
      //           theme: this.config.theme,
      //         },
      //       },
      //       new URL(this.iframeUrl).origin
      //     );

      //     clearInterval(checkLoaded);
      //   } catch (e) {
      //     // Window not ready yet or closed
      //     if (popupWindow?.closed) {
      //       clearInterval(checkLoaded);
      //       throw new Error("Popup window was closed");
      //     }
      //   }
      // }, 100);

      return;
    }

    this.iframe = document.createElement("iframe");
    this.iframe.src = this.iframeUrl;
    this.iframe.style.position = "fixed";
    this.iframe.style.top = "0";
    this.iframe.style.left = "0";
    this.iframe.style.width = "40";
    this.iframe.style.height = "70%";
    this.iframe.style.border = "none";
    this.iframe.style.zIndex = "9999";
    this.iframe.style.backgroundColor = "transparent";
    this.iframe.setAttribute("allow", "clipboard-write");

    document.body.appendChild(this.iframe);
    document.body.style.overflow = "scroll";

    // Notify partner that iframe is loading
    this.emitEvent("initiated");
  }

  public closeFrame(): void {
    if (!this.iframe) return;

    document.body.removeChild(this.iframe);
    document.body.style.overflow = "";
    this.iframe = undefined;
    this.emitEvent("closed");
  }

  public on(event: SDKEvent, handler: EventHandler): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)?.add(handler);
  }

  public off(event: SDKEvent, handler: EventHandler): void {
    this.eventHandlers.get(event)?.delete(handler);
  }

  public sendData(data: Record<string, unknown>): void {
    if (!this.iframe || !this.iframe.contentWindow) {
      throw new Error("Eligibility check iframe not open");
    }

    this.iframe.contentWindow.postMessage(
      {
        type: "USER_DATA_UPDATE",
        data,
        metadata: {
          partnerId: this.config.partnerId,
          // sessionToken: this.sessionToken,
        },
      },
      "*"
    ); // In production, specify exact origin
  }

  private emitEvent(event: SDKEvent, data?: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach((handler) => handler(data));
    }
  }
}

export default LoanEligibilitySDK;

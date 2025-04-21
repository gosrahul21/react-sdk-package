import {
  PartnerConfig,
  EligibilityResult,
  SDKEvent,
  EventHandler,
  SDKError,
} from "./types";

class LoanEligibilitySDK {
  private config: PartnerConfig;
  private iframe?: HTMLIFrameElement;
  private eventHandlers: Map<SDKEvent, Set<EventHandler>> = new Map();
  private iframeUrl: string;
  private sessionToken: string = "";
  private static instance: LoanEligibilitySDK | null = null;

  constructor(config: PartnerConfig) {
    this.config = config;
    this.iframeUrl = this.generateIframeUrl();
    this.validateConfig();
    this.generateSessionToken();
    this.setupMessageListener();
  }

  public static initialize(config: PartnerConfig): LoanEligibilitySDK {
    if (this.instance) {
      console.warn("SDK already initialized. Returning existing instance.");
      return this.instance;
    }

    this.instance = new LoanEligibilitySDK(config);
    return this.instance;
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
    // https://provider.com/sdk/eligibility-check?partnerId=your_partner_id&sessionToken=
    const baseUrl =
      this.config.environment === "sandbox"
        ? "http://localhost:5173"
        : "http://localhost:5173";

    const params = new URLSearchParams();
    params.append("partnerId", this.config.partnerId);
    // params.append("sessionToken", this.sessionToken);

    if (this.config.userId) {
      params.append("userId", this.config.userId);
    }

    if (this.config.theme) {
      params.append("theme", JSON.stringify(this.config.theme));
    }
    return `${baseUrl}?${params.toString()}`;
  }

  public openEligibilityCheck(mode: "iframe" | "popup"): void {
    if (mode === "popup") {
      window.open(
        this.iframeUrl,
        "_blank",
        "width=500,height=700,scrollbars=yes"
      );
      return;
    }

    if (this.iframe) {
      console.warn("Eligibility check is already open");
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

type WSEventHandler = (data: unknown) => void;

interface WSOptions {
  url: string;
  onOpen?: () => void;
  onClose?: () => void;
  onError?: (error: Event) => void;
  reconnect?: boolean;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export class WebSocketClient {
  private ws: WebSocket | null = null;
  private url: string;
  private handlers: Map<string, WSEventHandler[]> = new Map();
  private reconnect: boolean;
  private reconnectInterval: number;
  private maxReconnectAttempts: number;
  private reconnectAttempts: number = 0;
  private onOpen?: () => void;
  private onClose?: () => void;
  private onError?: (error: Event) => void;
  private heartbeatInterval: ReturnType<typeof setInterval> | null = null;

  constructor(options: WSOptions) {
    this.url = options.url;
    this.onOpen = options.onOpen;
    this.onClose = options.onClose;
    this.onError = options.onError;
    this.reconnect = options.reconnect ?? true;
    this.reconnectInterval = options.reconnectInterval ?? 3000;
    this.maxReconnectAttempts = options.maxReconnectAttempts ?? 5;
  }

  connect(): void {
    try {
      this.ws = new WebSocket(this.url);

      this.ws.onopen = () => {
        console.log("[WS] Connected");
        this.reconnectAttempts = 0;
        this.startHeartbeat();
        this.onOpen?.();
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          const type = message.type;
          const eventHandlers = this.handlers.get(type);
          if (eventHandlers) {
            eventHandlers.forEach((handler) => handler(message.data));
          }
          // Also trigger wildcard handlers
          const wildcardHandlers = this.handlers.get("*");
          if (wildcardHandlers) {
            wildcardHandlers.forEach((handler) => handler(message));
          }
        } catch (e) {
          console.error("[WS] Failed to parse message:", e);
        }
      };

      this.ws.onclose = () => {
        console.log("[WS] Disconnected");
        this.stopHeartbeat();
        this.onClose?.();
        this.attemptReconnect();
      };

      this.ws.onerror = (error) => {
        console.error("[WS] Error:", error);
        this.onError?.(error);
      };
    } catch (error) {
      console.error("[WS] Connection failed:", error);
      this.attemptReconnect();
    }
  }

  disconnect(): void {
    this.reconnect = false;
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  send(type: string, data: unknown): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, data }));
    } else {
      console.warn("[WS] Cannot send, connection not open");
    }
  }

  sendControl(action: string): void {
    this.send("control", { action });
  }

  on(event: string, handler: WSEventHandler): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, []);
    }
    this.handlers.get(event)!.push(handler);
  }

  off(event: string, handler: WSEventHandler): void {
    const eventHandlers = this.handlers.get(event);
    if (eventHandlers) {
      const index = eventHandlers.indexOf(handler);
      if (index > -1) {
        eventHandlers.splice(index, 1);
      }
    }
  }

  get isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN;
  }

  private attemptReconnect(): void {
    if (!this.reconnect) return;
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error("[WS] Max reconnect attempts reached");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `[WS] Reconnecting... attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts}`
    );

    setTimeout(() => {
      this.connect();
    }, this.reconnectInterval);
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000);
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }
}

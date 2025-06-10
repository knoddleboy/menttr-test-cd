import { refresh } from "@/services/auth/refresh";
import { io, Socket } from "socket.io-client";

interface QueuedMessage<T = unknown> {
  event: string;
  data: T;
}

export class SocketService {
  private socket: Socket;
  private messageQueue: QueuedMessage[] = [];
  private isRefreshing = false;

  constructor(url: string) {
    this.socket = io(url, {
      withCredentials: true,
      autoConnect: false,
    });

    this.setupListeners();
  }

  public sendMessage<T = unknown>(event: string, data: T) {
    if (this.socket.connected) {
      this.socket.emit(event, data);
    } else {
      this.messageQueue.push({ event, data });
    }
  }

  public connect() {
    return this.socket.connect();
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public on(event: string, callback: (...args: any[]) => void) {
    this.socket.on(event, callback);
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    this.socket.off(event, callback);
  }

  private setupListeners() {
    this.socket.on("connect", () => {
      this.flushQueue();
    });

    this.socket.on("disconnect", (reason) => {});

    this.socket.on("unauthorized", () => {
      this.handleTokenRefresh();
    });
  }

  private flushQueue() {
    while (this.messageQueue.length > 0) {
      const { event, data } = this.messageQueue.shift()!;
      this.socket.emit(event, data);
    }
  }

  private async handleTokenRefresh() {
    if (this.isRefreshing) return;

    this.isRefreshing = true;

    try {
      await refresh();
      this.socket.disconnect();
      this.socket.connect();
    } catch {
      this.messageQueue = [];
    } finally {
      this.isRefreshing = false;
    }
  }
}

const URL = "http://localhost:3000";

export default new SocketService(URL);

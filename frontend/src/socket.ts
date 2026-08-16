type MessageHandler = (event: MessageEvent) => void;

class SocketManager {
  private socket: WebSocket | null = null;
  private listeners = new Set<MessageHandler>();
  private pendingMessages: object[] = [];

  connect() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) return;
    if (this.socket && this.socket.readyState === WebSocket.CONNECTING) return;

    this.socket = new WebSocket("ws://localhost:8080");

    this.socket.onopen = () => {
      while (this.pendingMessages.length > 0) {
        const message = this.pendingMessages.shift();
        this.socket?.send(JSON.stringify(message));
      }
    };

    this.socket.onmessage = (event) => {
      this.listeners.forEach((listener) => listener(event));
    };
  }

  subscribe(callback: MessageHandler) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  send(data: object) {
    this.connect();

    if (!this.socket) return;

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
      return;
    }

    this.pendingMessages.push(data);
  }

  close() {
    this.socket?.close();
    this.socket = null;
    this.listeners.clear();
    this.pendingMessages = [];
  }
}

const socketManager = new SocketManager();

export default socketManager;
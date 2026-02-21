import { io } from "socket.io-client";

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
  }

  connect(token) {
    if (this.socket?.connected) {
      return this.socket;
    }

    const mode = import.meta.env.MODE;
    const serverUrl =
      mode === "development"
        ? "http://localhost:8000"
        : "https://api.shopydash.com";

    this.socket = io(serverUrl, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    this.setupEventListeners();
    return this.socket;
  }

  setupEventListeners() {
    this.socket.on("connect", () => {
      console.log("Socket connected");
      this.connected = true;
    });

    this.socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      this.connected = false;
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error.message);

      if (error.message.includes("Authentication")) {
        console.error("Socket authentication failed");
      }
    });

    this.socket.on("error", (data) => {
      console.error("Socket error:", data.message);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
    }
  }

  joinConversation(conversationId) {
    if (this.socket?.connected) {
      this.socket.emit("join_conversation", { conversationId });
    }
  }

  sendMessage(conversationId, content) {
    if (this.socket?.connected) {
      this.socket.emit("send_message", { conversationId, content });
    }
  }

  onNewMessage(callback) {
    if (this.socket) {
      this.socket.on("new_message", callback);
    }
  }

  offNewMessage(callback) {
    if (this.socket) {
      this.socket.off("new_message", callback);
    }
  }

  cleanup() {
    if (this.socket) {
      this.socket.removeAllListeners();
    }
  }
}

export const socketService = new SocketService();

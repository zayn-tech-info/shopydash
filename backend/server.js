const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const http = require("http");
const cron = require("node-cron");
const https = require("https");
const { Server } = require("socket.io");
const DOMPurify = require("isomorphic-dompurify");

const validateEnv = require("./utils/validateEnv");
const app = require("./app");
const socketAuthMiddleware = require("./middleware/socketAuth");
const Message = require("./models/message.model");
const Conversation = require("./models/conversation.model");
const { logError, logInfo } = require("./utils/logger");

validateEnv();

const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      "https://shopydash-v1.vercel.app",
      "https://app.shopydash.com",
      "https://shopydash.com",
      "https://www.shopydash.com",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.set("io", io);

io.use(socketAuthMiddleware);

class SocketRateLimiter {
  constructor() {
    this.limits = new Map();
  }

  check(userId, limit = 30, windowMs = 60000) {
    const now = Date.now();
    const userLimit = this.limits.get(userId) || {
      count: 0,
      resetTime: now + windowMs,
    };

    if (now > userLimit.resetTime) {
      userLimit.count = 0;
      userLimit.resetTime = now + windowMs;
    }

    if (userLimit.count >= limit) {
      return false;
    }

    userLimit.count++;
    this.limits.set(userId, userLimit);
    return true;
  }

  cleanup() {
    const now = Date.now();
    for (const [userId, limit] of this.limits.entries()) {
      if (now > limit.resetTime) {
        this.limits.delete(userId);
      }
    }
  }
}

const messageRateLimiter = new SocketRateLimiter();

setInterval(() => messageRateLimiter.cleanup(), 5 * 60 * 1000);

io.on("connection", (socket) => {
  logInfo("Socket", `User connected: ${socket.userId}`);

  socket.join(`user:${socket.userId}`);

  socket.on("join_user_room", (userId) => {
    if (userId && userId === socket.userId) {
      socket.join(userId);
      logInfo("Socket", `User ${userId} joined their personal room`);
    }
  });

  socket.on("join_chat", async (conversationId) => {
    try {
      if (!conversationId) return;

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        socket.emit("error", { message: "Conversation not found" });
        return;
      }

      const isParticipant = conversation.participants.some(
        (p) => p.toString() === socket.userId
      );

      if (!isParticipant) {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      socket.join(conversationId);
      logInfo(
        "Socket",
        `User ${socket.userId} joined chat room ${conversationId}`
      );
    } catch (error) {
      logError("Socket", `Error joining chat: ${error.message}`);
      socket.emit("error", { message: "Failed to join chat" });
    }
  });

  socket.on("send_message", async (data) => {
    try {
      const { conversationId, content } = data;
      const userId = socket.userId;

      if (!messageRateLimiter.check(userId, 30, 60000)) {
        socket.emit("error", {
          message: "Rate limit exceeded. Please slow down.",
        });
        return;
      }

      if (!conversationId || !content) {
        socket.emit("error", { message: "Invalid message data" });
        return;
      }

      const conversation = await Conversation.findById(conversationId);
      if (!conversation) {
        socket.emit("error", { message: "Conversation not found" });
        return;
      }

      const isParticipant = conversation.participants.some(
        (p) => p.toString() === userId
      );

      if (!isParticipant) {
        socket.emit("error", { message: "Unauthorized" });
        return;
      }

      const sanitizedContent = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [],
        KEEP_CONTENT: true,
      });

      if (sanitizedContent.length > 2000) {
        socket.emit("error", { message: "Message too long" });
        return;
      }

      if (sanitizedContent.trim().length === 0) {
        socket.emit("error", { message: "Message cannot be empty" });
        return;
      }

      const message = await Message.create({
        conversationId,
        sender: userId,
        content: sanitizedContent,
      });

      await message.populate("sender", "fullName profilePic");

      await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        updatedAt: new Date(),
      });

      io.to(conversationId).emit("receive_message", message);

      logInfo("Socket", `Message sent in conversation ${conversationId}`);
    } catch (error) {
      logError("Socket", `Error sending message: ${error.message}`);
      socket.emit("error", { message: "Failed to send message" });
    }
  });

  socket.on("typing", ({ conversationId, userId, userName }) => {
    socket.to(conversationId).emit("typing", { userId, userName });
  });

  socket.on("stop_typing", ({ conversationId, userId }) => {
    socket.to(conversationId).emit("stop_typing", { userId });
  });

  socket.on("disconnect", () => {
    logInfo("Socket", `User disconnected: ${socket.userId}`);
  });
});

// Cron job to ping the server every 5 minutes to avoid Render spin-down
cron.schedule("*/5 * * * *", () => {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) {
    console.log("BACKEND_URL not set, skipping self-ping.");
    return;
  }

  const protocol = backendUrl.startsWith("https") ? https : http;

  protocol
    .get(`${backendUrl}/health`, (res) => {
      // console.log(`Self-ping status: ${res.statusCode}`);
    })
    .on("error", (err) => {
      console.error(`Self-ping failed: ${err.message}`);
    });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

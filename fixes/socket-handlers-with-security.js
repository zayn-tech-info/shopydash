/**
 * Socket.IO Event Handlers with Security Fixes
 * Apply these patterns to backend/server.js
 */

const { logError, logInfo } = require("./utils/logger");
const Message = require("./models/message.model");
const Conversation = require("./models/conversation.model");
const DOMPurify = require('isomorphic-dompurify');

/**
 * Rate limiter for socket events
 */
class SocketRateLimiter {
  constructor() {
    this.limits = new Map();
  }

  check(userId, limit = 30, windowMs = 60000) {
    const now = Date.now();
    const userLimit = this.limits.get(userId) || { count: 0, resetTime: now + windowMs };

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

// Cleanup rate limiter every 5 minutes
setInterval(() => messageRateLimiter.cleanup(), 5 * 60 * 1000);

/**
 * FIX: Socket.IO event handlers with error handling and rate limiting
 * Usage in server.js after authentication middleware:
 */
const setupSocketHandlers = (io) => {
  io.on("connection", (socket) => {
    logInfo("Socket", `User connected: ${socket.userId}`);

    // Join user's personal room
    socket.join(`user:${socket.userId}`);

    /**
     * Join conversation room
     */
    socket.on("join_conversation", async (data) => {
      try {
        const { conversationId } = data;

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        const isParticipant = conversation.participants.some(
          p => p.toString() === socket.userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        socket.join(`conversation:${conversationId}`);
        logInfo("Socket", `User ${socket.userId} joined conversation ${conversationId}`);
      } catch (error) {
        logError("Socket", `Error joining conversation: ${error.message}`);
        socket.emit("error", { message: "Failed to join conversation" });
      }
    });

    /**
     * Send message with rate limiting and sanitization
     */
    socket.on("send_message", async (data) => {
      try {
        const { conversationId, content } = data;
        const userId = socket.userId;

        // Rate limiting
        if (!messageRateLimiter.check(userId, 30, 60000)) {
          socket.emit("error", { message: "Rate limit exceeded. Please slow down." });
          return;
        }

        // Validate inputs
        if (!conversationId || !content) {
          socket.emit("error", { message: "Invalid message data" });
          return;
        }

        // Verify user is participant
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
          socket.emit("error", { message: "Conversation not found" });
          return;
        }

        const isParticipant = conversation.participants.some(
          p => p.toString() === userId
        );

        if (!isParticipant) {
          socket.emit("error", { message: "Unauthorized" });
          return;
        }

        // Sanitize content
        const sanitizedContent = DOMPurify.sanitize(content, {
          ALLOWED_TAGS: [],
          KEEP_CONTENT: true
        });

        if (sanitizedContent.length > 2000) {
          socket.emit("error", { message: "Message too long" });
          return;
        }

        if (sanitizedContent.trim().length === 0) {
          socket.emit("error", { message: "Message cannot be empty" });
          return;
        }

        // Create message
        const message = await Message.create({
          conversation: conversationId,
          sender: userId,
          content: sanitizedContent,
        });

        await message.populate('sender', 'fullName profilePic');

        // Update conversation
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: {
            content: sanitizedContent,
            sender: userId,
            createdAt: message.createdAt,
          },
          updatedAt: new Date(),
        });

        // Emit to conversation room
        io.to(`conversation:${conversationId}`).emit("new_message", {
          message: message.toObject(),
        });

        logInfo("Socket", `Message sent in conversation ${conversationId}`);
      } catch (error) {
        logError("Socket", `Error sending message: ${error.message}`);
        socket.emit("error", { message: "Failed to send message" });
      }
    });

    /**
     * Typing indicator with debouncing
     */
    socket.on("typing_start", async (data) => {
      try {
        const { conversationId } = data;
        
        // Verify participation
        const conversation = await Conversation.findById(conversationId);
        if (!conversation) return;

        const isParticipant = conversation.participants.some(
          p => p.toString() === socket.userId
        );

        if (!isParticipant) return;

        // Emit to others in conversation
        socket.to(`conversation:${conversationId}`).emit("user_typing", {
          userId: socket.userId,
          conversationId,
        });
      } catch (error) {
        logError("Socket", `Error in typing indicator: ${error.message}`);
      }
    });

    socket.on("typing_stop", async (data) => {
      try {
        const { conversationId } = data;
        socket.to(`conversation:${conversationId}`).emit("user_stopped_typing", {
          userId: socket.userId,
          conversationId,
        });
      } catch (error) {
        logError("Socket", `Error in typing indicator: ${error.message}`);
      }
    });

    /**
     * Mark messages as read
     */
    socket.on("mark_read", async (data) => {
      try {
        const { conversationId } = data;
        
        await Message.updateMany(
          {
            conversation: conversationId,
            sender: { $ne: socket.userId },
            isRead: false,
          },
          { isRead: true }
        );

        socket.to(`conversation:${conversationId}`).emit("messages_read", {
          conversationId,
          readBy: socket.userId,
        });
      } catch (error) {
        logError("Socket", `Error marking messages as read: ${error.message}`);
      }
    });

    /**
     * Disconnect handler
     */
    socket.on("disconnect", () => {
      logInfo("Socket", `User disconnected: ${socket.userId}`);
    });
  });
};

module.exports = setupSocketHandlers;

/**
 * Route Configuration with Rate Limiting
 * File: backend/routes/message.route.js
 */

const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { protect } = require("../middleware/auth");
const {
  sendMessage,
  getMessages,
  getConversations,
  createConversation,
} = require("../controllers/message.controller");

// Rate limiter for messaging endpoints
const messageRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    message: "Too many messages sent. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const conversationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

// All routes require authentication
router.use(protect);

// Conversation routes
router.post("/conversations", conversationRateLimiter, createConversation);
router.get("/conversations", conversationRateLimiter, getConversations);

// Message routes
router.post("/send", messageRateLimiter, sendMessage);
router.get("/conversations/:conversationId/messages", conversationRateLimiter, getMessages);

module.exports = router;

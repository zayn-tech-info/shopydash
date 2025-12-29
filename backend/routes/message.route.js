const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const messageController = require("../controllers/message.controller");
const { protectRoute } = require("../middleware/auth.middleware");

// Rate limiter for messaging endpoints
const messageRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    status: "error",
    message: "Too many messages sent. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const conversationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Protect all routes
router.use(protectRoute);

// Check if user has access to message a specific recipient
// This is used when clicking "Message Vendor"
router.post(
  "/check-access",
  conversationRateLimiter,
  messageController.checkMessagingAccess,
  messageController.initiateOrGetConversation
);

// Get all conversations for the user
router.get("/", conversationRateLimiter, messageController.getConversations);

// Get available vendors for new chat
router.get("/available-vendors", conversationRateLimiter, messageController.getAvailableVendorsForChat);

// Get messages for a specific conversation
router.get("/:conversationId", conversationRateLimiter, messageController.getMessages);

// Send a message
router.post("/", messageRateLimiter, messageController.sendMessage);

module.exports = router;

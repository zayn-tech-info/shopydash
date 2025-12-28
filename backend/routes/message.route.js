const express = require("express");
const router = express.Router();
const messageController = require("../controllers/message.controller");
const { protectRoute } = require("../middleware/auth.middleware");

// Protect all routes
router.use(protectRoute);

// Check if user has access to message a specific recipient
// This is used when clicking "Message Vendor"
router.post(
  "/check-access",
  messageController.checkMessagingAccess,
  messageController.initiateOrGetConversation
);

// Get all conversations for the user
router.get("/", messageController.getConversations);

// Get available vendors for new chat
router.get("/available-vendors", messageController.getAvailableVendorsForChat);

// Get messages for a specific conversation
router.get("/:conversationId", messageController.getMessages);

// Send a message
router.post("/", messageController.sendMessage);

module.exports = router;

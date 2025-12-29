const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const messageController = require("../controllers/message.controller");
const { protectRoute } = require("../middleware/auth.middleware");


const messageRateLimiter = rateLimit({
  windowMs: 60 * 1000, 
  max: 30, 
  message: {
    status: "error",
    message: "Too many messages sent. Please slow down.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const conversationRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: {
    status: "error",
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});


router.use(protectRoute);



router.post(
  "/check-access",
  conversationRateLimiter,
  messageController.checkMessagingAccess,
  messageController.initiateOrGetConversation
);


router.get("/", conversationRateLimiter, messageController.getConversations);


router.get("/available-vendors", conversationRateLimiter, messageController.getAvailableVendorsForChat);


router.get("/:conversationId", conversationRateLimiter, messageController.getMessages);


router.post("/", messageRateLimiter, messageController.sendMessage);

module.exports = router;

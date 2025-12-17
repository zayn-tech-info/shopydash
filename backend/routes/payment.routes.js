const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { protectRoute } = require("../middleware/auth.middleware");

// Initialize payment (protected)
router.post("/initialize", protectRoute, paymentController.initializePayment);

// Webhook (public, verified by signature)
router.post("/webhook", paymentController.webhook);

module.exports = router;

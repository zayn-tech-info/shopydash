const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { protectRoute } = require("../middleware/auth.middleware");

router.post("/initialize", protectRoute, paymentController.initializePayment);

router.post("/webhook", paymentController.webhook);

router.get("/verify", protectRoute, paymentController.verifyPayment);

module.exports = router;

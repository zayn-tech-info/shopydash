const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/payment.controller");
const { protectRoute } = require("../middleware/auth.middleware");

router.post("/initialize", protectRoute, paymentController.initializePayment);

router.post("/webhook", paymentController.webhook);

router.get("/verify", protectRoute, paymentController.verifyPayment);

router.post("/subaccount", protectRoute, paymentController.createSubaccount);
router.post(
  "/initialize-order",
  protectRoute,
  paymentController.initializeOrderPayment
);

router.get("/banks", protectRoute, paymentController.getBanks);
router.get(
  "/resolve-account",
  protectRoute,
  paymentController.resolveAccountNumber
);

module.exports = router;

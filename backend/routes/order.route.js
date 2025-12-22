const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const { protectRoute } = require("../middleware/auth.middleware");

router.get("/", protectRoute, orderController.getMyOrders);
router.put(
  "/:orderId/deliver",
  protectRoute,
  orderController.markOrderDelivered
);

module.exports = router;

const express = require("express");

const {
  addToCart,
  getCart,
  updateCartItemQuantity,
  removeFromCart,
} = require("../controllers/cart/cart.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add", protectRoute, addToCart);
router.get("/", protectRoute, getCart);
router.patch("/update", protectRoute, updateCartItemQuantity);
router.post("/remove", protectRoute, removeFromCart);

module.exports = router;

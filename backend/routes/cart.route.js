const express = require("express");

const { addToCart, getCart } = require("../controllers/cart/cart.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const router = express.Router();

router.post("/add", protectRoute, addToCart);
router.get("/", protectRoute, getCart);

module.exports = router;

const express = require("express");

const {
  add,
  get,
  remove,
  updateItemQuantity,
} = require("../controllers/cart/cart.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const cartRouter = express.Router();

cartRouter
  .route("/")
  .post(protectRoute, add)
  .get(protectRoute, get)
  .patch(protectRoute, updateItemQuantity)
  .delete(protectRoute, remove);

module.exports = cartRouter;

const express = require("express");

const {
  add,
  get,
  remove,
  updateItemQuantity,
  clear,
} = require("../controllers/cart/cart.controller");
const { protectRoute } = require("../middleware/auth.middleware");

const cartRouter = express.Router();
cartRouter.delete("/clear", protectRoute, clear);

cartRouter
  .route("/")
  .post(protectRoute, add)
  .get(protectRoute, get)
  .patch(protectRoute, updateItemQuantity)
  .delete(protectRoute, remove);

module.exports = cartRouter;

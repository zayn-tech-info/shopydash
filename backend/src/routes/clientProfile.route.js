const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  create,
  update,
} = require("../controllers/client/clientProfile.controller");

const clientProfileRouter = express.Router();

clientProfileRouter
  .route("/")
  .post(protectRoute, verifyRole("client"), create)
  .patch(protectRoute, verifyRole("client"), update);

module.exports = clientProfileRouter;

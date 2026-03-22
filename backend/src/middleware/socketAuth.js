const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const { logError } = require("../utils/logger");

const socketAuthMiddleware = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication failed"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(new Error("Authentication failed"));
    }

    socket.userId = user._id.toString();
    socket.user = user;

    next();
  } catch (error) {
    logError("SocketAuth", `Authentication failed: ${error.message}`);
    next(new Error(`Authentication failed: ${error.message}`));
  }
};

module.exports = socketAuthMiddleware;

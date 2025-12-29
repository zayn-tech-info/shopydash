/**
 * Socket.IO Authentication Middleware
 */

const jwt = require("jsonwebtoken");
const User = require("../models/auth.model");
const { logError } = require("../utils/logger");

/**
 * Middleware to authenticate Socket.IO connections using JWT
 * Usage in server.js:
 * 
 * const socketAuthMiddleware = require('./middleware/socketAuth');
 * io.use(socketAuthMiddleware);
 */
const socketAuthMiddleware = async (socket, next) => {
  try {
    // Get token from handshake auth
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Authentication token required'));
    }

    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Fetch user from database
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return next(new Error('User not found'));
    }

    // Attach user info to socket
    socket.userId = user._id.toString();
    socket.user = user;
    
    next();
  } catch (error) {
    logError('SocketAuth', `Authentication failed: ${error.message}`);
    next(new Error('Authentication failed'));
  }
};

module.exports = socketAuthMiddleware;

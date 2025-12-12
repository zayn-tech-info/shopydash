/**
 * Simple in-memory rate limiter
 * For production, consider using Redis-backed rate limiting
 */
const customError = require("../errors/customError");

const requestCounts = new Map();

// Clean up old entries every 15 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > 15 * 60 * 1000) {
      requestCounts.delete(key);
    }
  }
}, 15 * 60 * 1000);

/**
 * Rate limiter middleware factory
 * @param {number} maxRequests - Maximum number of requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @param {string} message - Custom error message
 */
const createRateLimiter = (
  maxRequests = 100,
  windowMs = 15 * 60 * 1000,
  message = "Too many requests, please try again later"
) => {
  return (req, res, next) => {
    // Use more generous limits in development
    const limit =
      process.env.NODE_ENV === "development" ? maxRequests * 10 : maxRequests;

    const identifier = req.ip || req.connection.remoteAddress || "unknown";
    const now = Date.now();

    if (!requestCounts.has(identifier)) {
      requestCounts.set(identifier, {
        count: 1,
        resetTime: now + windowMs,
      });
      return next();
    }

    const userData = requestCounts.get(identifier);

    if (now > userData.resetTime) {
      // Reset window
      userData.count = 1;
      userData.resetTime = now + windowMs;
      return next();
    }

    if (userData.count >= limit) {
      const err = new customError(message, 429);
      return next(err);
    }

    userData.count++;
    next();
  };
};

module.exports = createRateLimiter;

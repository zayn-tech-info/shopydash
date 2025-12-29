
const customError = require("../errors/customError");

const requestCounts = new Map();


setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.resetTime > 15 * 60 * 1000) {
      requestCounts.delete(key);
    }
  }
}, 15 * 60 * 1000);


const createRateLimiter = (
  maxRequests = 100,
  windowMs = 15 * 60 * 1000,
  message = "Too many requests, please try again later"
) => {
  return (req, res, next) => {
    
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

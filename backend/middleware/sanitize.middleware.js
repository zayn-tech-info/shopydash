const { sanitizeObject } = require("../utils/sanitize");

/**
 * Middleware to sanitize all request inputs (body, query, params)
 * Helps prevent NoSQL injection attacks
 */
const sanitizeInputs = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  if (req.params) {
    req.params = sanitizeObject(req.params);
  }

  next();
};

module.exports = sanitizeInputs;

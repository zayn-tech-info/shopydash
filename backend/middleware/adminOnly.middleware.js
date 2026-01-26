const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");

/**
 * Middleware to ensure only admin users can perform certain actions
 * This provides an extra layer of protection for sensitive operations
 */
const adminOnly = asyncErrorHandler(async (req, res, next) => {
  // Check if user is authenticated
  if (!req.user) {
    const error = new customError(
      "You must be logged in to perform this action",
      401,
    );
    return next(error);
  }

  // Check if user has admin role
  if (req.user.role !== "admin") {
    const error = new customError(
      "Access denied. Only administrators can perform this action.",
      403,
    );
    return next(error);
  }

  // Optional: Add specific admin email check for extra security
  // Uncomment and replace with your admin email
  // const ADMIN_EMAILS = ["your-admin@example.com"];
  // if (!ADMIN_EMAILS.includes(req.user.email)) {
  //   const error = new customError(
  //     "Access denied. You are not authorized for this action.",
  //     403
  //   );
  //   return next(error);
  // }

  next();
});

/**
 * Middleware to require specific admin email (strongest protection)
 * Use this for the most sensitive operations
 */
const requireSpecificAdmin = (allowedEmails) => {
  return asyncErrorHandler(async (req, res, next) => {
    if (!req.user) {
      const error = new customError("Authentication required", 401);
      return next(error);
    }

    if (req.user.role !== "admin") {
      const error = new customError("Admin access required", 403);
      return next(error);
    }

    if (!allowedEmails.includes(req.user.email)) {
      const error = new customError(
        "You are not authorized to perform this action",
        403,
      );
      return next(error);
    }

    next();
  });
};

module.exports = { adminOnly, requireSpecificAdmin };

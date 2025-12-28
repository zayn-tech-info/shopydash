const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const globalErrorHandler = require("./errors/globalError.controller");
const customError = require("./errors/customError");
const sanitizeInputs = require("./middleware/sanitize.middleware");
const securityHeaders = require("./middleware/security.middleware");
const csrfProtection = require("./middleware/csrf.middleware");

const authRouter = require("./routes/auth.route");
const vendorProfile = require("./routes/vendorProfle.route");
const clientProfileRouter = require("./routes/clientProfile.route");
const profileRouter = require("./routes/profile.route");
const vendorPost = require("./routes/vendorPost.route");
const cartRouter = require("./routes/cart.route");
const locationRouter = require("./routes/location.route");
const paymentRouter = require("./routes/payment.routes");
const orderRouter = require("./routes/order.route");
const reviewRouter = require("./routes/review.route");
const messageRouter = require("./routes/message.route");

connectDB();
const app = express();

const mode = process.env.NODE_ENV || "development";

const frontendOrigin =
  mode === "development"
    ? "http://localhost:5173"
    : "https://vendora-app-rho.vercel.app";

app.use(
  cors({
    origin: frontendOrigin,
    credentials: true,
  })
);

// Add security headers
app.use(securityHeaders);

app.use(cookieParser());

app.use(express.json());

// CSRF protection for state-changing requests
app.use(csrfProtection);

// Sanitize all inputs to prevent NoSQL injection
app.use(sanitizeInputs);

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vendorProfile", vendorProfile);
app.use("/api/v1/clientProfile", clientProfileRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/post", vendorPost);
app.use("/api/v1/cart", cartRouter);
app.use("/api/v1/locations", locationRouter);
app.use("/api/v1/payment", paymentRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/reviews", reviewRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.all(/(.*)/, (req, res, next) => {
  const err = new customError(
    `Could not find ${req.originalUrl} on the server`
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;

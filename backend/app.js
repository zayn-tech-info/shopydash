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
const notificationRouter = require("./routes/notification.route");

connectDB();
const app = express();

app.set("trust proxy", 1);

const mode = process.env.NODE_ENV || "development";
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "https://app.shopydash.com",
  "https://shopydash.com",
  "https://www.shopydash.com",
  "https://shopydash-v1.vercel.app",
];

 
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, X-XSRF-TOKEN",
  );

  // Handle preflight OPTIONS requests immediately
  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  next();
});

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use(securityHeaders);
app.use(cookieParser());
app.use(express.json());
app.use(csrfProtection);
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
app.use("/api/v1/notifications", notificationRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

app.all(/(.*)/, (req, res, next) => {
  const err = new customError(
    `Could not find ${req.originalUrl} on the server`,
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;

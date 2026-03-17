const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./src/config/db");
const globalErrorHandler = require("./src/errors/globalError.controller");
const customError = require("./src/errors/customError");
const sanitizeInputs = require("./src/middleware/sanitize.middleware");
const securityHeaders = require("./src/middleware/security.middleware");
const csrfProtection = require("./src/middleware/csrf.middleware");

const authRouter = require("./src/routes/auth.route");
const vendorProfile = require("./src/routes/vendorProfle.route");
const clientProfileRouter = require("./src/routes/clientProfile.route");
const profileRouter = require("./src/routes/profile.route");
const vendorPost = require("./src/routes/vendorPost.route");
const cartRouter = require("./src/routes/cart.route");
const locationRouter = require("./src/routes/location.route");
const paymentRouter = require("./src/routes/payment.routes");
const orderRouter = require("./src/routes/order.route");
const reviewRouter = require("./src/routes/review.route");
const messageRouter = require("./src/routes/message.route");
const notificationRouter = require("./src/routes/notification.route");
const adminRouter = require("./src/routes/admin.route");
const shareRouter = require("./src/routes/share.route");
const { protectRoute } = require("./src/middleware/auth.middleware");
const { adminOnly } = require("./src/middleware/adminOnly.middleware");

connectDB();
const app = express();

app.set("trust proxy", 1);

const mode = process.env.NODE_ENV || "development";
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:5175",
  "https://app.shopydash.com",
  "https://admin.shopydash.com",
  "https://shopydash.com",
  "https://www.shopydash.com",
  "https://shopydash-v1.vercel.app",
  "https://admin.shopydash.com",
  "https://healthy-director.outray.app",
];

// Pattern for Vercel preview deployments
const vercelPattern = /^https:\/\/.*\.vercel\.app$/;

const corsOptions = {
  origin: (origin, callback) => {
    if (
      !origin ||
      allowedOrigins.includes(origin) ||
      vercelPattern.test(origin || "")
    ) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Origin",
    "Accept",
    "X-XSRF-TOKEN",
  ],
};
app.use(cors(corsOptions));
app.options(/(.*)/, cors(corsOptions));

app.use(securityHeaders);
app.use(cookieParser());
app.use(express.json());
app.use("/p", shareRouter);
app.use("/share", shareRouter);
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
app.use("/api/v1/admin", protectRoute, adminOnly, adminRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Dev-only: trigger buyer match job for testing (404 in production)
if (process.env.NODE_ENV !== "production") {
  app.get("/api/v1/test/buyer-match-job", (req, res) => {
    const { runBuyerMatchJob } = require("./src/jobs/buyerMatchJob");
    const io = req.app.get("io");
    runBuyerMatchJob(io)
      .then(() =>
        res.status(200).json({ success: true, message: "Buyer match job completed" })
      )
      .catch((err) =>
        res.status(500).json({ success: false, message: err.message })
      );
  });
}

app.all(/(.*)/, (req, res, next) => {
  const err = new customError(
    `Could not find ${req.originalUrl} on the server`,
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;

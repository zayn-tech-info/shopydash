const express = require("express");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");
const globalErrorHandler = require("./errors/globalError.controller");
const customError = require("./errors/customError");

const authRouter = require("./routes/auth.route");
const vendorProfile = require("./routes/vendorProfle.route");
const clientProfile = require("./routes/clientProfile.route");
const profile = require("./routes/profile.route");
const vendorPost = require("./routes/vendorPost.route");
const cartRouter = require("./routes/cart.route");

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

app.use(cookieParser());

app.use(express.json());
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/vendorProfile", vendorProfile);
app.use("/api/v1/clientProfile", clientProfile);
app.use("/api/v1/profile", profile);
app.use("/api/v1/post", vendorPost);
app.use("/api/v1/cart", cartRouter);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.all(/(.*)/, (req, res, next) => {
  const err = new customError(
    `Could not find ${req.originalUrl} on the server`
  );
  next(err);
});

app.use(globalErrorHandler);

module.exports = app;

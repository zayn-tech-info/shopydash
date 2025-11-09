const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/db");

const authRouter = require("./routes/auth.route");
const vendorProfile = require("./routes/vendorProfle.route");
const clientProfile = require("./routes/clientProfile.route");

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

module.exports = app;

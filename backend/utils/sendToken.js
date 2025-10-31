const sendToken = (user, message, res, statusCode) => {
  const token =
    typeof user.generateToken === "function" ? user.generateToken() : null;

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    sameSite: isProduction ? "none" : "lax",
  });

  res.status(statusCode).json({
    success: true,
    token,
    message,
    data: {
      user,
    },
  });
};

module.exports = sendToken;

const sendToken = (user, message, res, statusCode, hasProfile = undefined) => {
  const token =
    typeof user.generateToken === "function" ? user.generateToken() : null;

  const isProduction = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    sameSite: isProduction ? "none" : "lax",
  });

  const userData = user.toObject ? user.toObject() : { ...user };
  if (hasProfile !== undefined) {
    userData.hasProfile = hasProfile;
  }

  res.status(statusCode).json({
    success: true,
    token,
    message,
    data: {
      user: userData,
    },
  });
};

module.exports = sendToken;

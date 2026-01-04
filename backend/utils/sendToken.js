const sendToken = (
  user,
  message,
  res,
  statusCode,
  hasProfile = undefined,
  additionalData = {}
) => {
  const token =
    typeof user.generateToken === "function" ? user.generateToken() : null;

  const isProduction = process.env.NODE_ENV === "production";

  const cookieOptions = {
    httpOnly: true,
    secure: isProduction,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: isProduction ? "none" : "lax",
  };

  // Set domain for production to allow cookie sharing across subdomains
  if (isProduction) {
    cookieOptions.domain = ".shopydash.com";
  }

  res.cookie("token", token, cookieOptions);

  const userData = user.toObject ? user.toObject() : { ...user };
  if (hasProfile !== undefined) {
    userData.hasProfile = hasProfile;
  }

  Object.assign(userData, additionalData);

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

const securityHeaders = (req, res, next) => {
  res.setHeader("X-Frame-Options", "DENY");

  res.setHeader("X-Content-Type-Options", "nosniff");

  res.setHeader("X-XSS-Protection", "1; mode=block");

  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data: blob:; script-src 'self' https: 'unsafe-inline' 'unsafe-eval'; style-src 'self' https: 'unsafe-inline'; font-src 'self' https: data:; connect-src 'self' https: wss:;",
  );

  next();
};

module.exports = securityHeaders;

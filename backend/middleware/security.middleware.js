
const securityHeaders = (req, res, next) => {
  
  res.setHeader("X-Frame-Options", "DENY");

  
  res.setHeader("X-Content-Type-Options", "nosniff");

  
  res.setHeader("X-XSS-Protection", "1; mode=block");

  
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");

  
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; img-src 'self' https: data:; script-src 'self'"
  );

  next();
};

module.exports = securityHeaders;

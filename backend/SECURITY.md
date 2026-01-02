# Security Best Practices & Considerations

## Overview
This document outlines the security measures implemented in the Shopydash backend and important considerations for deployment.

## Authentication & Authorization

### JWT Implementation
- JWT tokens expire after 7 days
- Tokens are stored in httpOnly cookies (production: secure + sameSite=none, development: sameSite=lax)
- JWT_SECRET_KEY must be at least 32 characters (validated on startup)
- Password changes invalidate existing tokens via `passwordChangedAt` timestamp check

### Password Security
- Minimum 8 characters
- Must contain: uppercase, lowercase, number, and special character
- Hashed using bcrypt with salt factor of 10
- Pre-save hook ensures automatic hashing on password modification

### Role-Based Access Control
- Three roles: client, vendor, admin
- `protectRoute` middleware validates JWT and loads user
- `verifyRole` middleware checks user role against allowed roles

## Input Validation & Sanitization

### NoSQL Injection Prevention
- All request inputs (body, query, params) are sanitized via `sanitize.middleware.js`
- Keys starting with `$` are filtered out
- Special characters `${}` are removed from strings
- Nested objects and arrays are recursively sanitized

### XSS Protection
- Security headers middleware sets X-XSS-Protection
- Content-Security-Policy restricts resource loading
- Input sanitization removes dangerous characters
- Mongoose schema validation for all fields

### CSRF Protection
- Custom CSRF middleware validates origin/referer headers
- Requires `X-Requested-With` header or `application/json` content-type
- Safe methods (GET, HEAD, OPTIONS) are exempt
- Origin validation against allowed list

## Data Protection

### Sensitive Data Handling
- Error messages don't expose sensitive details in production
- Stack traces only shown in development mode
- Generic error messages for authentication failures (prevents user enumeration)
- Production error responses exclude error.message for non-operational errors

### Environment Variables
- Required variables validated on startup (see .env.example)
- JWT_SECRET_KEY strength validated (minimum 32 characters)
- Database connection string stored securely
- Cloudinary and Paystack keys protected

## Rate Limiting

### Implementation
- In-memory rate limiter (consider Redis for production scaling)
- Default: 100 requests per 15-minute window
- Development mode: 10x more generous limits
- Automatic cleanup of old entries every 15 minutes
- IP-based tracking

## Payment Security

### Paystack Integration
- Webhook signature validation using HMAC SHA-512
- Test keys for development, production keys for live
- Transaction reference uniqueness enforced
- Payment verification before releasing funds

### Order & Payment Flow
1. Payment initialized with Paystack
2. Transaction record created with "pending" status
3. Webhook validates signature and updates status
4. Funds held until delivery confirmed
5. Payout released only after buyer confirms delivery

## Database Security

### Connection Security
- Connection pooling (min: 2, max: 10)
- Socket timeout: 45 seconds
- Server selection timeout: 10 seconds
- IPv4 family enforcement

### Indexes for Performance
- User lookups: email, username, schoolId
- Order queries: buyer, vendor, transactionReference
- Product searches: school, area, state, text search
- Compound indexes for common query patterns

## Security Headers

### Implemented Headers
- `X-Frame-Options: DENY` - Prevents clickjacking
- `X-Content-Type-Options: nosniff` - Prevents MIME sniffing
- `X-XSS-Protection: 1; mode=block` - Browser XSS protection
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Content-Security-Policy` - Restricts resource loading

## Business Logic Security

### Cart Operations
- Users cannot add own products to cart
- Quantity limits: 1-100 per item
- Total quantity per product limited to 100
- Negative quantities rejected

### Review System
- Only buyers can review orders
- Only delivered orders can be reviewed
- One review per order (enforced by unique index)
- Vendors cannot review their own stores
- Rating must be 1-5

### Vendor Operations
- Subscription-based limits enforced
- Post frequency limits (12-hour windows)
- Products per post limits
- Authorization checks for edit/delete operations

## Deployment Checklist

### Pre-Deployment
- [ ] Set strong JWT_SECRET_KEY (32+ characters)
- [ ] Update CORS origin to production URL
- [ ] Set NODE_ENV=production
- [ ] Use production Paystack keys
- [ ] Configure production database connection
- [ ] Set up Redis for rate limiting (recommended)
- [ ] Enable database backups
- [ ] Set up monitoring and alerts
- [ ] Review and update allowed origins in CSRF middleware

### Post-Deployment
- [ ] Verify HTTPS is enforced
- [ ] Test payment webhooks
- [ ] Monitor error logs
- [ ] Check rate limiting effectiveness
- [ ] Verify CORS configuration
- [ ] Test authentication flows
- [ ] Monitor database performance

## Known Limitations

### Areas for Improvement
1. **Rate Limiting**: In-memory store doesn't scale across multiple servers
   - Recommendation: Implement Redis-backed rate limiting for production

2. **Review Rating Calculation**: Potential race condition with concurrent reviews
   - Recommendation: Use atomic updates or database transactions

3. **Logging**: Basic console logging
   - Recommendation: Implement structured logging with Winston/Pino

4. **Session Management**: No active session revocation
   - Recommendation: Implement session store with Redis

5. **File Upload**: Limited validation on file types/sizes
   - Recommendation: Add comprehensive file validation

## Incident Response

### Security Breach Protocol
1. Immediately rotate JWT_SECRET_KEY
2. Force logout all users
3. Review access logs
4. Notify affected users
5. Patch vulnerability
6. Document incident

### Monitoring Recommendations
- Track failed login attempts
- Monitor unusual payment patterns
- Alert on database errors
- Track API response times
- Monitor rate limit hits

## Regular Security Maintenance

### Monthly Tasks
- Review access logs for suspicious activity
- Update dependencies (check for security patches)
- Review and rotate API keys
- Audit user permissions

### Quarterly Tasks
- Security audit of new features
- Review and update security policies
- Penetration testing
- Database backup verification

## Contact & Reporting

For security concerns or vulnerability reports, please contact the development team immediately.

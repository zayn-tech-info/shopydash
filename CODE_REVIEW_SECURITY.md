# Shopydash - Security Code Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** Backend security implementation

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 3 |
| High | 4 |
| Medium | 5 |
| Low | 4 |

**Overall Security Score: 5.9/10**

---

## Critical Issues

### 1. CSRF Protection Bypass Vulnerability

**File:** `backend/middleware/csrf.middleware.js:15-31`
**Severity:** CRITICAL

The CSRF protection can be bypassed by simply including `Content-Type: application/json` header or `X-Requested-With: XMLHttpRequest`:

```javascript
const hasCustomHeader =
  req.get("X-Requested-With") === "XMLHttpRequest" ||
  req.get("Content-Type")?.includes("application/json");

if (!hasCustomHeader && origin) { ... }  // Bypassed if headers present!
```

**Impact:** An attacker can craft malicious requests with these headers from any origin. While CORS blocks browser requests, this doesn't protect against:
- Non-browser HTTP clients
- CORS misconfigurations
- Browser plugins/extensions

**Recommendation:** Implement proper CSRF tokens using double-submit cookie pattern or synchronizer tokens.

---

### 2. JWT Secret Key Mismatch

**Files:**
- `backend/middleware/auth.middleware.js:30`
- `backend/middleware/socketAuth.js:18`

**Severity:** CRITICAL

Two different environment variable names are used for the JWT secret:

```javascript
// auth.middleware.js
jwt.verify(token, process.env.JWT_SECRET_KEY)

// socketAuth.js
jwt.verify(token, process.env.JWT_SECRET)
```

**Impact:** If only one environment variable is set:
- Socket.IO authentication will fail silently
- Tokens from REST API won't validate in Socket.IO or vice versa
- Users may appear authenticated via API but fail to connect to chat

**Recommendation:** Standardize to a single environment variable name (`JWT_SECRET_KEY`) across all files.

---

### 3. Weak Random ID Generation for Payments

**File:** `backend/controllers/payment.controller.js:404-411`
**Severity:** CRITICAL

The custom `nanoid` function uses `Math.random()` which is cryptographically insecure:

```javascript
function nanoid(length) {
  let result = "";
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}
```

**Impact:**
- Transaction references could be predictable
- Potential for reference collision attacks
- Transaction manipulation possibilities

**Recommendation:** Use `crypto.randomBytes()` or the actual `nanoid` npm package:

```javascript
const { randomBytes } = require('crypto');
function secureId(length) {
  return randomBytes(length).toString('base64url').slice(0, length);
}
```

---

## High Priority Issues

### 4. Origin Validation Uses Partial Match

**File:** `backend/middleware/csrf.middleware.js:20-21`
**Severity:** HIGH

```javascript
const isValidOrigin = allowedOrigins.some((allowed) =>
  origin?.startsWith(allowed)
);
```

**Impact:** `startsWith` allows subdomain/prefix attacks:
- `http://localhost:5173.malicious.com` passes validation
- `https://shopydash.com.attacker.com` passes validation

**Recommendation:** Use exact match or proper URL parsing:

```javascript
const isValidOrigin = allowedOrigins.includes(origin);
// OR
const originHost = new URL(origin).origin;
const isValidOrigin = allowedOrigins.includes(originHost);
```

---

### 5. CORS Origin Mismatch Between Files

**Files:**
- `backend/app.js:31-34`
- `backend/server.js:23-27`

**Severity:** HIGH

Different allowed origins in Express CORS vs Socket.IO CORS:

```javascript
// app.js (Express)
const allowedOrigins = [
  "http://localhost:5173",
  "https://shopydash.com",
];

// server.js (Socket.IO)
cors: {
  origin: ["http://localhost:5173", "https://shopydash-v1.vercel.app"],
}
```

**Impact:**
- Production frontend at `shopydash.com` cannot connect to Socket.IO
- Frontend at `shopydash-v1.vercel.app` cannot make REST API calls
- Inconsistent security policy

**Recommendation:** Centralize CORS configuration in a shared config file.

---

### 6. No Token Refresh Mechanism

**File:** `backend/models/auth.model.js:241-252`
**Severity:** HIGH

```javascript
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }
  );
};
```

**Impact:**
- Users must re-login every 7 days
- No way to extend sessions without full re-authentication
- Encourages users to stay logged in longer than necessary
- No ability to revoke tokens before expiration

**Recommendation:** Implement refresh token rotation with short-lived access tokens (15min) and longer-lived refresh tokens (7d).

---

### 7. Password Hash Not Excluded from User Queries

**File:** `backend/middleware/auth.middleware.js:34`
**Severity:** HIGH

```javascript
const user = await User.findById(decodeToken.id);
// Password hash included in req.user for every authenticated request
req.user = user;
```

**Impact:**
- Password hash attached to every request object
- Increases exposure surface if `req.user` is logged or leaked
- Unnecessary data in memory

**Recommendation:** Exclude password from queries:

```javascript
const user = await User.findById(decodeToken.id).select('-password');
```

---

## Medium Priority Issues

### 8. Incomplete NoSQL Injection Prevention

**File:** `backend/utils/sanitize.js:11`
**Severity:** MEDIUM

```javascript
const sanitized = str.replace(/[${}]/g, "");
```

**Impact:**
- Only strips `$`, `{`, `}` from string values
- Keys starting with `$` are skipped (good)
- But nested objects could still contain operators
- `$where`, `$regex` operators could be injected via object structure

**Recommendation:** Use `mongo-sanitize` package or implement recursive key inspection:

```javascript
const mongoSanitize = require('mongo-sanitize');
req.body = mongoSanitize(req.body);
```

---

### 9. Rate Limiter Memory Leak Potential

**File:** `backend/middleware/rateLimiter.middleware.js:4-14`
**Severity:** MEDIUM

```javascript
const requestCounts = new Map();

setInterval(() => {
  // Cleanup runs every 15 minutes
}, 15 * 60 * 1000);
```

**Impact:**
- Map grows unbounded under high load
- DDoS attack could exhaust server memory
- No maximum size limit
- Cleanup interval too long (15 min)

**Recommendation:**
- Add maximum Map size with LRU eviction
- Use Redis for distributed rate limiting
- Reduce cleanup interval to 1-5 minutes

Or simply use `lru-cache` library

---

### 10. X-XSS-Protection Header is Deprecated

**File:** `backend/middleware/security.middleware.js:10`
**Severity:** MEDIUM

```javascript
res.setHeader("X-XSS-Protection", "1; mode=block");
```

**Impact:**
- Header is deprecated and ignored by modern browsers
- Can introduce vulnerabilities in older browsers (IE)
- False sense of security

**Recommendation:** Remove this header entirely; rely on Content-Security-Policy instead.

---

### 11. CSP Policy Issues

**File:** `backend/middleware/security.middleware.js:16-19`
**Severity:** MEDIUM

```javascript
res.setHeader(
  "Content-Security-Policy",
  "default-src 'self'; img-src 'self' https: data:; script-src 'self'"
);
```

**Issues:**
- Blocks inline styles (breaks React/MUI components)
- Blocks external fonts (Google Fonts, etc.)
- No `connect-src` for API calls to different domains
- No `style-src` directive
- May break Cloudinary image loading

**Recommendation:** Update CSP for SPA requirements:

```javascript
"default-src 'self'; " +
"script-src 'self'; " +
"style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
"font-src 'self' https://fonts.gstatic.com; " +
"img-src 'self' https: data: blob:; " +
"connect-src 'self' https://api.paystack.co https://res.cloudinary.com"
```

---

### 12. File Upload MIME Type Check Only

**File:** `backend/controllers/vendor/upload.controller.js:15-21`
**Severity:** MEDIUM

```javascript
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new customError("Not an image!", 400), false);
  }
};
```

**Impact:**
- MIME type can be spoofed by attacker
- Malicious files (executables, scripts) could be uploaded with image MIME type
- No magic byte validation

**Recommendation:** Add magic byte validation:

```javascript
const fileType = require('file-type');

const validateFile = async (buffer) => {
  const type = await fileType.fromBuffer(buffer);
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  return type && allowedTypes.includes(type.mime);
};
```

---

## Low Priority Issues

### 13. Hardcoded Test Secret Key Variable Name

**File:** `backend/controllers/payment.controller.js:12`
**Severity:** LOW

```javascript
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_TEST_SECRET_KEY;
```

**Impact:** Variable named `TEST_SECRET_KEY` may indicate test keys used in production.

**Recommendation:** Use environment-based key selection:

```javascript
const PAYSTACK_SECRET_KEY = process.env.NODE_ENV === 'production'
  ? process.env.PAYSTACK_LIVE_SECRET_KEY
  : process.env.PAYSTACK_TEST_SECRET_KEY;
```

---

### 14. Google OAuth Token Validation Inefficiency

**File:** `backend/controllers/auth/auth.controller.js:12-17`
**Severity:** LOW

```javascript
const response = await fetch(
  "https://www.googleapis.com/oauth2/v3/userinfo",
  { headers: { Authorization: `Bearer ${token}` } }
);
```

**Impact:**
- Extra network call on every Google login
- Dependency on Google API availability
- Slower authentication

**Recommendation:** Consider validating the JWT locally using Google's public keys (JWKS).

---

### 15. Socket Rate Limiter Not Persistent

**File:** `backend/server.js:34-68`
**Severity:** LOW

```javascript
class SocketRateLimiter {
  constructor() {
    this.limits = new Map();
  }
}
```

**Impact:**
- Rate limits not shared across server instances
- In multi-server deployment, user can bypass limits by hitting different servers
- Server restart clears all rate limit data

**Recommendation:** Use Redis-based rate limiting for production deployments.

---

### 16. Password Change Validation Timing

**File:** `backend/controllers/auth/auth.controller.js:375-376`
**Severity:** LOW

```javascript
user.password = newPassword;
await user.save();
```

**Impact:**
- While `save()` runs validators, no explicit pre-check
- Error occurs after password is assigned to object
- Minor: validation still happens, just at save time

**Recommendation:** Explicitly validate before assignment for clearer error handling.

---

## Security Score Breakdown

| Category | Score | Notes |
|----------|-------|-------|
| CSRF Protection | 3/10 | Bypassable with headers |
| XSS Prevention | 7/10 | Good DOMPurify usage in Socket.IO, CSP needs work |
| NoSQL Injection | 6/10 | Basic sanitization present, could be stronger |
| Rate Limiting | 6/10 | Present but memory-based, no bounds |
| Password Security | 8/10 | bcrypt with salt, complexity rules enforced |
| JWT Security | 5/10 | Secret mismatch, no refresh, password included |
| Payment Security | 7/10 | Webhook HMAC validation good, weak random IDs |
| File Upload | 6/10 | MIME check only, no magic byte validation |
| CORS | 5/10 | Inconsistent between Express and Socket.IO |
| Security Headers | 6/10 | Present but CSP issues, deprecated header |

**Overall Security Score: 5.9/10**

---

## Recommended Priority for Fixes

### Immediate (Before Production)
1. Fix JWT secret key mismatch
2. Replace `Math.random()` in payment references
3. Fix CSRF bypass vulnerability

### Short-term
4. Fix origin validation (startsWith → exact match)
5. Synchronize CORS configuration
6. Exclude password from user queries

### Medium-term
7. Implement token refresh mechanism
8. Add magic byte validation for uploads
9. Fix CSP policy for SPA
10. Upgrade to Redis-based rate limiting

### Long-term
11. Implement proper CSRF token system
12. Add comprehensive security logging
13. Set up security monitoring/alerting

Consider using some library for authentication fe. `better-auth` it makes everything much easier and you can focus on your product's core logic.

Is good to have some background in authentication write the system at least one by hand and understand the concepts properly, but for next projects I would consider using some library. 
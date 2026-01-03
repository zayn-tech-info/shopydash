# Shopydash - Authentication & Authorization Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** JWT flow, role-based access, session management, auth middleware

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 3 |
| Medium | 5 |
| Low | 4 |

**Overall Auth Score: 6.0/10**

---

## Authentication Architecture

### Components

| Component | File | Purpose |
|-----------|------|---------|
| User Model | `models/auth.model.js` | User schema, password hashing, JWT generation |
| Auth Controller | `controllers/auth/auth.controller.js` | Login, signup, logout, password change |
| Auth Middleware | `middleware/auth.middleware.js` | Route protection, role verification |
| Socket Auth | `middleware/socketAuth.js` | Socket.IO authentication |
| Send Token | `utils/sendToken.js` | JWT cookie setting |

### Auth Flow

```
Login/Signup → generateToken() → sendToken() → Cookie + Response
     ↓
Protected Route → protectRoute → JWT Verify → req.user
     ↓
Role Check → verifyRole() → Allow/Deny
```

---

## High Priority Issues

### 1. No Token Refresh Mechanism

**Files:** `auth.model.js`, `sendToken.js`
**Severity:** HIGH

```javascript
// auth.model.js - Token generation
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET_KEY,
    { expiresIn: "7d" }  // Fixed 7-day expiration
  );
};
```

**Issues:**
- Single token with 7-day lifetime
- No refresh token implementation
- User must re-login after expiration
- No way to extend session without full re-auth
- Cannot revoke specific sessions

**Impact:**
- Poor UX (forced logout after 7 days)
- Security risk (long-lived tokens)
- No session management capability

**Recommendation:** Implement refresh token rotation:
- Access token: 15 minutes
- Refresh token: 7 days (stored in httpOnly cookie)
- Refresh endpoint to get new access token

---

### 2. JWT Secret Mismatch (Critical - from Security Review)

**Files:** `auth.middleware.js:30` vs `socketAuth.js:18`
**Severity:** HIGH (CRITICAL)

```javascript
// auth.middleware.js
jwt.verify(token, process.env.JWT_SECRET_KEY)

// socketAuth.js
jwt.verify(token, process.env.JWT_SECRET)  // Different env var!
```

**Impact:** Socket.IO authentication will fail if wrong env var is set.

---

### 3. Token Exposed in Response Body

**File:** `utils/sendToken.js:19-26`
**Severity:** HIGH

```javascript
res.status(statusCode).json({
  success: true,
  token,  // Token in response body!
  message,
  data: { user: userData },
});
```

**Issues:**
- Token sent both in cookie AND response body
- Response body tokens can be:
  - Logged by proxies/load balancers
  - Stored in browser history
  - Captured by browser extensions
  - Visible in network tab

**Recommendation:** Only use httpOnly cookies for token storage. Remove token from response body.

---

## Medium Priority Issues

### 4. Password Included in User Response

**File:** `utils/sendToken.js:14`
**Severity:** MEDIUM

```javascript
const userData = user.toObject ? user.toObject() : { ...user };
// userData contains password hash!
```

**Issue:** User object returned to client includes password hash.

**Recommendation:** Exclude password before sending:
```javascript
const { password, ...userData } = user.toObject();
```

---

### 5. Inconsistent Role Verification

**File:** `middleware/auth.middleware.js:63-65`
**Severity:** MEDIUM

```javascript
const userRole = req.user.role;
if (!allowedRoles.includes(userRole)) {
  const error = new customError("Access denied", 401);  // Should be 403
  return next(error);
}
```

**Issue:** Returns 401 (Unauthorized) instead of 403 (Forbidden) for role mismatch.

- 401 = "Who are you?" (authentication)
- 403 = "You can't do that" (authorization)

---

### 6. Google OAuth Token Not Validated Locally

**File:** `auth.controller.js:12-17`
**Severity:** MEDIUM

```javascript
const response = await fetch(
  "https://www.googleapis.com/oauth2/v3/userinfo",
  { headers: { Authorization: `Bearer ${token}` } }
);
```

**Issues:**
- Network call on every Google login
- No local JWT validation
- Dependency on Google API availability
- No token expiration check

**Recommendation:** Validate Google JWT locally using Google's public keys.

---

### 7. Duplicate protectRoute on Some Routes

**File:** `vendorPost.route.js:44`
**Severity:** MEDIUM

```javascript
vendorPostRouter.use(protectRoute);  // Applied to all routes below
// ...
vendorPostRouter
  .route("/:postId")
  .delete(protectRoute, verifyRole("vendor"), remove);  // Duplicate!
```

**Issue:** `protectRoute` called twice on delete route (via `.use()` and inline).

---

### 8. No Account Lockout After Failed Attempts

**Files:** `auth.controller.js`
**Severity:** MEDIUM

```javascript
const login = asyncErrorHandler(async (req, res, next) => {
  // No tracking of failed login attempts
  // No account lockout mechanism
});
```

**Issue:** No protection against brute-force attacks beyond rate limiting.

**Recommendation:** Implement:
- Track failed login attempts per user/IP
- Temporary lockout after X failures
- CAPTCHA after Y failures

---

## Low Priority Issues

### 9. Role Stored in JWT Payload

**File:** `auth.model.js:243-246`
**Severity:** LOW

```javascript
return jwt.sign(
  { id: this._id, role: this.role },  // Role in token
  process.env.JWT_SECRET_KEY,
  { expiresIn: "7d" }
);
```

**Issue:** If user's role changes, old tokens still have old role until expiration.

**Recommendation:** Always fetch current role from database (as currently done in `protectRoute`).

---

### 10. Public Profile Endpoint Exposes Sensitive Fields

**File:** `profile.controller.js:24-28`, `profile.controller.js:54-57`
**Severity:** LOW

```javascript
.populate(
  "userId",
  "businessName username email phoneNumber whatsAppNumber schoolName..."
)
```

**Issue:** Public profile endpoint exposes:
- Email address
- Phone number
- WhatsApp number

**Recommendation:** Create separate public/private profile views.

---

### 11. No Session ID in Token

**File:** `auth.model.js:241-252`
**Severity:** LOW

```javascript
return jwt.sign(
  { id: this._id, role: this.role },
  // No session ID
);
```

**Issue:** Cannot invalidate specific sessions. All tokens valid until expiration.

**Recommendation:** Add session ID to enable selective logout.

---

### 12. Cookie sameSite Setting

**File:** `utils/sendToken.js:11`
**Severity:** LOW

```javascript
sameSite: isProduction ? "none" : "lax",
```

**Issue:** `sameSite: "none"` in production allows cross-site requests (needed for cross-origin but reduces CSRF protection).

**Note:** This is acceptable if CORS is properly configured, but worth documenting.

---

## Authorization Matrix

### Route Protection Analysis

| Route | Auth Required | Role Check | Notes |
|-------|---------------|------------|-------|
| POST /auth/signup | ❌ | ❌ | Public |
| POST /auth/login | ❌ | ❌ | Public |
| GET /auth/check | ✅ | ❌ | Any authenticated |
| POST /cart | ✅ | ❌ | Any authenticated |
| POST /vendorProfile | ✅ | vendor | ✅ Correct |
| GET /vendorProfile/store/:id | ❌ | ❌ | Public store view |
| POST /post | ✅ | vendor | ✅ Correct |
| GET /post/feed | ❌ | ❌ | Public feed |
| GET /post/:id | ✅* | ❌ | *Requires auth after .use() |
| POST /reviews | ✅ | ❌ | Any authenticated |
| POST /payment/initialize | ✅ | ❌ | Any authenticated |
| POST /payment/webhook | ❌ | ❌ | Paystack webhook |
| GET /messages | ✅ | ❌ | Any authenticated |
| POST /clientProfile | ✅ | client | ✅ Correct |

### Issues Found

1. **GET /post/:postId** - Requires auth (via `.use(protectRoute)`) but should be public for product viewing
2. **Webhook endpoint** - No authentication (correct for Paystack, but relies on signature validation)

---

## Password Security Review

### Strengths ✅
- bcrypt with salt factor 10
- Password complexity requirements (upper, lower, number, special char)
- Minimum 8 characters
- Password change invalidates old tokens (via `passwordChangedAt`)

### Weaknesses ⚠️ [LOW PRIORITY]
- No password history (can reuse old passwords)
- No breach detection (haveibeenpwned integration)
- No password expiration policy

---

## Recommendations Summary

### Immediate
1. Fix JWT secret mismatch (`JWT_SECRET_KEY` vs `JWT_SECRET`)
2. Remove token from response body (keep only in cookie)
3. Exclude password from user response

### Short-term
4. Fix 401 → 403 for role verification errors
5. Fix GET /post/:postId to be public
6. Remove duplicate protectRoute calls

### Medium-term
7. Implement refresh token rotation
8. Add account lockout after failed attempts
9. Add session management (session IDs)

### Long-term
10. Implement OAuth token local validation
11. Add password breach detection
12. Consider adding 2FA support

---

## Token Lifecycle Recommendation

```
Current:
[Access Token: 7 days] ────────────────────────────► Expiry → Re-login

Recommended:
[Access: 15min] → [Refresh] → [Access: 15min] → [Refresh] → ...
                      ↑                              ↑
                 Refresh Token (7 days, rotates on use)
```

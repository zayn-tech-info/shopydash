# Shopydash - Code Quality & Patterns Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** Code consistency, DRY violations, naming, anti-patterns, dead code

---

## Executive Summary

| Severity | Count |
|----------|-------|
| Critical | 1 |
| High | 2 |
| Medium | 6 |
| Low | 7 |

**Overall Code Quality Score: 5.8/10**

---

## Critical Issues

### 1. Hardcoded Database Credentials in Source Code

**File:** `backend/rename.db.js:4`
**Severity:** CRITICAL

```javascript
const client = new MongoClient("mongodb+srv://zayn_shopydash_db:UcEIDMua33vVgbYb@cluster0.lymnjws.mongodb.net/?appName=Cluster0");
```

**Impact:**
- Database credentials exposed in version control
- Anyone with repo access has full database access
- Credentials cannot be rotated without code change

**Recommendation:**
1. **IMMEDIATELY** rotate the database credentials
2. Delete this file or move credentials to environment variables
3. Add to `.gitignore` any utility scripts with credentials
4. Use `git filter-branch` or BFG to remove from git history

---

## High Priority Issues

### 2. Typo in HTTP Header (Auth Failing)

**File:** `backend/fetch_banks.js:11`
**Severity:** HIGH

```javascript
headers: {
  Authorizatio: `Bearer ${paystackSecretKey}`,  // Missing 'n'!
}
```

**Impact:** API requests will fail silently due to missing authorization.

---

### 3. Typo in Route Filename

**File:** `backend/routes/vendorProfle.route.js`
**Severity:** HIGH

Filename is `vendorProfle.route.js` - missing 'i' in "Profile".

**Impact:**
- Confusing for developers
- IDE autocomplete may fail
- Import statements look incorrect

**Recommendation:** Rename to `vendorProfile.route.js` and update imports.

---

## Medium Priority Issues

### 4. Excessive Console Logging in Frontend

**Files:** 60+ locations in `frontend/app/src/`
**Severity:** MEDIUM

```javascript
// Examples found:
console.log(res);                    // cartStore.js:28
console.log(res);                    // orderStore.js:15
console.log(profileData);           // CreateVendorProfile.jsx:28
console.error("Login error:", err); // authStore.js:37
```

**Count:** 60+ console statements in production code

**Impact:**
- Cluttered browser console
- Potential data leakage
- Performance impact
- Unprofessional appearance

**Recommendation:** Use proper logging library or remove before production.

---

### 5. Unused Imports

**Files:** Multiple
**Severity:** MEDIUM

```javascript
// order.controller.js:3
const { paystackRequest } = require("./payment.controller");
// Never used in file

// vendorProfile.model.js:2
const validator = require("validator");
// Never used in file
```

---

### 6. Inconsistent File Naming Conventions

**Files:** Backend models
**Severity:** MEDIUM

```
auth.model.js          ✓ Consistent
cart.model.js          ✓ Consistent
vendorProduct.js       ✗ Missing ".model" suffix
vendorProfile.model.js ✓ Consistent
```

Also route files:
```
auth.route.js          ✓ route
payment.routes.js      ✗ routes (plural)
vendorProfle.route.js  ✗ typo
```

---

### 7. Inconsistent Export Patterns

**Files:** Multiple controllers
**Severity:** MEDIUM

```javascript
// Pattern 1: Named exports object
module.exports = {
  createPost,
  getMyPosts,
  getFeedPosts,
};

// Pattern 2: Direct exports
exports.checkMessagingAccess = asyncErrorHandler(...);
exports.initiateOrGetConversation = asyncErrorHandler(...);

// Pattern 3: Single default
module.exports = globalErrorHandler;
```

---

### 8. Dead/Utility Files in Source

**Files:** `backend/fetch_banks.js`, `backend/rename.db.js`
**Severity:** MEDIUM

These appear to be one-time utility scripts that should not be in production:
- `fetch_banks.js` - Debug script for Paystack bank codes
- `rename.db.js` - Database migration script with hardcoded credentials

**Recommendation:** Move to `/scripts` folder or remove entirely.

---

### 9. Duplicate Error Extraction Logic

**Files:** All stores
**Severity:** MEDIUM

Same error extraction pattern repeated ~15 times:

```javascript
const serverMessage =
  err?.response?.data?.message ||
  (typeof err?.response?.data === "string" ? err.response.data : null) ||
  err?.message ||
  "An unknown error occurred";
```

**Recommendation:** Create utility function:
```javascript
// utils/errorUtils.js
export const extractErrorMessage = (err, fallback = "An error occurred") => {
  return err?.response?.data?.message || err?.message || fallback;
};
```

---

## Low Priority Issues

### 10. Commented-Out Code

**File:** `backend/controllers/payment.controller.js`
**Severity:** LOW

```javascript
// console.log(req)
// console.log(`Self-ping status: ${res.statusCode}`);
```

**File:** `frontend/app/src/components/settings/PayoutSettings.jsx:69`
```javascript
//   console.error("Fetch Profile Error:", error);
```

---

### 11. Inconsistent Variable Naming

**Files:** Multiple
**Severity:** LOW

```javascript
// Typo in state variable
isLogginIn: false,  // Should be isLoggingIn

// Inconsistent casing
authUser    // camelCase
NODE_ENV    // SCREAMING_SNAKE_CASE (correct for env)
socketAuth  // camelCase file, but...
```

---

### 12. Magic Numbers/Strings

**Files:** Multiple
**Severity:** LOW

```javascript
// server.js:39
if (!messageRateLimiter.check(userId, 30, 60000))  // Magic numbers

// auth.model.js:209
bcrypt.genSalt(10)  // Magic number

// sendToken.js:10
maxAge: 7 * 24 * 60 * 60 * 1000  // Should be named constant
```

**Recommendation:**
```javascript
const RATE_LIMIT = { MAX_MESSAGES: 30, WINDOW_MS: 60000 };
const BCRYPT_SALT_ROUNDS = 10;
const TOKEN_MAX_AGE_DAYS = 7;
```

---

### 13. Inconsistent Async/Await Usage

**Files:** Multiple
**Severity:** LOW

```javascript
// Some use .then()
protocol.get(`${backendUrl}/health`, (res) => {...})

// Most use async/await
const user = await User.findById(userId);
```

---

### 14. Empty Catch Blocks

**File:** `frontend/app/src/store/productStore.js:36`
**Severity:** LOW

```javascript
} catch (error) {
  set({ isFetchingFeedPosts: false });
  console.error(error);
  // No user notification!
}
```

---

### 15. Long Functions

**File:** `backend/controllers/payment.controller.js`
**Severity:** LOW

The `handlePaystackWebhook` function is ~150 lines. Should be broken into smaller functions.

---

### 16. Unused Schema Field

**File:** `backend/models/cart.model.js:37-39`
**Severity:** LOW

```javascript
// cartItemSchema
hostelName: String,  // Never used in any controller
```

---

## Code Patterns Summary

### Good Patterns ✅

| Pattern | Usage |
|---------|-------|
| Async error handler wrapper | Consistent in most controllers |
| Zustand for state management | Well organized stores |
| DOMPurify for XSS prevention | Used in chat |
| Mongoose schema validation | Good validation rules |

### Anti-Patterns ⚠️

| Anti-Pattern | Locations |
|--------------|-----------|
| Credentials in code | rename.db.js |
| Console.log in production | 60+ locations |
| Dead code | fetch_banks.js, commented code |
| God functions | payment.controller.js webhook |
| Magic numbers | Multiple files |

---

## File Organization Issues

```
backend/
├── fetch_banks.js      ❌ Should be in /scripts
├── rename.db.js        ❌ Should be deleted (has credentials!)
├── routes/
│   ├── vendorProfle.route.js  ❌ Typo in filename
│   └── payment.routes.js      ⚠️ Inconsistent (routes vs route)
├── models/
│   └── vendorProduct.js       ⚠️ Missing .model suffix
```

---

## Recommendations Summary

### Immediate (Security)
1. **ROTATE DATABASE CREDENTIALS** - They are exposed in rename.db.js
2. Delete or secure utility scripts (rename.db.js, fetch_banks.js)
3. Fix Authorization header typo in fetch_banks.js

### Short-term
4. Rename `vendorProfle.route.js` to `vendorProfile.route.js`
5. Remove unused imports
6. Create error extraction utility function
7. Rename `vendorProduct.js` to `vendorProduct.model.js`

### Medium-term
8. Remove all console.log statements (use proper logger)
9. Standardize export patterns
10. Extract magic numbers to constants
11. Break up large functions (payment webhook)

### Long-term
12. Add ESLint/Prettier for consistent formatting
13. Add pre-commit hooks to catch issues
14. Consider TypeScript for type safety

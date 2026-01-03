# Shopydash - Error Handling Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** Error handling patterns, logging, error propagation

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 2 |
| Medium | 5 |
| Low | 4 |

**Overall Error Handling Score: 6.2/10**

---

## Architecture Overview

### Error Handling Components

| Component | File | Purpose |
|-----------|------|---------|
| customError | `errors/customError.js` | Custom error class with status codes |
| asyncErrorHandler | `errors/asyncErrorHandle.js` | Wrapper for async route handlers |
| globalErrorHandler | `errors/globalError.controller.js` | Express error middleware |
| logger | `utils/logger.js` | Logging utility (info, warn, error) |

### Error Flow

```
Controller → asyncErrorHandler → next(error) → globalErrorHandler → Response
     ↓
  Manual try/catch → inconsistent handling
```

---

## High Priority Issues

### 1. Inconsistent Error Handling Patterns

**Files:** Multiple controllers
**Severity:** HIGH

Three different patterns are used across controllers:

**Pattern 1: asyncErrorHandler (Recommended)**
```javascript
// cart.controller.js, vendorPost.controller.js
const get = asyncErrorHandler(async (req, res, next) => {
  // Errors automatically caught
});
```

**Pattern 2: Manual try-catch with next()**
```javascript
// review.controller.js
const createReview = async (req, res, next) => {
  try {
    // ...
  } catch (error) {
    next(error);  // Goes to global handler
  }
};
```

**Pattern 3: Manual try-catch with direct response**
```javascript
// order.controller.js, payment.controller.js
const markOrderDelivered = async (req, res) => {
  try {
    // ...
  } catch (error) {
    logError("Mark Order Delivered", error);
    res.status(500).json({
      message: "Could not update order",
      ...(process.env.NODE_ENV === "development" && { error: error.message }),
    });
  }
};
```

**Controllers by Pattern:**

| Pattern | Controllers | Issues |
|---------|-------------|--------|
| asyncErrorHandler | cart, vendorPost, message, clientProfile, auth (most) | ✅ Good |
| Manual try-catch + next() | review, vendorProfile (partial) | ⚠️ Verbose |
| Manual try-catch + direct response | order, payment | ❌ Bypasses global handler |

**Impact:**
- Inconsistent error response formats
- Some errors bypass global error handler
- Development error details exposed inconsistently

---

### 2. Silent Error Swallowing

**Files:** `middleware/subscription.middleware.js:30-33`, `utils/profileHelper.js:22-24`
**Severity:** HIGH

```javascript
// subscription.middleware.js
} catch (error) {
  console.error("Subscription Check Error", error);
  next();  // Silently continues even on DB error!
}

// profileHelper.js
} catch (error) {
  return false;  // Silently returns false on any error!
}
```

**Impact:**
- Database connection errors go unnoticed
- Users may see incorrect data (e.g., no subscription when DB failed)
- Difficult to debug production issues

**Recommendation:** At minimum, log errors properly. Consider if middleware should fail on errors.

---

## Medium Priority Issues

### 3. Development Error Details in Production Risk

**File:** `payment.controller.js` (multiple locations)
**Severity:** MEDIUM

```javascript
res.status(500).json({
  message: "Could not initialize payment",
  ...(process.env.NODE_ENV === "development" && { error: error.message }),
});
```

**Issue:** While this checks NODE_ENV, the global error handler does the same check. Having it in two places:
- Creates inconsistency if global handler is used
- Risk of copy-paste errors where check is forgotten

**Recommendation:** Let global error handler manage all error detail exposure.

---

### 4. Inconsistent Error Response Structure

**Files:** Multiple controllers
**Severity:** MEDIUM

Different error response formats:

```javascript
// globalError.controller.js (via customError)
{ status: 500, message: "..." }

// order.controller.js (manual)
{ message: "Could not update order" }

// payment.controller.js (manual)
{ message: "...", error: "..." }

// Some places
{ success: false, message: "..." }
```

**Recommendation:** Standardize on:
```javascript
{ success: false, message: "...", code?: "ERROR_CODE" }
```

---

### 5. CastError Handler Exposes Field Names

**File:** `globalError.controller.js:26-29`
**Severity:** MEDIUM

```javascript
const castErrorHandler = (err) => {
  const msg = `Invalid value ${err.path} for field ${err.value}`;
  return new customError(msg, 400);
};
```

**Issue:** Error message has inverted placeholders (path/value swapped) and exposes internal field names.

**Recommendation:**
```javascript
const msg = `Invalid value for ${err.path}`;  // Don't expose actual value
```

---

### 6. No Error Codes for Client Handling

**Files:** All error responses
**Severity:** MEDIUM

Errors only have messages, no machine-readable codes:

```javascript
new customError("User not found", 404);  // No error code
```

**Issue:** Frontend must parse error messages to determine error type.

**Recommendation:** Add error codes:
```javascript
class customError extends Error {
  constructor(message, statusCode, code) {
    super(message);
    this.code = code;  // e.g., "USER_NOT_FOUND"
  }
}
```

---

### 7. Missing JWT Error Handler

**File:** `globalError.controller.js`
**Severity:** MEDIUM

No specific handler for JWT errors:

```javascript
// Missing handlers for:
// - JsonWebTokenError (invalid token)
// - TokenExpiredError (expired token)
// - NotBeforeError (token not yet valid)
```

**Impact:** JWT errors return generic 500 instead of proper 401.

**Recommendation:**
```javascript
const jwtErrorHandler = () => new customError("Invalid or expired token", 401);
if (error.name === "JsonWebTokenError") error = jwtErrorHandler();
if (error.name === "TokenExpiredError") error = jwtErrorHandler();
```

---

## Low Priority Issues

### 8. Logger Doesn't Include Stack in Production

**File:** `utils/logger.js:16-26`
**Severity:** LOW

```javascript
if (NODE_ENV === "development") {
  // Shows stack trace
} else {
  // No stack trace in production
  console.error(JSON.stringify({
    timestamp,
    level: "error",
    context,
    message: errorMessage,
    // Missing: stack trace
  }));
}
```

**Issue:** Stack traces are valuable for debugging production errors.

**Recommendation:** Consider including stack in production logs (or send to error tracking service).

---

### 9. Inconsistent Logging Usage

**Files:** Multiple controllers
**Severity:** LOW

```javascript
// Some use logError
logError("Payment Initialization", error);

// Some use console.error
console.error("Subscription Check Error", error);

// Some don't log at all (via asyncErrorHandler)
```

**Recommendation:** Use `logError` consistently across all error handling.

---

### 10. No Request Context in Error Logs

**File:** `utils/logger.js`
**Severity:** LOW

Error logs don't include:
- Request ID
- User ID
- Request path
- Request method

**Impact:** Difficult to trace errors to specific requests.

**Recommendation:** Add request context to error logs.

---

### 11. ValidationError Handler in Dev Mode

**File:** `globalError.controller.js:52-54`
**Severity:** LOW

```javascript
if (process.env.NODE_ENV === "development") {
  if (error.name === "ValidationError") error = validationErrorHandler(error);
  devErrors(res, error);
}
```

**Issue:** ValidationError handler runs in dev mode but the result goes through `devErrors` which shows full error anyway. Redundant handling.

---

## Error Handling Matrix

| Controller | Pattern | Logging | Global Handler |
|------------|---------|---------|----------------|
| auth.controller.js | asyncErrorHandler | ❌ | ✅ |
| cart.controller.js | asyncErrorHandler | ❌ | ✅ |
| order.controller.js | Manual try-catch | ✅ logError | ❌ Direct response |
| payment.controller.js | Manual try-catch | ✅ logError | ❌ Direct response |
| review.controller.js | Manual try-catch | ❌ | ✅ via next() |
| message.controller.js | asyncErrorHandler | ❌ | ✅ |
| vendorPost.controller.js | asyncErrorHandler | ❌ | ✅ |
| vendorProfile.controller.js | Mixed | ❌ | ✅ (mostly) |
| clientProfile.controller.js | asyncErrorHandler | ❌ | ✅ |

---

## Recommendations Summary

### Immediate
1. Use `asyncErrorHandler` consistently in ALL controllers
2. Stop swallowing errors silently in middleware
3. Add JWT error handlers to global error handler

### Short-term
4. Standardize error response format
5. Add error codes for machine-readable error types
6. Use `logError` consistently instead of `console.error`

### Medium-term
7. Add request context to error logs
8. Consider adding error tracking service (Sentry, etc.)
9. Add request IDs for error tracing

### Long-term
10. Implement structured error catalog
11. Add error monitoring dashboards
12. Set up alerting for critical errors

---

## Error Response Format Recommendation

```javascript
// Success
{
  success: true,
  data: { ... },
  meta?: { pagination, etc. }
}

// Error
{
  success: false,
  error: {
    code: "VALIDATION_ERROR",    // Machine-readable
    message: "Human readable message",
    details?: [...]              // Validation errors array
  }
}
```

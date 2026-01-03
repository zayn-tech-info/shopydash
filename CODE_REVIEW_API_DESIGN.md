# Shopydash - API Design & Validation Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** API routes, controllers, validation, response formats

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 3 |
| Medium | 7 |no
| Low | 5 |

**Overall API Design Score: 6.5/10**

---

## High Priority Issues

### 1. Inconsistent Response Format

**Files:** Multiple controllers
**Severity:** HIGH

The API uses multiple inconsistent response formats:

```javascript
// Format 1: success + message + data
res.status(200).json({ success: true, message: "...", data: { ... } });

// Format 2: status + data
res.status(200).json({ status: "success", data: { ... } });

// Format 3: Just data
res.status(200).json({ cart });

// Format 4: success + count + data
res.status(200).json({ success: true, count: orders.length, data: orders });

// Format 5: results + data (message controller)
res.status(200).json({ status: "success", results: conversations.length, data: { ... } });
```

**Examples:**
- `cart.controller.js:27` - Returns `{ cart }` directly
- `cart.controller.js:130` - Returns `{ success: true, message: "...", cart: newCart }`
- `message.controller.js:104` - Returns `{ status: "success", data: { conversation } }`
- `order.controller.js:72` - Returns `{ success: true, count: orders.length, data: orders }`

**Impact:** Frontend must handle multiple response shapes, making error handling and data extraction inconsistent.

**Recommendation:** Standardize on a single response envelope:

```javascript
// Success response
{ success: true, data: { ... }, meta?: { pagination, count } }

// Error response
{ success: false, message: "...", code?: "ERROR_CODE" }
```

---

### 2. Missing Input Validation on Critical Endpoints

**Files:** Multiple controllers
**Severity:** HIGH

Several endpoints lack proper input validation:

**order.controller.js - No asyncErrorHandler:**
```javascript
const markOrderDelivered = async (req, res) => {
  try {
    const { orderId } = req.params;
    // No validation that orderId is a valid MongoDB ObjectId
```

**review.controller.js - No asyncErrorHandler:**
```javascript
const createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment, vendorId } = req.body;
    // No validation of vendorId/orderId format
```

**Missing validations across controllers:**
- No ObjectId format validation on path parameters
- No type coercion validation (e.g., `quantity` could be string)
- No max length validation on text fields (except messages)
- No validation schema library (like Joi, Zod, or express-validator)

**Impact:**
- Invalid ObjectIds cause unhandled CastError exceptions
- Type coercion bugs possible
- Potential for oversized payloads

**Recommendation:** Use a validation library like Zod or Joi at the route level.

---

### 3. Inconsistent Error Handling Patterns

**Files:** Multiple controllers
**Severity:** HIGH

Two different error handling patterns are used:

**Pattern 1: asyncErrorHandler wrapper (good)**
```javascript
// cart.controller.js
const get = asyncErrorHandler(async (req, res, next) => {
  // Errors automatically caught and passed to next()
});
```

**Pattern 2: Manual try-catch (inconsistent)**
```javascript
// order.controller.js
const markOrderDelivered = async (req, res) => {
  try {
    // ...
  } catch (error) {
    logError("Mark Order Delivered", error);
    res.status(500).json({ message: "Could not update order" });
  }
};
```

**Impact:**
- Inconsistent error response format
- Some errors return `{ message }`, others return `{ success: false, message }`
- Development error details exposed inconsistently

**Recommendation:** Use `asyncErrorHandler` consistently across all controllers.

---

## Medium Priority Issues

### 4. DELETE with Request Body

**File:** `cart.route.js:20`, `cart.controller.js:178`
**Severity:** MEDIUM

```javascript
// Route
cartRouter.delete("/", protectRoute, remove);

// Controller
const remove = asyncErrorHandler(async (req, res, next) => {
  const { productId } = req.body;  // Getting data from body in DELETE
```

**Impact:**
- DELETE requests with body are non-standard
- Some HTTP clients/proxies may strip body from DELETE requests
- Not RESTful

**Recommendation:** Use query parameters or path parameters for DELETE:
```javascript
// Better: DELETE /cart/:productId
// Or: DELETE /cart?productId=xxx
```

---

### 5. 204 Response with Body

**File:** `cart.controller.js:201`
**Severity:** MEDIUM

```javascript
res.status(204).json({ cart });
```

**Impact:** HTTP 204 (No Content) should not have a response body. The body will be ignored by compliant clients.

**Recommendation:** Either return 200 with body, or 204 without body.

---

### 6. Route Naming Inconsistencies

**Files:** Various route files
**Severity:** MEDIUM

```
/api/v1/vendorProfile  (singular)
/api/v1/clientProfile  (singular)
/api/v1/orders         (plural)
/api/v1/reviews        (plural)
/api/v1/messages       (plural)
/api/v1/post           (singular - should be /posts)
/api/v1/locations      (plural)
```

**Also:**
- File naming: `vendorProfle.route.js` (typo: missing 'i')
- Endpoint: `/api/v1/post/my-posts` (mixing singular/plural)

**Recommendation:** Use consistent plural nouns for all resources.

---

### 7. Mixed Authentication Middleware Placement

**File:** `vendorPost.route.js:28-44`
**Severity:** MEDIUM

```javascript
vendorPostRouter.get("/feed", getFeedPosts);           // No auth
vendorPostRouter.get("/search", searchPosts);          // No auth

vendorPostRouter.use(protectRoute);                    // Auth from here
vendorPostRouter.use(checkSubscription);
vendorPostRouter.get("/my-posts", verifyRole("vendor"), getMyPosts);

vendorPostRouter
  .route("/:postId")
  .get(getById)                                        // Uses auth (after .use)
  .patch(verifyRole("vendor"), update)
  .delete(protectRoute, verifyRole("vendor"), remove); // Duplicate protectRoute!
```

**Issues:**
- `/:postId` GET requires auth but shouldn't (public product viewing)
- `delete` has redundant `protectRoute` (already applied via `.use`)
- Middleware order is confusing

---

### 8. No Request Size Limits per Endpoint

**Files:** All controllers
**Severity:** MEDIUM

While there's a global `express.json()` parser, there are no endpoint-specific size limits for:
- Product creation (can have large arrays)
- Image URL arrays
- Message content (limited to 2000 chars in controller, but not at parse level)

**Recommendation:** Add payload size limits:
```javascript
app.use(express.json({ limit: '1mb' }));
// Or per-route limits for specific endpoints
```

---

### 9. Pagination Inconsistencies

**Files:** `vendorPost.controller.js`, `message.controller.js`
**Severity:** MEDIUM

Different pagination response formats:

```javascript
// vendorPost.controller.js
pagination: {
  currentPage,
  totalPages: Math.ceil(total / pageLimit),
  totalItems: total,
}

// message.controller.js
pagination: {
  page,
  limit,
  total,
  pages: Math.ceil(total / limit),
}
```

**Also:** Some endpoints don't return pagination metadata at all.

---

### 10. Query Parameter Type Coercion

**File:** `message.controller.js:217-218`
**Severity:** MEDIUM

```javascript
const page = req.query.page * 1 || 1;
const limit = Math.min(req.query.limit * 1 || 50, 100);
```

**Issues:**
- `* 1` coercion fails silently for non-numeric strings (returns NaN)
- `NaN || 1` defaults to 1, hiding invalid input
- No validation that page/limit are positive integers

**Recommendation:** Use explicit parsing with validation:
```javascript
const page = parseInt(req.query.page, 10);
if (isNaN(page) || page < 1) page = 1;
```

---

## Low Priority Issues

### 11. Verbose Error Messages Expose Internal Details

**File:** `globalError.controller.js:26-28`
**Severity:** LOW

```javascript
const castErrorHandler = (err) => {
  const msg = `Invalid value ${err.path} for field ${err.value}`;
  return new customError(msg, 400);
};
```

**Impact:** Exposes database field names to clients.

---

### 12. Inconsistent Use of .lean()

**Files:** Multiple controllers
**Severity:** LOW

Some queries use `.lean()` for performance, others don't:

```javascript
// With lean (good for read-only)
const posts = await VendorPost.find({ vendorId: userId }).lean();

// Without lean (returns full Mongoose documents)
const cart = await Cart.findOne({ userId });
```

**Recommendation:** Use `.lean()` consistently for read-only queries.

---

### 13. No API Versioning Strategy Beyond /v1

**File:** `app.js`
**Severity:** LOW

All routes are under `/api/v1/` but there's no documented versioning strategy or deprecation plan.

---

### 14. Unused Import

**File:** `order.controller.js:3`
**Severity:** LOW

```javascript
const { paystackRequest } = require("./payment.controller");
// Never used in the file
```

---

### 15. Duplicate Field Validation Logic

**Files:** `auth.controller.js`, `auth.model.js`
**Severity:** LOW

Password complexity is validated both in the model schema and implicitly assumed in controllers. Validation logic should be centralized.

---

## RESTful Conventions Audit

| Aspect | Status | Notes |
|--------|--------|-------|
| Resource naming | ⚠️ Mixed | Singular/plural inconsistent |
| HTTP verbs | ✅ Good | Proper use of GET/POST/PATCH/DELETE |
| Status codes | ⚠️ Issues | 204 with body, inconsistent codes |
| URL structure | ⚠️ Mixed | Some non-RESTful patterns |
| Query params | ✅ Good | Pagination, filtering present |
| Request body | ⚠️ Issue | DELETE with body |

---

## Validation Coverage by Controller

| Controller | Validation | Notes |
|------------|------------|-------|
| auth.controller.js | ⚠️ Partial | Basic required field checks |
| cart.controller.js | ✅ Good | Quantity bounds, required fields |
| order.controller.js | ❌ Poor | No asyncErrorHandler, minimal validation |
| review.controller.js | ⚠️ Partial | Rating bounds check, missing ObjectId validation |
| vendorPost.controller.js | ✅ Good | Product count limits, pagination bounds |
| message.controller.js | ✅ Good | Content sanitization, length limits |
| clientProfile.controller.js | ⚠️ Partial | Basic checks only |
| payment.controller.js | ⚠️ Partial | Some validation, missing ObjectId checks |

---

## Recommendations Summary

### Immediate
1. Standardize response envelope format across all controllers
2. Add ObjectId validation for all path parameters
3. Use `asyncErrorHandler` consistently
4. Fix DELETE with body to use query/path params

### Short-term
5. Fix 204 response with body
6. Implement validation library (Zod/Joi)
7. Standardize route naming (plural resources)
8. Fix middleware ordering in vendorPost routes

### Medium-term
9. Standardize pagination response format
10. Add request size limits per endpoint
11. Document API versioning strategy
12. Add OpenAPI/Swagger documentation

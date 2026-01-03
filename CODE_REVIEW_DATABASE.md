# Shopydash - Database Layer Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** MongoDB schemas, indexing, query patterns, data validation

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 4 |
| Medium | 6 |
| Low | 5 |

**Overall Database Design Score: 6.8/10**

---

## Schema Overview

### Models (13 total)

| Model | Purpose | Indexes | Relationships |
|-------|---------|---------|---------------|
| User (auth.model) | User accounts | role | - |
| VendorProfile | Vendor business profiles | businessCategory, isVerified, userId | User |
| ClientProfile | Client profiles | userId | User |
| VendorPost | Product listings | vendorId, school, area, state, text | User |
| Cart | Shopping carts | userId (unique) | User, VendorPost |
| Order | Customer orders | buyer, vendor, transactionReference, paymentStatus, deliveryStatus | User, VendorProfile |
| Review | Product reviews | reviewer, vendor, order (unique) | User, VendorProfile, Order |
| Message | Chat messages | conversationId, sender, isRead | Conversation, User |
| Conversation | Chat threads | participants, updatedAt | User, Message |
| Transaction | Payment records | user, reference (unique), status | User |
| Subscription | Vendor plans | user (unique), status, endDate | User |
| School | Educational institutions | name (unique) | - |
| SchoolArea | Campus locations | schoolName+name (unique) | School |

---

## High Priority Issues

### 1. Data Denormalization Without Sync Strategy

**Files:** `cart.model.js`, `order.model.js`
**Severity:** HIGH

Product data is copied into cart and order documents:

```javascript
// cart.model.js - copies product data
cart.items.push({
  productId,
  title: product.title,
  price: product.price,
  description: product.description,
  image: product.image,
  // ... copied fields
});

// order.model.js - also copies data
items: [{
  title: String,
  image: String,
  price: Number,
}]
```

**Issues:**
- If vendor updates product price/title/image, cart shows stale data
- No mechanism to sync denormalized data
- Price at cart time may differ from order time

**Impact:** Users could see outdated product info; price discrepancies possible.

**Recommendation:**
- For Cart: Fetch fresh product data on cart retrieval, only store productId
- For Order: Copying is correct (historical record), but should be explicit about "price at time of purchase"

---

### 2. Missing Index on VendorProfile.userId

**File:** `vendorProfile.model.js`
**Severity:** HIGH

```javascript
userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "User",
  required: true,
  // NO index!
}
```

However, many queries use this field:
```javascript
VendorProfile.findOne({ userId })  // Used frequently
```

**Impact:** Full collection scan on every vendor profile lookup by userId.

**Recommendation:** Add index:
```javascript
vendorProfileSchema.index({ userId: 1 }, { unique: true });
```

---

### 3. N+1 Query Pattern in Payment Controller

**File:** `payment.controller.js:196-231`
**Severity:** HIGH

```javascript
for (const item of cartItems) {
  const post = await VendorPost.findOne({ "products._id": item.productId });
  // ... process each item
}

for (const [vId, items] of Object.entries(itemsByVendor)) {
  const vendorProfile = await VendorProfile.findOne({ userId: vId });
  // ... create order for each vendor
}
```

**Impact:**
- 10 cart items = 10 database queries minimum
- Additional query per unique vendor
- Extremely slow at scale

**Recommendation:** Batch queries:
```javascript
const productIds = cartItems.map(i => i.productId);
const posts = await VendorPost.find({ "products._id": { $in: productIds } });
```

---

### 4. Redundant User Data in Auth Model

**File:** `auth.model.js`
**Severity:** HIGH

The User model contains vendor-specific fields that should be in VendorProfile:

```javascript
// In auth.model.js (User)
businessName: { type: String, unique: true, sparse: true },
whatsAppNumber: { type: String },
logo: { type: String },
subscriptionPlan: { type: String },
subscriptionExpiresAt: { type: Date },
isSubscriptionActive: { type: Boolean },
```

**Issues:**
- Violates single responsibility principle
- Subscription data duplicated (also in Subscription model)
- All users carry vendor fields even if clients

**Recommendation:** Move vendor-specific fields to VendorProfile model.

---

## Medium Priority Issues

### 5. Duplicate Index Definitions

**File:** `order.model.js:9-15` vs `order.model.js:85-87`
**Severity:** MEDIUM

```javascript
// Inline indexes
buyer: { ..., index: true },
vendor: { ..., index: true },
transactionReference: { ..., index: true },

// Plus compound indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ transactionReference: 1 }, { unique: true });
```

**Impact:**
- `buyer` has both single index and compound index (redundant)
- `transactionReference` indexed twice
- Unnecessary storage and write overhead

**Recommendation:** Remove inline `index: true` where compound indexes exist.

---

### 6. Inconsistent Timestamp Handling

**Files:** Multiple models
**Severity:** MEDIUM

```javascript
// Some use timestamps option (good)
{ timestamps: true }

// clientProfile.model.js - manual createdAt, no updatedAt
createdAt: {
  type: Date,
  default: Date.now,
}
// Missing updatedAt!
```

**Recommendation:** Use `{ timestamps: true }` consistently across all models.

---

### 7. Missing Foreign Key Validation

**Files:** Multiple models
**Severity:** MEDIUM

References to other models aren't validated:

```javascript
// order.model.js
vendor: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "VendorProfile",
  required: true,
}
// No validation that vendorId actually exists in VendorProfile
```

**Impact:** Orphaned references possible if vendor profile deleted.

**Recommendation:** Add pre-save validation or use transactions for related operations.

---

### 8. Cart totalPrice Not Persisted

**File:** `cart.model.js:56-62`
**Severity:** MEDIUM

```javascript
cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  next();
});
```

**Issue:** `totalPrice` is calculated but there's no `totalPrice` field in the schema. This calculation is lost.

**Recommendation:** Either add the field or remove the hook:
```javascript
totalPrice: { type: Number, default: 0 }
```

---

### 9. Text Index Without Language Specification

**File:** `vendorProduct.js:106`
**Severity:** MEDIUM

```javascript
vendorPostSchema.index({ "products.title": "text", "caption": "text" });
```

**Issues:**
- No default language specified (uses English)
- No weights specified (title should rank higher)
- Nigerian pidgin/local terms won't be stemmed correctly

**Recommendation:**
```javascript
vendorPostSchema.index(
  { "products.title": "text", "caption": "text" },
  { weights: { "products.title": 10, caption: 5 }, default_language: "none" }
);
```

---

### 10. Attachment Schema Incorrect

**File:** `message.model.js:23-27`
**Severity:** MEDIUM

```javascript
attachments: [
  {
    type: String,  // This defines the type AS "String", not a field named "type"
    url: String,
  },
],
```

**Issue:** The schema defines `type` as the Mongoose type declaration, not a field. This likely should be:

```javascript
attachments: [{
  fileType: String,  // e.g., "image", "document"
  url: String,
}]
```

---

## Low Priority Issues

### 11. Sparse Index on Non-Sparse Unique Field

**File:** `vendorProfile.model.js:12-17`
**Severity:** LOW

```javascript
storeUsername: {
  lowercase: true,
  type: String,
  unique: true,
  sparse: true,  // Allows multiple nulls
}
```

**Note:** This is actually correct usage - allows vendors without storeUsername. Just documenting for awareness.

---

### 12. Inconsistent Field Naming

**Files:** Multiple models
**Severity:** LOW

```javascript
// Different patterns used:
userId      // clientProfile, vendorProfile
user        // subscription, transaction
vendorId    // vendorPost, cart
buyer       // order
reviewer    // review
sender      // message
```

**Recommendation:** Standardize on one pattern (e.g., always `userId` for user references).

---

### 13. Missing Enum Validation on Status Fields

**File:** `vendorProfile.model.js:58-61`
**Severity:** LOW

```javascript
status: {
  type: String,
  default: "active",
  // No enum constraint!
}
```

**Recommendation:** Add enum validation:
```javascript
status: {
  type: String,
  enum: ["active", "suspended", "deleted"],
  default: "active",
}
```

---

### 14. Unused Product Reference

**File:** `vendorProfile.model.js:74-78`
**Severity:** LOW

```javascript
products: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",  // "Product" model doesn't exist - it's "VendorPost"
  },
],
```

**Issue:** References non-existent model and doesn't appear to be used anywhere.

---

### 15. GeoJSON Index Not Created

**File:** `schoolArea.model.js:14-24`
**Severity:** LOW

```javascript
location: {
  type: {
    type: String,
    enum: ["Point"],
    default: "Point",
  },
  coordinates: {
    type: [Number],
    default: [0, 0],
  },
}
// No 2dsphere index!
```

**Impact:** Geospatial queries won't work without the index.

**Recommendation:** Add if location queries are needed:
```javascript
schoolAreaSchema.index({ location: "2dsphere" });
```

---

## Indexing Summary

| Model | Indexes | Assessment |
|-------|---------|------------|
| User | role | ⚠️ Missing email, username indexes for login |
| VendorProfile | businessCategory, isVerified | ❌ Missing userId index |
| ClientProfile | userId | ✅ Good |
| VendorPost | vendorId, school, area, state+area, text | ✅ Good |
| Cart | userId (unique implicit) | ✅ Good |
| Order | buyer+createdAt, vendor+createdAt, transactionReference | ⚠️ Duplicate indexes |
| Review | reviewer, vendor, order, vendor+createdAt | ✅ Good |
| Message | conversationId, sender, isRead, compound indexes | ✅ Good |
| Conversation | participants, updatedAt | ✅ Good |
| Transaction | user, reference, status, user+createdAt | ✅ Good |
| Subscription | user, status, endDate, compound | ✅ Good |
| School | name (unique implicit) | ⚠️ Missing state index |
| SchoolArea | schoolName+name (unique) | ⚠️ Missing 2dsphere |

---

## Query Efficiency Issues

### N+1 Queries Detected

| Location | Pattern | Impact |
|----------|---------|--------|
| `payment.controller.js:196` | Loop with findOne per cart item | High |
| `payment.controller.js:231` | Loop with findOne per vendor | High |
| `review.controller.js` | Multiple sequential queries | Medium |
| `cart.controller.js:9,32` | User.findById before every cart op | Low |

### Missing Query Optimizations

1. **No `.lean()` on read-only queries** - Many queries that don't need Mongoose documents
2. **Over-fetching** - Some queries select all fields when only subset needed
3. **No pagination on some list endpoints** - Could return unbounded results

---

## Connection Configuration Review

**File:** `config/db.js`

```javascript
await mongoose.connect(uri, {
  serverSelectionTimeoutMS: 10000,  // ✅ Good
  maxPoolSize: 10,                  // ✅ Reasonable for small app
  minPoolSize: 2,                   // ✅ Good
  socketTimeoutMS: 45000,           // ⚠️ Quite long
  family: 4,                        // ✅ IPv4 only, avoids dual-stack issues
});
```

**Assessment:** Configuration is reasonable for a small-to-medium application.

---

## Data Validation Summary

| Model | Validation Level | Notes |
|-------|------------------|-------|
| User | ✅ Strong | Email, password complexity, regex patterns |
| VendorProfile | ⚠️ Weak | Missing many field validations |
| ClientProfile | ⚠️ Moderate | Has maxlength, missing required fields |
| VendorPost | ✅ Good | Required fields, enums, min values |
| Cart | ⚠️ Moderate | Missing quantity max validation in schema |
| Order | ✅ Good | Enums, required fields |
| Review | ✅ Good | Rating min/max, comment maxlength |
| Message | ✅ Good | Content maxlength, required fields |

---

## Recommendations Summary

### Immediate
1. Add index on `VendorProfile.userId`
2. Fix N+1 queries in payment controller
3. Add `totalPrice` field to Cart schema

### Short-term
4. Remove duplicate indexes in Order model
5. Fix attachment schema in Message model
6. Standardize timestamp handling across all models

### Medium-term
7. Refactor User model - move vendor fields to VendorProfile
8. Add foreign key validation hooks
9. Implement data sync strategy for denormalized cart data

### Long-term
10. Consider adding MongoDB transactions for multi-document operations
11. Set up proper geospatial indexing if location features needed
12. Add database-level validation constraints

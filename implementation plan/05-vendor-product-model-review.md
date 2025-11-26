# Vendor Product Model - Review

## Overview

Product listing model for vendors with comprehensive validation, indexes, and helper methods.

**Location**: `backend/models/vendorProduct.js`

**Status**: ⚠️ Model complete, but **NO controller or routes implemented**

---

## Schema Fields

### Core Product Information

- **vendorId**: ObjectId (ref to User, validates role="vendor")
- **title**: String (3+ chars, indexed)
- **description**: String (10-2000 chars)
- **price**: Number (non-negative, validated)
- **category**: Enum (10 categories)
- **images**: Array of strings (1-5 URLs required)

### Categories

Electronics, Fashion, Books, Food & Beverages, Sports & Fitness, Health & Beauty, Home & Living, Stationery, Services, Other

### Location Fields

- **school**: String (required, indexed)
- **location**: String (exact location, 2-200 chars)
- **hostelName**: String (optional, max 100 chars)

### Inventory

- **stock**: Number (non-negative integer, default 0)
- **isInStock**: Boolean (default true)
- **condition**: Enum (New, Like New, Good, Fair, Used)

### Metadata

- **views**: Number (default 0)
- **tags**: Array of strings (max 10 tags)
- **createdAt**: Date (auto)
- **updatedAt**: Date (auto)

---

## Database Indexes

```javascript
{ vendorId: 1, createdAt: -1 }         // Vendor's products
{ school: 1, category: 1 }              // Filter by school + category
{ school: 1, location: 1 }              // Filter by school + location
{ title: "text", description: "text" }  // Full-text search
{ isActive: 1, stock: 1 }               // Active products with stock
```

---

## Instance Methods

### 1. `isOwnedBy(userId)`

Check if user owns this product.

### 2. `incrementViews()`

Increment view count and save.

### 3. `updateStock(quantity)`

Adjust stock (positive or negative). Throws error if insufficient stock.

---

## Static Methods

### 1. `findBySchool(school, options)`

Get active products by school with optional category/location filters.

### 2. `findByVendor(vendorId, includeInactive)`

Get vendor's products, optionally including inactive ones.

### 3. `searchProducts(searchTerm, school)`

Full-text search on title and description within school.

---

## Virtual Fields

**inStock**: Computed from `stock > 0`

---

## Next Steps

⏳ **NEEDS**: Controller and routes implementation

See: `05-vendor-product-implementation-plan.md`

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26

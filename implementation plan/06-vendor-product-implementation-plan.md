# Vendor Product Controller - Implementation Plan

## Problem Statement

The `vendorProduct.js` model is complete but has **no controller or routes**. Vendors cannot create, manage, or display products.

---

## Required Components

1. **Controller**: `backend/controllers/vendorProduct.controller.js`
2. **Routes**: `backend/routes/vendorProduct.route.js`
3. **Integration**: Register routes in `app.js`

---

## Controller Functions (11 Endpoints)

### Vendor Operations (Protected, Vendor-Only)

#### 1. createProduct

- **Method**: POST `/`
- **Auth**: Required (vendor)
- **Body**: title, description, price, category, images, school, location, stock, etc.
- **Logic**:
  - Set vendorId = req.user.\_id
  - Validate all required fields
  - Create product
  - Return 201 Created

#### 2. getMyProducts

- **Method**: GET `/my-products`
- **Auth**: Required (vendor)
- **Query**: page, limit, includeInactive, category
- **Logic**: Fetch vendor's products with pagination
- **Return**: Products array + pagination metadata

#### 3. getProductById

- **Method**: GET `/my-products/:productId`
- **Auth**: Required (vendor)
- **Logic**: Get single product, verify ownership
- **Return**: Product data

#### 4. updateProduct

- **Method**: PATCH `/:productId`
- **Auth**: Required (vendor)
- **Logic**: Verify ownership, update fields, run validators
- **Return**: Updated product

#### 5. deleteProduct

- **Method**: DELETE `/:productId`
- **Auth**: Required (vendor)
- **Logic**: Verify ownership, delete (or set isActive=false)
- **Return**: Success message

#### 6. updateStock

- **Method**: PATCH `/:productId/stock`
- **Auth**: Required (vendor)
- **Body**: { quantity: number }
- **Logic**: Use product.updateStock() method
- **Return**: Updated stock

---

### Public/Client Operations

#### 7. getAllProducts

- **Method**: GET `/`
- **Auth**: Public
- **Query**: school (required), category, location, hostelName, minPrice, maxPrice, search, page, limit, sort
- **Logic**:
  - Filter: isActive=true, stock>0
  - Apply pagination
  - Populate vendor info
- **Return**: Products array + pagination

#### 8. getPublicProductById

- **Method**: GET `/:productId`
- **Auth**: Public
- **Logic**:
  - Find product
  - Increment views
  - Populate vendor info
- **Return**: Product + vendor data

#### 9. searchProducts

- **Method**: GET `/search`
- **Auth**: Public
- **Query**: q (search term), school, category, page, limit
- **Logic**: Use Product.searchProducts() static method
- **Return**: Search results

#### 10. getProductsByCategory

- **Method**: GET `/category/:category`
- **Auth**: Public
- **Query**: school, page, limit
- **Logic**: Filter by category + school
- **Return**: Products

#### 11. getProductsByVendor

- **Method**: GET `/vendor/:storeUsername`
- **Auth**: Public
- **Logic**:
  - Find vendor by storeUsername
  - Get their active products
- **Return**: Vendor storefront

---

## Route Structure

**File**: `backend/routes/vendorProduct.route.js`

```javascript
const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createProduct,
  getMyProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  updateStock,
  getAllProducts,
  getPublicProductById,
  searchProducts,
  getProductsByCategory,
  getProductsByVendor,
} = require("../controllers/vendorProduct.controller");

const router = express.Router();

// VENDOR ROUTES (Protected)
router.post("/", protectRoute, verifyRole("vendor"), createProduct);
router.get("/my-products", protectRoute, verifyRole("vendor"), getMyProducts);
router.get(
  "/my-products/:productId",
  protectRoute,
  verifyRole("vendor"),
  getProductById
);
router.patch("/:productId", protectRoute, verifyRole("vendor"), updateProduct);
router.delete("/:productId", protectRoute, verifyRole("vendor"), deleteProduct);
router.patch(
  "/:productId/stock",
  protectRoute,
  verifyRole("vendor"),
  updateStock
);

// PUBLIC ROUTES
router.get("/", getAllProducts);
router.get("/search", searchProducts);
router.get("/category/:category", getProductsByCategory);
router.get("/vendor/:storeUsername", getProductsByVendor);
router.get("/:productId", getPublicProductById);

module.exports = router;
```

**⚠️ Important**: Specific routes (e.g., `/search`, `/my-products`) must come BEFORE parameterized routes (e.g., `/:productId`)

---

## Integration in app.js

Add to `app.js`:

```javascript
const productRouter = require("./routes/vendorProduct.route");
app.use("/api/v1/products", productRouter);
```

---

## Authorization Matrix

| Endpoint          | Auth | Role   | Ownership Check |
| ----------------- | ---- | ------ | --------------- |
| Create Product    | ✅   | vendor | N/A             |
| Get My Products   | ✅   | vendor | N/A             |
| Get Product (Own) | ✅   | vendor | ✅              |
| Update Product    | ✅   | vendor | ✅              |
| Delete Product    | ✅   | vendor | ✅              |
| Update Stock      | ✅   | vendor | ✅              |
| Browse Products   | ❌   | N/A    | N/A             |
| View Product      | ❌   | N/A    | N/A             |
| Search            | ❌   | N/A    | N/A             |
| Category          | ❌   | N/A    | N/A             |
| Vendor Storefront | ❌   | N/A    | N/A             |

---

## Pagination Strategy

```javascript
const page = parseInt(req.query.page) || 1;
const limit = Math.min(parseInt(req.query.limit) || 10, 50); // max 50
const skip = (page - 1) * limit;

const products = await Product.find(query)
  .skip(skip)
  .limit(limit)
  .populate("vendorId", "businessName whatsAppNumber phoneNumber");

const total = await Product.countDocuments(query);

res.json({
  success: true,
  data: {
    products,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  },
});
```

---

## Validation Rules

### Create Product

- ✅ All required fields present
- ✅ vendorId = req.user.\_id (auto-set)
- ✅ req.user.role === "vendor"
- ✅ images array: 1-5 URLs
- ✅ price >= 0
- ✅ stock >= 0 (integer)
- ✅ category in enum
- ✅ condition in enum

### Update Product

- ✅ Ownership verification
- ✅ Prevent vendorId modification
- ✅ Run schema validators

### Delete Product

- ✅ Ownership verification
- ✅ Option: Hard delete OR soft delete (isActive=false)

---

## Error Handling

All controllers use:

- `asyncErrorHandler` wrapper
- `customError` for operational errors
- Schema validators
- Authorization checks (auth + role + ownership)

---

## Testing Plan

### Manual Testing (Postman/Thunder Client)

**1. Create Product (Vendor)**

```
POST /api/v1/products
Headers: Cookie: token=<vendor_jwt>
Body: {
  "title": "MacBook Pro M1",
  "description": "Lightly used, excellent condition",
  "price": 850000,
  "category": "Electronics",
  "images": ["https://example.com/image1.jpg"],
  "school": "University of Lagos",
  "location": "Akoka",
  "stock": 1,
  "condition": "Like New"
}
Expected: 201 Created
```

**2. Get My Products (Vendor)**

```
GET /api/v1/products/my-products?page=1&limit=10
Headers: Cookie: token=<vendor_jwt>
Expected: 200 OK, vendor's products
```

**3. Update Product (Vendor)**

```
PATCH /api/v1/products/<productId>
Headers: Cookie: token=<vendor_jwt>
Body: { "price": 800000 }
Expected: 200 OK, updated product
```

**4. Browse Products (Public)**

```
GET /api/v1/products?school=University of Lagos&category=Electronics
Expected: 200 OK, filtered products
```

**5. Search Products (Public)**

```
GET /api/v1/products/search?q=macbook&school=University of Lagos
Expected: 200 OK, search results
```

**6. View Product (Public)**

```
GET /api/v1/products/<productId>
Expected: 200 OK, product details, views incremented
```

### Authorization Tests

- ❌ Create product as client → 403 Forbidden
- ❌ Update other vendor's product → 403 Forbidden
- ❌ Access vendor routes without auth → 401 Unauthorized

---

## Implementation Steps

1. ✅ Review this plan
2. ⏳ Create `backend/controllers/vendorProduct.controller.js`
3. ⏳ Create `backend/routes/vendorProduct.route.js`
4. ⏳ Register routes in `app.js`
5. ⏳ Test all endpoints with Postman
6. ⏳ Verify authorization rules
7. ⏳ Test pagination and filtering
8. ⏳ Document API endpoints

---

## Questions for Review

1. **Image Upload**: Implement image upload endpoint, or frontend handles uploads?
2. **Product Deletion**: Hard delete or soft delete (isActive flag)?
3. **VendorProfile.products sync**: Maintain this array or rely on queries?
4. **Stock management**: Add order/reservation system to prevent race conditions?

---

## Estimated Effort

- **Controller**: ~400-500 lines, 11 functions
- **Routes**: ~30 lines
- **Testing**: 7+ test scenarios
- **Total**: 3-4 hours for experienced developer

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26

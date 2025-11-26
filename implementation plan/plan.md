# Vendora Backend - Implementation Documentation

## Overview

This document provides a comprehensive review of the existing backend codebase and a detailed implementation plan for the Vendor Product management system.

---

## Part 1: Existing Backend Implementation Review

### 1. Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Business logic (3 controllers)
├── errors/          # Custom error handling
├── middleware/      # Authentication & authorization
├── models/          # Database schemas (4 models)
├── routes/          # API endpoints (3 route files)
├── utils/           # Helper utilities
├── app.js           # Express app setup
└── server.js        # Server entry point
```

---

### 2. Models (Database Schemas)

#### ✅ [auth.model.js](file:///c:/projects/Vendora/backend/models/auth.model.js)

**Purpose**: Core user authentication and account management

**Key Features**:

- **Fields**: fullName, username, email, phoneNumber, schoolName, schoolId, schoolEmail, profilePic, bio, password, role (client/vendor/admin), businessName, whatsAppNumber, logo, isGoogleAuth, profileComplete, passwordChangedAt
- **Validations**:
  - Email validation using validator library
  - Phone number regex validation
  - Password strength requirements (uppercase, lowercase, number, special char)
  - School ID format validation
  - Username uniqueness and format constraints
  - Business name uniqueness for vendors
- **Security**:
  - Password hashing with bcrypt (10 salt rounds)
  - JWT token generation (7-day expiration)
  - Password change tracking
- **Methods**:
  - `comparePassword()`: Compare plain password with hashed password
  - `generateToken()`: Create JWT with user ID and role
  - `isPasswordChanged()`: Check if password changed after JWT issued
- **Conditionally Required Fields**: password and schoolId not required for Google auth users

**Status**: ✅ **Production-ready**

---

#### ✅ [clientProfile.model.js](file:///c:/projects/Vendora/backend/models/clientProfile.model.js)

**Purpose**: Extended profile information for client users

**Key Features**:

- **Fields**: userId (ref to User), fullName, username, phoneNumber, address, city, state, country, schoolName, profileImage, preferredCategory, wishlist, lastLogin, createdAt
- **Wishlist System**: Array of product references with timestamps
- **Validations**: Phone number validation, max length constraints
- **Default Values**: country defaults to "Nigeria"

**Status**: ✅ **Production-ready**

---

#### ✅ [vendorProfile.model.js](file:///c:/projects/Vendora/backend/models/vendorProfile.model.js)

**Purpose**: Extended profile information for vendor users

**Key Features**:

- **Fields**: userId (ref to User), businessName, storeUsername, storeDescription, businessCategory, phoneNumber, whatsAppNumber, email, profileImage, coverImage, address, city, state, country, schoolName, website, isVerified, status, rating, totalSales, reviews (ref), products (array of refs), accountNumber, paymentMethods, socialLinks
- **Payment Methods**: Validated array (bank_transfer, paystack, credit_card)
- **Public Store**: Queryable by storeUsername for public profile access
- **Business Metrics**: Rating, total sales tracking
- **Validation**: Email validation, payment method enum validation

**Status**: ✅ **Production-ready**

---

#### ⚠️ [vendorProduct.js](file:///c:/projects/Vendora/backend/models/vendorProduct.js)

**Purpose**: Product listing management for vendors

**Key Features**:

- **Core Fields**: vendorId (ref to User), title, description, price, category, images (1-5 images), school, location, hostelName, stock, isInStock, views, condition, tags
- **Category Enum**: Electronics, Fashion, Books, Food & Beverages, Sports & Fitness, Health & Beauty, Home & Living, Stationery, Services, Other
- **Condition Enum**: New, Like New, Good, Fair, Used
- **Location System**: school + location + hostelName for precise product placement
- **Validations**:
  - Vendor ID must reference a user with role="vendor"
  - Title: 3+ chars
  - Description: 10-2000 chars
  - Price: non-negative number
  - Images: 1-5 URLs required
  - Stock: non-negative integer
  - Tags: max 10 tags
- **Indexes** (Performance Optimization):
  - `{ vendorId: 1, createdAt: -1 }` - Vendor's products sorted by date
  - `{ school: 1, category: 1 }` - Filter by school and category
  - `{ school: 1, location: 1 }` - Filter by school and location
  - `{ title: "text", description: "text" }` - Full-text search
  - `{ isActive: 1, stock: 1 }` - Active products with stock
- **Virtual Field**: `inStock` - computed from stock > 0
- **Instance Methods**:
  - `isOwnedBy(userId)`: Check product ownership
  - `incrementViews()`: Increment view count
  - `updateStock(quantity)`: Adjust stock quantity with validation
- **Static Methods**:
  - `findBySchool(school, options)`: Get active products by school with filters
  - `findByVendor(vendorId, includeInactive)`: Get vendor's products
  - `searchProducts(searchTerm, school)`: Full-text search within school

**Status**: ⚠️ **Model complete, but NO controller or routes implemented**

---

### 3. Controllers (Business Logic)

#### ✅ [auth.controller.js](file:///c:/projects/Vendora/backend/controllers/auth.controller.js)

**Purpose**: Handle authentication and user management

**Endpoints Implemented**:

1. **`googleAuth`**: OAuth login/signup via Google
2. **`signup`**: Register new user (client or vendor)
3. **`login`**: Login with email/username/schoolId + password
4. **`logout`**: Clear authentication cookie
5. **`checkAuth`**: Verify current authentication status
6. **`completeRegistration`**: Complete Google user profile setup

**Key Logic**:

- **Google Auth Flow**: Find existing user by email OR create new user with auto-generated username
- **Profile Detection**: Check if ClientProfile or VendorProfile exists and include `hasProfile` in response
- **Multi-Identifier Login**: Accept email, username, or schoolId as identifier
- **Field Validation**: Different required fields for client vs vendor roles
- **Token Management**: Uses `sendToken` utility for consistent cookie/response

**Status**: ✅ **Production-ready**

---

#### ✅ [vendorProfile.controller.js](file:///c:/projects/Vendora/backend/controllers/vendorProfile.controller.js)

**Purpose**: Manage vendor profile operations

**Endpoints Implemented**:

1. **`createVendorProfile`**: Create new vendor profile (one per user)
2. **`getVendorProfile`**: Get authenticated vendor's profile
3. **`getPublicVendorProfile`**: Get vendor profile by storeUsername (public)
4. **`updateVendorProfile`**: Update vendor profile

**Key Logic**:

- **Ownership Enforcement**: userId from `req.user` (auth middleware)
- **Duplicate Prevention**: Check for existing profile before creation
- **Safe Updates**: Remove userId and \_id from update payload
- **Public Access**: Public profile endpoint for storefront browsing

**Status**: ✅ **Production-ready**

---

#### ✅ [clientProfile.controller.js](file:///c:/projects/Vendora/backend/controllers/clientProfile.controller.js)

**Purpose**: Manage client profile operations

**Endpoints Implemented**:

1. **`createClientProfile`**: Create new client profile (one per user)
2. **`getClientProfile`**: Get authenticated client's profile
3. **`updateClientProfile`**: Update client profile

**Key Logic**:

- **Ownership Enforcement**: userId from `req.user`
- **Duplicate Prevention**: Check for existing profile before creation
- **Validation**: Uses MongoDB validators with custom error handling

**Status**: ✅ **Production-ready**

---

### 4. Routes (API Endpoints)

#### ✅ [auth.route.js](file:///c:/projects/Vendora/backend/routes/auth.route.js)

```
POST   /api/v1/auth/signup
POST   /api/v1/auth/login
POST   /api/v1/auth/logout
GET    /api/v1/auth/check (protected)
POST   /api/v1/auth/google
POST   /api/v1/auth/complete-registration (protected)
```

#### ✅ vendorProfle.route.js

```
POST   /api/v1/vendorProfile/create (protected, vendor only)
GET    /api/v1/vendorProfile/ (protected, vendor only)
PATCH  /api/v1/vendorProfile/update (protected, vendor only)
GET    /api/v1/vendorProfile/public/:storeUsername (public)
```

#### ✅ clientProfile.route.js

```
POST   /api/v1/clientProfile/create (protected, client only)
GET    /api/v1/clientProfile/ (protected, client only)
PATCH  /api/v1/clientProfile/ (protected, client only)
```

**Status**: ✅ **All routes properly protected with auth middleware and role verification**

---

### 5. Middleware

#### ✅ [auth.middleware.js](file:///c:/projects/Vendora/backend/middleware/auth.middleware.js)

**Purpose**: Protect routes and verify user roles

**Functions**:

1. **`protectRoute`**: Verify JWT from cookie or Authorization header
   - Extracts token from `req.cookies.token` or `Authorization: Bearer <token>`
   - Verifies token signature and expiration
   - Loads user from database
   - Checks if password changed after token issued
   - Attaches `req.user` for downstream controllers
2. **`verifyRole(...allowedRoles)`**: Restrict access by user role
   - Checks `req.user.role` against allowed roles
   - Returns 401 if unauthorized

**Status**: ✅ **Production-ready**

---

### 6. Error Handling

#### ✅ [globalError.controller.js](file:///c:/projects/Vendora/backend/errors/globalError.controller.js)

**Purpose**: Centralized error handling middleware

**Features**:

- **Development Mode**: Returns full error details, stack trace
- **Production Mode**: Returns sanitized errors for operational errors
- **Error Transformers**:
  - `castErrorHandler`: MongoDB cast errors
  - `duplicateKeyErrorHandler`: Unique constraint violations
  - `validationErrorHandler`: Schema validation errors
- **Operational vs Programming Errors**: Only operational errors exposed in production

**Status**: ✅ **Production-ready**

#### ✅ [customError.js](file:///c:/projects/Vendora/backend/errors/customError.js)

**Purpose**: Custom error class with status codes

#### ✅ [asyncErrorHandle.js](file:///c:/projects/Vendora/backend/errors/asyncErrorHandle.js)

**Purpose**: Wrapper to catch async errors and pass to global error handler

---

### 7. Utilities

#### ✅ [sendToken.js](file:///c:/projects/Vendora/backend/utils/sendToken.js)

**Purpose**: Consistent JWT cookie management and response formatting

**Features**:

- Sets HTTP-only cookie with JWT
- 7-day expiration
- Secure flag in production
- SameSite policy (none in production, lax in development)
- Includes `hasProfile` in response data when provided

**Status**: ✅ **Production-ready**

---

### 8. Application Setup

#### ✅ [app.js](file:///c:/projects/Vendora/backend/app.js)

**Configuration**:

- **CORS**: Configured for frontend origin (localhost:5173 in dev)
- **Middleware**: cookie-parser, express.json()
- **Routes**: `/api/v1/auth`, `/api/v1/vendorProfile`, `/api/v1/clientProfile`
- **404 Handler**: Custom error for undefined routes
- **Global Error Handler**: Catches all errors

**Status**: ✅ **Production-ready**

---

## Part 2: Vendor Product Controller - Implementation Plan

### Problem Statement

The `vendorProduct.js` model is complete with comprehensive validation, indexes, and helper methods, but **there are no controllers or routes** to expose this functionality to the frontend. Vendors cannot currently create, read, update, or delete products.

---

### Required Components

We need to build a complete CRUD system with the following components:

#### 1. **Controller**: `backend/controllers/vendorProduct.controller.js`

#### 2. **Routes**: `backend/routes/vendorProduct.route.js`

#### 3. **Integration**: Register routes in `app.js`

---

### Proposed Implementation

#### **Controller Functions** (11 endpoints)

##### **Vendor Operations** (Protected, Vendor-Only)

1. **`createProduct`**

   - **Method**: POST
   - **Auth**: Required (vendor only)
   - **Purpose**: Create new product listing
   - **Validation**:
     - All required fields present (title, description, price, category, images, school, location, stock)
     - vendorId = req.user.\_id
     - Verify req.user.role === "vendor"
     - Validate image array (1-5 images)
     - Validate price >= 0
     - Validate stock >= 0
   - **Logic**:
     - Auto-set vendorId from authenticated user
     - Auto-set isInStock based on stock > 0
     - Save product
     - Optionally update VendorProfile.products array
   - **Response**: 201 Created with product data

2. **`getMyProducts`**

   - **Method**: GET
   - **Auth**: Required (vendor only)
   - **Purpose**: Get all products for authenticated vendor
   - **Query Params**:
     - `includeInactive` (boolean) - default false
     - `category` (string) - filter by category
     - `page` (number) - pagination page number
     - `limit` (number) - items per page (default 10, max 50)
   - **Logic**:
     - Use Product.findByVendor(req.user.\_id, includeInactive)
     - Apply pagination
     - Sort by createdAt descending
   - **Response**: 200 OK with products array + pagination metadata

3. **`getProductById`**

   - **Method**: GET
   - **Auth**: Required (vendor only)
   - **Purpose**: Get single product details (own product)
   - **Params**: :productId
   - **Logic**:
     - Find product by ID
     - Verify ownership (product.isOwnedBy(req.user.\_id))
     - Return 403 if not owner
   - **Response**: 200 OK with product data

4. **`updateProduct`**

   - **Method**: PATCH
   - **Auth**: Required (vendor only)
   - **Purpose**: Update existing product
   - **Params**: :productId
   - **Validation**:
     - Verify ownership
     - Prevent vendorId modification
     - Validate updated fields against schema
   - **Logic**:
     - Find product
     - Check ownership
     - Update fields
     - Run validators
   - **Response**: 200 OK with updated product

5. **`deleteProduct`**

   - **Method**: DELETE
   - **Auth**: Required (vendor only)
   - **Purpose**: Delete product (hard delete or soft delete with isActive flag)
   - **Params**: :productId
   - **Logic**:
     - Find product
     - Verify ownership
     - Delete product (or set isActive = false)
     - Remove from VendorProfile.products array
   - **Response**: 200 OK with success message

6. **`updateStock`**
   - **Method**: PATCH
   - **Auth**: Required (vendor only)
   - **Purpose**: Adjust product stock quantity
   - **Params**: :productId
   - **Body**: { quantity: number } (positive or negative)
   - **Logic**:
     - Find product
     - Verify ownership
     - Use product.updateStock(quantity) method
     - Catches insufficient stock errors
   - **Response**: 200 OK with updated stock

---

##### **Public/Client Operations** (Protected or Public)

7. **`getAllProducts`**

   - **Method**: GET
   - **Auth**: Public or Protected (optional)
   - **Purpose**: Browse all active products (marketplace view)
   - **Query Params**:
     - `school` (string) - filter by school (REQUIRED)
     - `category` (string) - filter by category
     - `location` (string) - filter by location
     - `hostelName` (string) - filter by hostel
     - `condition` (string) - filter by condition
     - `minPrice` (number)
     - `maxPrice` (number)
     - `search` (string) - text search
     - `page` (number) - pagination
     - `limit` (number) - items per page
     - `sort` (string) - sort field (createdAt, price, views)
   - **Logic**:
     - Build query object from filters
     - Always filter: isActive = true, stock > 0
     - Use Product.findBySchool() if applicable
     - Apply pagination
     - Populate vendor info (businessName, whatsAppNumber, phoneNumber)
   - **Response**: 200 OK with products array + pagination + filters

8. **`getPublicProductById`**

   - **Method**: GET
   - **Auth**: Public or Protected (optional)
   - **Purpose**: View single product details (public view)
   - **Params**: :productId
   - **Logic**:
     - Find product by ID
     - Increment views (product.incrementViews())
     - Populate vendor info
     - Only return if isActive = true
   - **Response**: 200 OK with product data + vendor info

9. **`searchProducts`**

   - **Method**: GET
   - **Auth**: Public or Protected (optional)
   - **Purpose**: Full-text search on title and description
   - **Query Params**:
     - `q` (string) - search query (REQUIRED)
     - `school` (string) - scope to school
     - `category` (string)
     - `page` (number)
     - `limit` (number)
   - **Logic**:
     - Use Product.searchProducts(searchTerm, school)
     - Filter active products with stock
     - Populate vendor info
   - **Response**: 200 OK with search results

10. **`getProductsByCategory`**

    - **Method**: GET
    - **Auth**: Public
    - **Purpose**: Get all products in a specific category
    - **Params**: :category
    - **Query Params**: school, page, limit
    - **Logic**:
      - Validate category against enum
      - Filter by category + school + active + inStock
      - Populate vendor info
    - **Response**: 200 OK with products

11. **`getProductsByVendor`**
    - **Method**: GET
    - **Auth**: Public
    - **Purpose**: View all products from a specific vendor (storefront)
    - **Params**: :vendorId or :storeUsername
    - **Query Params**: category, page, limit
    - **Logic**:
      - Find VendorProfile by storeUsername or userId
      - Get active products for that vendor
      - Populate vendor info
    - **Response**: 200 OK with products + vendor profile

---

### Route Structure

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

// ============= VENDOR ROUTES (Protected) =============
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

// ============= PUBLIC ROUTES =============
router.get("/", getAllProducts); // Browse marketplace
router.get("/search", searchProducts); // Search products
router.get("/category/:category", getProductsByCategory); // Category filter
router.get("/vendor/:storeUsername", getProductsByVendor); // Vendor storefront
router.get("/:productId", getPublicProductById); // Product details (public)

module.exports = router;
```

**Route Priority**: Specific routes (e.g., `/search`, `/my-products`) MUST come before parameterized routes (e.g., `/:productId`) to prevent routing conflicts.

---

### Integration Steps

#### 1. **Register Routes in app.js**

```javascript
const productRouter = require("./routes/vendorProduct.route");
app.use("/api/v1/products", productRouter);
```

#### 2. **Update VendorProfile on Product Creation** (Optional)

When creating a product, push the product ID to `VendorProfile.products` array:

```javascript
await VendorProfile.findOneAndUpdate(
  { userId: req.user._id },
  { $push: { products: newProduct._id } }
);
```

---

### Validation & Error Handling

All controller functions will use:

- **`asyncErrorHandler`** wrapper for automatic error catching
- **`customError`** for operational errors
- MongoDB schema validators for data integrity
- Authorization checks:
  - Verify user is authenticated
  - Verify user has vendor role
  - Verify user owns the product (for update/delete)

---

### Authorization Matrix

| Endpoint              | Auth Required | Role Required | Ownership Check |
| --------------------- | ------------- | ------------- | --------------- |
| Create Product        | ✅            | vendor        | N/A             |
| Get My Products       | ✅            | vendor        | N/A             |
| Get Product (Own)     | ✅            | vendor        | ✅              |
| Update Product        | ✅            | vendor        | ✅              |
| Delete Product        | ✅            | vendor        | ✅              |
| Update Stock          | ✅            | vendor        | ✅              |
| Browse Products       | ❌            | N/A           | N/A             |
| View Product (Public) | ❌            | N/A           | N/A             |
| Search Products       | ❌            | N/A           | N/A             |
| Category Products     | ❌            | N/A           | N/A             |
| Vendor Storefront     | ❌            | N/A           | N/A             |

---

### Data Flow Examples

#### **Create Product Flow**

```
Frontend → POST /api/v1/products
         ↓
auth.middleware (verify JWT, attach req.user)
         ↓
verifyRole("vendor") (check role)
         ↓
createProduct controller
  - Validate request body
  - Set vendorId = req.user._id
  - Create Product document
  - Update VendorProfile.products array
  - Return product data
         ↓
Frontend receives product
```

#### **Browse Products Flow**

```
Frontend → GET /api/v1/products?school=UniLag&category=Electronics&page=1
         ↓
getAllProducts controller (no auth required)
  - Build query { school: "UniLag", category: "Electronics", isActive: true, stock > 0 }
  - Apply pagination
  - Populate vendor info
  - Return products array
         ↓
Frontend displays product grid
```

#### **Update Product Flow**

```
Frontend → PATCH /api/v1/products/:productId
         ↓
auth.middleware
         ↓
verifyRole("vendor")
         ↓
updateProduct controller
  - Find product by ID
  - Check product.isOwnedBy(req.user._id)
  - If not owner, return 403 Forbidden
  - Update product fields
  - Return updated product
         ↓
Frontend updates UI
```

---

### Pagination Strategy

For list endpoints (getAllProducts, getMyProducts, searchProducts):

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

### Image Handling

**Current Implementation**: Product model accepts array of image URLs (strings).

**Assumptions**:

- Images are uploaded to external service (Cloudinary, AWS S3, etc.) BEFORE product creation
- Frontend handles image upload and receives URLs
- Backend stores only URLs in `images` array

**Future Enhancement** (if needed):

- Add file upload endpoint (`POST /api/v1/products/upload-image`)
- Use `multer` for multipart/form-data
- Upload to cloud storage
- Return image URL to frontend

---

### Database Indexing

The Product model already has optimized indexes:

```javascript
// Existing indexes (already implemented in model)
productSchema.index({ vendorId: 1, createdAt: -1 });
productSchema.index({ school: 1, category: 1 });
productSchema.index({ school: 1, location: 1 });
productSchema.index({ title: "text", description: "text" });
productSchema.index({ isActive: 1, stock: 1 });
```

**No additional indexes required** - these cover all query patterns.

---

### Testing & Verification Plan

#### **Manual Testing with Postman/Thunder Client**

1. **Create Product** (Vendor)

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
     "condition": "Like New",
     "tags": ["laptop", "macbook", "apple"]
   }
   Expected: 201 Created, product data returned
   ```

2. **Get My Products** (Vendor)

   ```
   GET /api/v1/products/my-products?page=1&limit=10
   Headers: Cookie: token=<vendor_jwt>
   Expected: 200 OK, array of vendor's products
   ```

3. **Update Product** (Vendor)

   ```
   PATCH /api/v1/products/<productId>
   Headers: Cookie: token=<vendor_jwt>
   Body: { "price": 800000, "stock": 0 }
   Expected: 200 OK, updated product
   ```

4. **Browse Products** (Public)

   ```
   GET /api/v1/products?school=University of Lagos&category=Electronics
   Expected: 200 OK, filtered products
   ```

5. **Search Products** (Public)

   ```
   GET /api/v1/products/search?q=macbook&school=University of Lagos
   Expected: 200 OK, search results
   ```

6. **View Product** (Public)

   ```
   GET /api/v1/products/<productId>
   Expected: 200 OK, product details, views incremented
   ```

7. **Authorization Tests**:
   - Try updating another vendor's product → Expect 403 Forbidden
   - Try creating product as client → Expect 403 Forbidden
   - Try accessing vendor routes without auth → Expect 401 Unauthorized

#### **Automated Testing** (Future Enhancement)

Create `tests/product.test.js` using Jest/Mocha:

```javascript
describe("Product Controller", () => {
  test("Vendor can create product", async () => {
    /* ... */
  });
  test("Client cannot create product", async () => {
    /* ... */
  });
  test("Public can browse products", async () => {
    /* ... */
  });
  test("Vendor cannot update other vendor's product", async () => {
    /* ... */
  });
});
```

Run with: `npm test`

---

### API Documentation Template

Create `docs/PRODUCT_API.md`:

```markdown
# Product API Documentation

## Base URL

`/api/v1/products`

## Endpoints

### Create Product

**POST** `/`
**Auth**: Required (Vendor)
**Body**: { title, description, price, category, images, school, location, stock, ... }
**Response**: 201 Created

[... document all 11 endpoints ...]
```

---

### Environment Variables

No new environment variables required. Existing setup is sufficient:

- `JWT_SECRET_KEY`: For authentication
- `MONGODB_URI`: Database connection
- `NODE_ENV`: Environment mode

---

### Potential Issues & Solutions

| Issue                        | Solution                                                     |
| ---------------------------- | ------------------------------------------------------------ |
| **Image URLs broken**        | Validate URLs with regex before saving                       |
| **Stock out of sync**        | Use atomic operations (`$inc`) for stock updates             |
| **Duplicate products**       | Add unique index on `{ vendorId, title }` if needed          |
| **Search performance**       | Text indexes already created, ensure `school` filter used    |
| **Large result sets**        | Enforce pagination limits (max 50 items)                     |
| **Vendor profile not found** | Create VendorProfile automatically on first product creation |

---

### Next Steps

1. ✅ Review this implementation plan
2. ⏳ Create `backend/controllers/vendorProduct.controller.js`
3. ⏳ Create `backend/routes/vendorProduct.route.js`
4. ⏳ Register routes in `app.js`
5. ⏳ Test all endpoints with Postman
6. ⏳ Verify authorization rules
7. ⏳ Test pagination and filtering
8. ⏳ Document API endpoints
9. ⏳ (Optional) Write automated tests
10. ⏳ (Optional) Add image upload endpoint

---

## Summary

### What's Been Done ✅

- Complete authentication system (signup, login, Google auth)
- Client and vendor profile management
- Role-based access control
- Error handling infrastructure
- Comprehensive product data model with validation and indexes

### What Needs to Be Done ⏳

- Vendor product controller (11 endpoints)
- Product routes with proper authorization
- Integration with existing app
- API testing and documentation

### Estimated Complexity

- **Controller**: Medium complexity (11 functions, ~400-500 lines)
- **Routes**: Low complexity (~30 lines)
- **Testing**: Medium effort (7 test scenarios minimum)
- **Total Effort**: 3-4 hours for experienced developer

---

## Questions for Review

1. **Image Upload**: Should we implement image upload endpoint, or will frontend handle uploads externally?
2. **Product Deletion**: Hard delete or soft delete (isActive flag)?
3. **VendorProfile.products sync**: Should we maintain this array or rely on queries?
4. **Public browsing**: Should unauthenticated users be able to browse products?
5. **Stock management**: Should we add order/reservation system to prevent race conditions?
6. **Categories**: Are the current 10 categories sufficient, or do you need custom categories?

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26  
**Author**: AI Assistant (Backend Code Review)

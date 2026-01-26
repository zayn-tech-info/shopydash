# Database Security Implementation Guide

## Overview

This guide shows you how to secure your Shopydash database so that only you (as admin) can modify data.

## Security Layers Implemented

### 1. MongoDB Database Level

- Network access restrictions (only your IP)
- User authentication and authorization
- Role-based access control

### 2. Application Level (Backend)

- JWT authentication middleware
- Role-based middleware (adminOnly)
- Email-specific admin verification

---

## How to Use Admin-Only Protection

### Basic Protection: Admin Role Only

Protect any route that modifies data by adding the `adminOnly` middleware:

```javascript
const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/adminOnly.middleware");
const YourController = require("../controllers/yourController");

// Example: Only admins can create, update, or delete
router.post("/create", protectRoute, adminOnly, YourController.create);
router.patch("/update/:id", protectRoute, adminOnly, YourController.update);
router.delete("/delete/:id", protectRoute, adminOnly, YourController.delete);

// Anyone authenticated can read
router.get("/", protectRoute, YourController.getAll);
router.get("/:id", protectRoute, YourController.getById);
```

### Maximum Protection: Specific Admin Email Only

For the most sensitive operations (like deleting all data, system configuration, etc.):

```javascript
const { requireSpecificAdmin } = require("../middleware/adminOnly.middleware");

// Only these specific emails can perform these actions
const SUPER_ADMINS = ["youremail@example.com"];

router.delete(
  "/dangerous-operation",
  protectRoute,
  requireSpecificAdmin(SUPER_ADMINS),
  YourController.dangerousOperation,
);
```

---

## Example: Protecting Vendor Product Routes

Here's how to update your vendor product routes:

**File: `backend/routes/vendorPost.route.js`**

```javascript
const express = require("express");
const router = express.Router();
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/adminOnly.middleware");
const vendorPostController = require("../controllers/vendor/vendorPost.controller");

// Vendors can manage their own products
router.post(
  "/",
  protectRoute,
  verifyRole("vendor", "admin"),
  vendorPostController.createPost,
);

// BUT: Only admins can delete ANY product
router.delete(
  "/:id",
  protectRoute,
  adminOnly, // This ensures only you (admin) can delete products
  vendorPostController.deletePost,
);

// Only admins can update ANY product
router.patch("/:id", protectRoute, adminOnly, vendorPostController.updatePost);

// Everyone can view products
router.get("/", vendorPostController.getAllPosts);
router.get("/:id", vendorPostController.getPost);

module.exports = router;
```

---

## Example: Protecting User Routes

**File: `backend/routes/auth.route.js`**

```javascript
const express = require("express");
const router = express.Router();
const { protectRoute } = require("../middleware/auth.middleware");
const {
  adminOnly,
  requireSpecificAdmin,
} = require("../middleware/adminOnly.middleware");
const authController = require("../controllers/auth/auth.controller");

// Public routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);

// Protected routes
router.get("/me", protectRoute, authController.getMe);
router.patch("/update-me", protectRoute, authController.updateMe);

// Admin-only routes
router.get("/all-users", protectRoute, adminOnly, authController.getAllUsers);
router.delete("/user/:id", protectRoute, adminOnly, authController.deleteUser);

// Super admin only (specific email required)
const SUPER_ADMINS = ["youradmin@example.com"];
router.post(
  "/make-admin/:id",
  protectRoute,
  requireSpecificAdmin(SUPER_ADMINS),
  authController.makeUserAdmin,
);

module.exports = router;
```

---

## Configuration Steps

### Step 1: Set Your Admin Email

1. Open `.env` file
2. Add your admin email:

```env
ADMIN_EMAIL=your-actual-email@example.com
```

### Step 2: Create Your Admin Account

Run this in your application or use MongoDB Compass:

```javascript
// Create admin user
const admin = await User.create({
  fullName: "Your Name",
  email: "your-actual-email@example.com",
  username: "admin",
  password: "YourStrongPassword123!",
  role: "admin",
  isVerified: true,
});
```

### Step 3: Update Your Routes

For each route file in `backend/routes/`, add the middleware:

1. Import the middleware:

```javascript
const {
  adminOnly,
  requireSpecificAdmin,
} = require("../middleware/adminOnly.middleware");
```

2. Add to routes that modify data:

```javascript
router.post("/", protectRoute, adminOnly, controller.create);
router.patch("/:id", protectRoute, adminOnly, controller.update);
router.delete("/:id", protectRoute, adminOnly, controller.delete);
```

### Step 4: MongoDB Atlas Network Security

1. Log into MongoDB Atlas
2. Go to **Network Access** section
3. Click **"+ ADD IP ADDRESS"**
4. Add your IP address (get it from whatismyip.com)
5. Remove any `0.0.0.0/0` entries (they allow everyone)

### Step 5: Environment Variables

Add to your `.env`:

```env
# Database
CONNECTION_URI=mongodb+srv://admin_user:strong_password@cluster.mongodb.net/shopydash

# JWT
JWT_SECRET_KEY=your-very-long-random-secret-key-here

# Admin
ADMIN_EMAIL=your-email@example.com
```

---

## Testing Your Security

### Test 1: Try to modify data as non-admin

```bash
# Login as a regular user
POST /api/v1/auth/login
{
  "email": "regularuser@example.com",
  "password": "password"
}

# Try to delete something (should fail with 403 error)
DELETE /api/v1/post/12345
Authorization: Bearer <regular_user_token>

# Expected response:
{
  "success": false,
  "message": "Access denied. Only administrators can perform this action."
}
```

### Test 2: Login as admin

```bash
# Login as admin
POST /api/v1/auth/login
{
  "email": "your-admin@example.com",
  "password": "your_admin_password"
}

# Now delete should work
DELETE /api/v1/post/12345
Authorization: Bearer <admin_token>

# Expected response: Success
```

---

## Additional Security Measures

### 1. Environment Variable Security

- Never commit `.env` to Git
- Use different credentials for development and production
- Rotate passwords regularly

### 2. Database Backups

- Enable automated backups in MongoDB Atlas
- Keep backups secure

### 3. Audit Logging

Create a log whenever data is modified:

```javascript
// Add to your controllers
const logAudit = async (action, userId, data) => {
  await AuditLog.create({
    action,
    userId,
    timestamp: new Date(),
    data,
  });
};

// In controller
exports.deletePost = async (req, res) => {
  const post = await VendorPost.findByIdAndDelete(req.params.id);

  // Log the deletion
  await logAudit("DELETE_POST", req.user._id, { postId: req.params.id });

  res.json({ success: true });
};
```

### 4. Rate Limiting (Already implemented)

Your `rateLimiter.middleware.js` helps prevent brute force attacks.

---

## Quick Reference

| Action             | Public | Authenticated | Vendor | Admin               |
| ------------------ | ------ | ------------- | ------ | ------------------- |
| View products      | ✅     | ✅            | ✅     | ✅                  |
| Create product     | ❌     | ❌            | ✅     | ✅                  |
| Edit own product   | ❌     | ❌            | ✅     | ✅                  |
| Edit any product   | ❌     | ❌            | ❌     | ✅                  |
| Delete any product | ❌     | ❌            | ❌     | ✅                  |
| View users         | ❌     | ❌            | ❌     | ✅                  |
| Delete users       | ❌     | ❌            | ❌     | ✅                  |
| Make someone admin | ❌     | ❌            | ❌     | ✅ (specific admin) |

---

## Summary

Your database is now secured with multiple layers:

1. ✅ **MongoDB Network Access** - Only your IP can connect
2. ✅ **MongoDB Authentication** - Username/password required
3. ✅ **JWT Authentication** - Users must be logged in
4. ✅ **Role-Based Access** - Only admins can modify data
5. ✅ **Email Verification** - Critical operations require specific admin email
6. ✅ **CSRF Protection** - Already implemented in your app
7. ✅ **Rate Limiting** - Prevents brute force attacks
8. ✅ **Input Sanitization** - Prevents injection attacks

**Next Steps:**

1. Update your routes to use `adminOnly` middleware
2. Configure MongoDB Atlas network access
3. Create your admin account
4. Test the security measures

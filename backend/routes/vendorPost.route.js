const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createPost,
  getMyPosts,
  getFeedPosts,
  getPostById,
  deletePost,
} = require("../controllers/vendorPost.controller");
const {
  uploadMiddleware,
  uploadImages,
} = require("../controllers/upload.controller");

const router = express.Router();

// Public Routes
router.get("/feed", getFeedPosts);

// Protected Routes (Specific routes must come before dynamic routes like /:postId)
router.get("/my-posts", protectRoute, verifyRole("vendor"), getMyPosts);

router.get("/:postId", getPostById);

// Protected Routes (Vendor Only)
router.use(protectRoute); // Apply auth middleware to all routes below

// Image Upload Route
router.post("/upload", verifyRole("vendor"), uploadMiddleware, uploadImages);

// Post Management Routes
router.post("/", verifyRole("vendor"), createPost);
router.delete("/:postId", verifyRole("vendor"), deletePost);

module.exports = router;

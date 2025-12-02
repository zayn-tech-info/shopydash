const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createPost,
  getMyPosts,
  getFeedPosts,
  getPostById,
  deletePost,
  updatePost,
} = require("../controllers/vendor/vendorPost.controller");
const {
  uploadMiddleware,
  uploadImages,
} = require("../controllers/vendor/upload.controller");

const router = express.Router();

router.use(protectRoute);

router.get("/feed", getFeedPosts);
router.get("/my-posts", verifyRole("vendor"), getMyPosts);
router.post("/upload", verifyRole("vendor"), uploadMiddleware, uploadImages);

router.post("/", verifyRole("vendor"), createPost);

router.get("/:postId", getPostById);
router.patch("/:postId", verifyRole("vendor"), updatePost);
router.delete("/:postId", protectRoute, verifyRole("vendor"), deletePost);

module.exports = router;

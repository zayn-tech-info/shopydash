const express = require("express");
const { protectRoute, verifyRole } = require("../middleware/auth.middleware");
const {
  createPost,
  getMyPosts,
  getFeedPosts,
  getById,
  getProductById,
  remove,
  update,
  searchPosts,
  getFreshProducts,
  getTrendingProducts,
} = require("../controllers/vendor/vendorPost.controller");
const {
  uploadMiddleware,
  uploadImages,
} = require("../controllers/vendor/upload.controller");
const { checkSubscription } = require("../middleware/subscription.middleware");

const vendorPostRouter = express.Router();

vendorPostRouter.get("/feed", getFeedPosts);

vendorPostRouter.get("/search", searchPosts);
vendorPostRouter.get("/fresh", getFreshProducts);
vendorPostRouter.get("/trending", getTrendingProducts);
vendorPostRouter.get("/product/:productId", getProductById);

vendorPostRouter.use(protectRoute);
vendorPostRouter.use(checkSubscription);
vendorPostRouter.get("/my-posts", verifyRole("vendor"), getMyPosts);
vendorPostRouter.post(
  "/upload",
  verifyRole("vendor"),
  uploadMiddleware,
  uploadImages,
);

vendorPostRouter.post("/", verifyRole("vendor"), createPost);

vendorPostRouter
  .route("/:postId")
  .get(getById)
  .patch(verifyRole("vendor"), update)
  .delete(protectRoute, verifyRole("vendor"), remove);

module.exports = vendorPostRouter;

const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const VendorPost = require("../../models/vendorProduct");
const User = require("../../models/auth.model");
const Notification = require("../../models/notification.model");
const { logError, logInfo } = require("../../utils/logger");

const GRIND_PLUS_PLANS = ["Shopydash Pro", "Shopydash Max"];

const requireGrindPlus = (req, res, next) => {
  const plan = req.user.subscriptionPlan;
  if (!plan || !GRIND_PLUS_PLANS.includes(plan)) {
    return next(
      new customError(
        "Deal Flash is available on Shopydash Pro or Shopydash Max. Upgrade to use this feature.",
        403
      )
    );
  }
  next();
};

/**
 * GET /api/v1/post/flash?school=
 * Get all active flash deals for a school (public).
 */
const getFlashDeals = asyncErrorHandler(async (req, res, next) => {
  const { school } = req.query;
  if (!school || typeof school !== "string" || !school.trim()) {
    return next(new customError("Query parameter school is required", 400));
  }

  const now = new Date();
  const posts = await VendorPost.find({
    school: school.trim(),
    "products.dealFlash.active": true,
    "products.dealFlash.expiresAt": { $gt: now },
  })
    .populate("vendorId", "businessName fullName username profilePic")
    .lean();

  const results = posts.map((post) => {
    const flashProducts = (post.products || []).filter(
      (p) => p.dealFlash && p.dealFlash.active && p.dealFlash.expiresAt > now
    );
    return {
      _id: post._id,
      vendorId: post.vendorId,
      school: post.school,
      location: post.location,
      area: post.area,
      flashProducts: flashProducts.map((p) => ({
        _id: p._id,
        title: p.title,
        image: p.image,
        price: p.price,
        dealFlash: p.dealFlash,
        category: p.category,
      })),
      createdAt: post.createdAt,
    };
  });

  res.status(200).json({
    success: true,
    data: results.filter((r) => r.flashProducts.length > 0),
  });
});

/**
 * POST /api/v1/post/:postId/product/:productId/flash
 * Activate Deal Flash (Grind+ only). Body: { dealPrice }.
 */
const activateFlash = asyncErrorHandler(async (req, res, next) => {
  const { postId, productId } = req.params;
  const { dealPrice } = req.body;
  const userId = req.user._id;
  const io = req.app.get("io");

  if (dealPrice == null || typeof dealPrice !== "number" || dealPrice < 0) {
    return next(new customError("Valid dealPrice (number >= 0) is required", 400));
  }

  const post = await VendorPost.findOne({
    _id: postId,
    vendorId: userId,
  });
  if (!post) {
    return next(new customError("Post not found or you are not the owner", 404));
  }

  const product = post.products.id(productId);
  if (!product) {
    return next(new customError("Product not found in this post", 404));
  }

  if (dealPrice >= product.price) {
    return next(
      new customError("Deal price must be less than the original price", 400)
    );
  }

  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

  post.products.id(productId).dealFlash = {
    active: true,
    dealPrice: Number(dealPrice),
    expiresAt,
  };
  await post.save();

  const school = post.school;
  const buyers = await User.find({
    role: "client",
    schoolName: school,
    _id: { $ne: userId },
  })
    .select("_id")
    .lean();

  const productTitle = product.title;
  const message = `Flash deal: ${productTitle} at ₦${Number(dealPrice).toLocaleString()} — 24 hours only!`;

  for (const buyer of buyers) {
    const buyerId = buyer._id.toString();
    try {
      const notification = await Notification.create({
        userId: buyer._id,
        type: "system",
        title: "New flash deal at your school",
        message,
        readStatus: false,
        metadata: { link: "/feed" },
      });
      if (io) {
        io.to(`user:${buyerId}`).emit("notification", { notification });
      }
    } catch (err) {
      logError("FlashDeal", `Notification for buyer ${buyerId}: ${err.message}`);
    }
  }

  logInfo("FlashDeal", `Flash activated for post ${postId} product ${productId}; notified ${buyers.length} buyers`);

  const updated = await VendorPost.findById(postId)
    .populate("vendorId", "businessName fullName username profilePic")
    .lean();
  const productData = (updated.products || []).find(
    (p) => p._id && p._id.toString() === productId
  );

  res.status(200).json({
    success: true,
    message: "Deal Flash activated for 24 hours",
    data: {
      post: updated,
      product: productData,
    },
  });
});

/**
 * DELETE /api/v1/post/:postId/product/:productId/flash
 * Deactivate Deal Flash (Grind+ only).
 */
const deactivateFlash = asyncErrorHandler(async (req, res, next) => {
  const { postId, productId } = req.params;
  const userId = req.user._id;

  const post = await VendorPost.findOne({
    _id: postId,
    vendorId: userId,
  });
  if (!post) {
    return next(new customError("Post not found or you are not the owner", 404));
  }

  const product = post.products.id(productId);
  if (!product) {
    return next(new customError("Product not found in this post", 404));
  }

  product.dealFlash = {
    active: false,
    dealPrice: undefined,
    expiresAt: undefined,
  };
  await post.save();

  const updated = await VendorPost.findById(postId)
    .populate("vendorId", "businessName fullName username profilePic")
    .lean();
  const productData = (updated.products || []).find(
    (p) => p._id && p._id.toString() === productId
  );

  res.status(200).json({
    success: true,
    message: "Deal Flash deactivated",
    data: {
      post: updated,
      product: productData,
    },
  });
});

module.exports = {
  getFlashDeals,
  activateFlash,
  deactivateFlash,
  requireGrindPlus,
};

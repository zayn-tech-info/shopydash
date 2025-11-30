const asyncErrorHandler = require("../errors/asyncErrorHandle");
const customError = require("../errors/customError");
const VendorPost = require("../models/vendorProduct");
const VendorProfile = require("../models/vendorProfile.model");

const createPost = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const vendorProfile = await VendorProfile.findOne({ userId });
  if (!vendorProfile) {
    return next(
      new customError(
        "Vendor profile not found. Please complete your profile first.",
        404
      )
    );
  }

  const { caption, products, school, location } = req.body;
  if (!products || products.length < 4) {
    return next(
      new customError("You must upload at least 4 products per post.", 400)
    );
  }

  const user = await require("../models/auth.model").findById(userId);

  const newPost = await VendorPost.create({
    vendorId: userId,
    caption,
    products,
    school: school || vendorProfile.schoolName || user.schoolName,
    location,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: { post: newPost },
  });
});

const getMyPosts = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  const vendorProfile = await VendorProfile.findOne({ userId });
  if (!vendorProfile) {
    return next(
      new customError(
        "Vendor profile not found. Please complete your profile first.",
        404
      )
    );
  }

  const posts = await VendorPost.find({ vendorId: userId }).sort({
    createdAt: -1,
  });

  res.status(200).json({
    success: true,
    data: { posts },
  });
});

const getFeedPosts = asyncErrorHandler(async (req, res, next) => {
  const { school, page = 1, limit = 10 } = req.query;

  const query = {};
  if (school) {
    query.school = school;
  }

  const posts = await VendorPost.find(query)
    .populate(
      "vendorId",
      "businessName fullName whatsAppNumber phoneNumber username profilePic"
    )
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  const total = await VendorPost.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      posts,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalItems: total,
      },
    },
  });
});

const getPostById = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await VendorPost.findById(postId).populate(
    "vendorId",
    "businessName fullName whatsAppNumber phoneNumber username profilePic"
  );

  if (!post) {
    return next(new customError("Post not found", 404));
  }

  res.status(200).json({
    success: true,
    data: { post },
  });
});

const deletePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const post = await VendorPost.findById(postId);

  if (!post) {
    return next(new customError("Post not found", 404));
  }

  if (post.vendorId.toString() !== userId.toString()) {
    return next(
      new customError("You are not authorized to delete this post", 403)
    );
  }

  await post.deleteOne();

  res.status(200).json({
    success: true,
    message: "Post deleted successfully",
  });
});

module.exports = {
  createPost,
  getMyPosts,
  getFeedPosts,
  getPostById,
  deletePost,
};

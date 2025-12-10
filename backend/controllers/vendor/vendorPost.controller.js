const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const VendorPost = require("../../models/vendorProduct");
const VendorProfile = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");

const createPost = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { caption, products, school, location, state, lga, area } = req.body;

  if (!products || products.length < 4) {
    return next(
      new customError("You must upload at least 4 products per post.", 400)
    );
  } else if (products.length > 6) {
    return next(
      new customError("You can upload at most 6 products per post.", 400)
    );
  }

  // Execute queries in parallel for better performance
  const [vendorProfile, user] = await Promise.all([
    VendorProfile.findOne({ userId }).select("schoolName").lean(),
    User.findById(userId).select("schoolName").lean(),
  ]);

  if (!vendorProfile) {
    return next(
      new customError(
        "Vendor profile not found. Please complete your profile first.",
        404
      )
    );
  }

  const productsWithVendorId = products.map((product) => ({
    ...product,
    vendorId: userId,
  }));

  const newPost = await VendorPost.create({
    vendorId: userId,
    caption,
    products: productsWithVendorId,
    school: school || vendorProfile.schoolName || user.schoolName,
    location,
    state,
    lga,
    area,
  });

  res.status(201).json({
    success: true,
    message: "Post created successfully",
    data: { post: newPost },
  });
});

const getMyPosts = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  // Use lean() and select only _id for faster check
  const vendorProfile = await VendorProfile.findOne({ userId })
    .select("_id")
    .lean();
  if (!vendorProfile) {
    return next(
      new customError(
        "Vendor profile not found. Please complete your profile first.",
        404
      )
    );
  }

  // Use lean() for better performance since we're only reading data
  const posts = await VendorPost.find({ vendorId: userId })
    .sort({ createdAt: -1 })
    .lean();

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

  if (req.query.area) {
    query.area = { $regex: req.query.area, $options: "i" };
  }

  // Text Search Filter (Caption or Product Title)
  if (req.query.search) {
    const searchRegex = { $regex: req.query.search, $options: "i" };
    query.$or = [
      { caption: searchRegex },
      { "products.title": searchRegex },
      { "products.description": searchRegex },
    ];
  }

  if (!school && !req.query.area) {
    if (req.user) {
      if (req.user.state) query.state = req.user.state;
      if (req.user.lga) query.lga = req.user.lga;
    } else if (req.query.state && req.query.lga) {
      query.state = req.query.state;
      query.lga = req.query.lga;
    }
  }

  // Enforce maximum limit to prevent resource exhaustion
  const pageLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page), 1);

  // Use lean() for better performance and execute queries in parallel
  const [posts, total] = await Promise.all([
    VendorPost.find(query)
      .populate(
        "vendorId",
        "businessName fullName whatsAppNumber phoneNumber username profilePic logo"
      )
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),
    VendorPost.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    data: {
      posts,
      pagination: {
        currentPage,
        totalPages: Math.ceil(total / pageLimit),
        totalItems: total,
      },
    },
  });
});

const getFeedPost = asyncErrorHandler(async (req, res, next) => {
  /*   const { school, page = 1, limit = 10 } = req.query;

  const query = {};
  if (school) {
    query.school = school;
  } */

  // Enforce maximum limit to prevent resource exhaustion
  /*   const pageLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page), 1); */

  // Use lean() for better performance and execute queries in parallel
  const [posts, total] = await Promise.all([
    VendorPost.find(query).populate(
      "vendorId",
      "businessName fullName whatsAppNumber phoneNumber username profilePic logo"
    ),
    /*       .sort({ createdAt: -1 })
      .skip((currentPage - 1) * pageLimit)
      .limit(pageLimit)
      .lean(),
    VendorPost.countDocuments(query), */
  ]);

  res.status(200).json({
    success: true,
    data: {
      posts,
      pagination: {
        currentPage,
        totalPages: Math.ceil(total / pageLimit),
        totalItems: total,
      },
    },
  });
});

const getPostById = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  // Use lean() for better performance
  const post = await VendorPost.findById(postId)
    .populate(
      "vendorId",
      "businessName fullName whatsAppNumber phoneNumber username profilePic"
    )
    .lean();

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

  // Use lean() and select only _id for faster check
  const vendor = await VendorProfile.findOne({ userId }).select("_id").lean();
  if (!vendor) {
    const error = new customError("Vendor not found", 404);
    return next(error);
  }

  // Use select to only fetch necessary fields for authorization check
  const post = await VendorPost.findById(postId).select("vendorId");

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

const updatePost = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;
  const { caption, products, location, state, lga, area } = req.body;

  const post = await VendorPost.findById(postId);

  if (!post) {
    return next(new customError("Post not found", 404));
  }

  if (post.vendorId.toString() !== userId.toString()) {
    return next(
      new customError("You are not authorized to update this post", 403)
    );
  }

  if (products && products.length < 4) {
    return next(
      new customError("You must have at least 4 products in a post.", 400)
    );
  }

  post.caption = caption || post.caption;
  post.location = location || post.location;
  post.state = state || post.state;
  post.lga = lga || post.lga;
  post.area = area || post.area;
  if (products) {
    post.products = products.map((p) => ({ ...p, vendorId: userId }));
  }

  await post.save();

  res.status(200).json({
    success: true,
    message: "Post updated successfully",
    data: { post },
  });
});

const searchPosts = asyncErrorHandler(async (req, res, next) => {
  const { search, school, area, page = 1, limit = 20 } = req.query;

  const pageLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page), 1);
  const skip = (currentPage - 1) * pageLimit;

  // Build the aggregation pipeline
  const pipeline = [];

  // Stage 1: Match Posts by School and Area
  const matchStage = {};
  if (school) matchStage.school = school;
  if (area) matchStage.area = { $regex: area, $options: "i" };

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Stage 2: Unwind Products to filter them individually
  pipeline.push({ $unwind: "$products" });

  // Stage 3: Match Product Title (if search text is provided)
  if (search) {
    pipeline.push({
      $match: {
        "products.title": { $regex: search, $options: "i" },
      },
    });
  }

  // Stage 4: Sort by creation date (newest first)
  pipeline.push({ $sort: { createdAt: -1 } });

  // Stage 5: Pagination (Skip and Limit)
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: pageLimit });

  // Stage 6: Lookup Vendor Details
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "vendorId",
      foreignField: "_id",
      as: "vendor",
    },
  });

  // Stage 7: Unwind Vendor array
  pipeline.push({
    $unwind: {
      path: "$vendor",
      preserveNullAndEmptyArrays: true, // Keep products even if vendor lookup fails (though unlikely)
    },
  });

  // Stage 8: Project the final structure
  pipeline.push({
    $project: {
      _id: "$products._id", // Product ID becomes the main ID
      title: "$products.title",
      price: "$products.price",
      image: "$products.image",
      description: "$products.description",
      condition: "$products.condition",
      category: "$products.category",
      postId: "$_id", // Reference to the parent post
      postedAt: "$createdAt",
      school: "$school",
      area: "$area",
      location: "$location",
      vendor: {
        _id: "$vendor._id",
        businessName: "$vendor.businessName",
        username: "$vendor.username",
        profilePic: "$vendor.profilePic",
        logo: "$vendor.logo",
        phoneNumber: "$vendor.phoneNumber",
        whatsAppNumber: "$vendor.whatsAppNumber",
      },
    },
  });

  const products = await VendorPost.aggregate(pipeline);

  // Optional: Get total count for pagination (simplified, separate count query might be needed for perfect pagination)
  // For now, we return the results.

  res.status(200).json({
    success: true,
    data: {
      products,
      page: currentPage,
      limit: pageLimit,
    },
  });
});

module.exports = {
  createPost,
  getMyPosts,
  getFeedPosts,
  getPostById,
  deletePost,
  updatePost,
  searchPosts,
};

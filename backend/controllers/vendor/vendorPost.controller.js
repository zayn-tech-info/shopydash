const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const VendorPost = require("../../models/vendorProduct");
const VendorProfile = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");
const { createSafeRegex } = require("../../utils/regex");

const createPost = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { caption, products, school, location, state, area } = req.body;

  const limitConfig = req.subscription?.config?.limits || {
    productsPerPost: 4,
    postPerDay: 3,
  };

  const MIN_PRODUCTS = 3;

  if (!products || products.length < MIN_PRODUCTS) {
    return next(
      new customError(
        `You must upload at least ${MIN_PRODUCTS} product per post.`,
        400
      )
    );
  }

  if (products.length > limitConfig.productsPerPost) {
    return next(
      new customError(
        `Your plan allows max ${limitConfig.productsPerPost} products per post. Upgrade to add more.`,
        400
      )
    );
  }

  // Check Photo Limits
  if (limitConfig.maxPhotosPerProduct) {
    for (const p of products) {
      if (p.images && p.images.length > limitConfig.maxPhotosPerProduct) {
        return next(
          new customError(
            `Your plan allows max ${limitConfig.maxPhotosPerProduct} photos per product. Upgrade to add more.`,
            400
          )
        );
      }
    }
  }

  // Check Post Per Day Limit
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const postsToday = await VendorPost.countDocuments({
    vendorId: userId,
    createdAt: { $gte: startOfDay },
  });

  if (postsToday >= limitConfig.postPerDay) {
    return next(
      new customError(
        `You have reached your daily post limit of ${limitConfig.postPerDay}. Upgrade to post more.`,
        400
      )
    );
  }

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
    query.area = createSafeRegex(req.query.area);
  }

  if (req.query.search) {
    const searchRegex = createSafeRegex(req.query.search);
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

  const pageLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page), 1);

  const [posts, total] = await Promise.all([
    VendorPost.find(query)
      .populate(
        "vendorId",
        "businessName fullName whatsAppNumber phoneNumber username profilePic logo subscriptionPlan"
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

const getById = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

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

const remove = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;
  const userId = req.user._id;

  const vendor = await VendorProfile.findOne({ userId }).select("_id").lean();
  if (!vendor) {
    const error = new customError("Vendor not found", 404);
    return next(error);
  }

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

const update = asyncErrorHandler(async (req, res, next) => {
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

  const pipeline = [];

  const matchStage = {};
  if (school) matchStage.school = school;
  if (area) matchStage.area = createSafeRegex(area);

  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  pipeline.push({ $unwind: "$products" });

  if (search) {
    pipeline.push({
      $match: {
        "products.title": createSafeRegex(search),
      },
    });
  }

  // Stage 4: Lookup Subscription for Global Priority sorting
  pipeline.push({
    $lookup: {
      from: "subscriptions",
      let: { vendorId: "$vendorId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$user", "$$vendorId"] },
                { $eq: ["$status", "active"] },
                { $gt: ["$endDate", new Date()] },
              ],
            },
          },
        },
      ],
      as: "subscription",
    },
  });

  pipeline.push({
    $addFields: {
      subscription: { $arrayElemAt: ["$subscription", 0] },
    },
  });

  pipeline.push({
    $addFields: {
      priorityScore: {
        $switch: {
          branches: [
            { case: { $eq: ["$subscription.plan", "Vendly Max"] }, then: 30 },
            { case: { $eq: ["$subscription.plan", "Vendly Pro"] }, then: 20 },
            { case: { $eq: ["$subscription.plan", "Vendly Boost"] }, then: 10 },
          ],
          default: 0,
        },
      },
    },
  });

  // Stage 5: Sort by Priority then Creation Date
  pipeline.push({ $sort: { priorityScore: -1, createdAt: -1 } });

  // Stage 6: Pagination (Skip and Limit)
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: pageLimit });

  // Stage 7: Lookup Vendor Details
  pipeline.push({
    $lookup: {
      from: "users",
      localField: "vendorId",
      foreignField: "_id",
      as: "vendor",
    },
  });

  // Stage 8: Unwind Vendor array
  pipeline.push({
    $unwind: {
      path: "$vendor",
      preserveNullAndEmptyArrays: true,
    },
  });

  // Stage 9: Project the final structure
  pipeline.push({
    $project: {
      _id: "$products._id",
      title: "$products.title",
      price: "$products.price",
      image: "$products.image",
      description: "$products.description",
      condition: "$products.condition",
      category: "$products.category",
      postId: { $toString: "$_id" },
      postedAt: "$createdAt",
      school: "$school",
      area: "$area",
      location: "$location",
      isBoosted: { $gt: ["$priorityScore", 0] }, // Flag for frontend if needed
      vendor: {
        _id: "$vendor._id",
        businessName: "$vendor.businessName",
        username: "$vendor.username",
        profilePic: "$vendor.profilePic",
        logo: "$vendor.logo",
        phoneNumber: "$vendor.phoneNumber",
        whatsAppNumber: "$vendor.whatsAppNumber",
        subscriptionPlan: "$vendor.subscriptionPlan",
      },
    },
  });

  const products = await VendorPost.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: {
      products,
      page: currentPage,
      limit: pageLimit,
    },
  });
});

const getFreshProducts = asyncErrorHandler(async (req, res, next) => {
  const { limit = 8 } = req.query;
  const pageLimit = Math.min(parseInt(limit), 20);

  const AdayAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);

  const pipeline = [
    {
      $match: {
        createdAt: { $gte: AdayAgo },
      },
    },

    { $unwind: "$products" },

    {
      $lookup: {
        from: "vendorprofiles",
        localField: "vendorId",
        foreignField: "userId",
        as: "vendorProfile",
      },
    },
    {
      $unwind: {
        path: "$vendorProfile",
        preserveNullAndEmptyArrays: false,
      },
    },

    {
      $match: {
        "vendorProfile.rating": { $gte: 0 },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendorUser",
      },
    },
    {
      $unwind: {
        path: "$vendorUser",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $sort: { createdAt: -1 } },

    { $limit: pageLimit },

    {
      $project: {
        _id: "$products._id",
        title: "$products.title",
        price: "$products.price",
        image: "$products.image",
        description: "$products.description",
        vendorPostId: { $toString: "$_id" },
        vendorId: "$vendorId",
        postedAt: "$createdAt",
        rating: "$vendorProfile.rating",
        vendor: {
          businessName: "$vendorUser.businessName",
          username: "$vendorUser.username",
          profilePic: "$vendorUser.profilePic",
          subscriptionPlan: "$vendorUser.subscriptionPlan",
        },
      },
    },
  ];

  const products = await VendorPost.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: { products },
  });
});

const getTrendingProducts = asyncErrorHandler(async (req, res, next) => {
  const { limit = 20 } = req.query;
  const pageLimit = Math.min(parseInt(limit), 20);

  const pipeline = [
    { $unwind: "$products" },

    {
      $lookup: {
        from: "vendorprofiles",
        localField: "vendorId",
        foreignField: "userId",
        as: "vendorProfile",
      },
    },
    {
      $unwind: {
        path: "$vendorProfile",
        preserveNullAndEmptyArrays: false,
      },
    },

    {
      $match: {
        "vendorProfile.rating": { $gte: 2 },
      },
    },

    {
      $lookup: {
        from: "users",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendorUser",
      },
    },
    {
      $unwind: {
        path: "$vendorUser",
        preserveNullAndEmptyArrays: true,
      },
    },

    { $sort: { likes: -1, "vendorProfile.rating": -1 } },

    { $limit: pageLimit },

    {
      $project: {
        _id: "$products._id",
        title: "$products.title",
        price: "$products.price",
        image: "$products.image",
        description: "$products.description",
        vendorPostId: { $toString: "$_id" },
        vendorId: "$vendorId",
        postedAt: "$createdAt",
        rating: "$vendorProfile.rating",
        likes: "$likes",
        vendor: {
          businessName: "$vendorUser.businessName",
          username: "$vendorUser.username",
          profilePic: "$vendorUser.profilePic",
          subscriptionPlan: "$vendorUser.subscriptionPlan",
        },
      },
    },
  ];

  const products = await VendorPost.aggregate(pipeline);

  res.status(200).json({
    success: true,
    data: { products },
  });
});

module.exports = {
  createPost,
  getMyPosts,
  getFeedPosts,
  getById,
  remove,
  update,
  searchPosts,
  getFreshProducts,
  getTrendingProducts,
};

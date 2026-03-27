const mongoose = require("mongoose");
const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const VendorPost = require("../../models/vendorProduct");
const VendorProfile = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");
const { createSafeRegex, escapeRegex } = require("../../utils/regex");
const plans = require("../../config/subscriptionPlans");

const createPost = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { products, school, location, state, area } = req.body;

  const limitConfig = req.subscription?.config?.limits || plans.free.limits;

  if (!products || products.length < 1) {
    return next(
      new customError(`You must upload at least 1 product per post.`, 400),
    );
  }

  if (products.length > limitConfig.productsPerPost) {
    return next(
      new customError(
        `Your plan allows max ${limitConfig.productsPerPost} products per post. Upgrade to add more.`,
        400,
      ),
    );
  }

  const twelveHoursAgo = new Date(Date.now() - 12 * 60 * 60 * 1000);

  const [vendorProfile, user] = await Promise.all([
    VendorProfile.findOne({ userId }).select("schoolName").lean(),
    User.findById(userId).select("schoolName").lean(),
  ]);

  if (!vendorProfile) {
    return next(
      new customError(
        "Vendor profile not found. Please complete your profile first.",
        404,
      ),
    );
  }

  const productsWithVendorId = products.map((product) => ({
    ...product,
    vendorId: userId,
  }));

  const newPost = await VendorPost.create({
    vendorId: userId,
    products: productsWithVendorId,
    school: school || vendorProfile.schoolName || user.schoolName,
    location,
    state,

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
        404,
      ),
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
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const matchStage = {};
  if (school) matchStage.school = school;
  if (req.query.area) matchStage.area = createSafeRegex(req.query.area);
  if (req.query.search) {
    const searchRegex = createSafeRegex(req.query.search);
    matchStage.$or = [
      { "products.title": searchRegex },
      { "products.description": searchRegex },
    ];
  }

  const pageLimit = Math.min(parseInt(limit) || 10, 50);
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const skip = (currentPage - 1) * pageLimit;

  // Buyer's location — used for proximity scoring (null if not logged in)
  const buyerSchool = req.user?.schoolName?.trim() || null;
  const buyerArea = (req.user?.schoolArea || req.user?.area)?.trim() || null;

  // Proximity expression: 2 = same area, 1 = same school, 0 = other/not logged in
  const proximityExpr =
    buyerArea || buyerSchool
      ? {
          $cond: [
            buyerArea
              ? {
                  $regexMatch: {
                    input: { $ifNull: ["$area", ""] },
                    regex: escapeRegex(buyerArea),
                    options: "i",
                  },
                }
              : false,
            2,
            {
              $cond: [
                buyerSchool ? { $eq: ["$school", buyerSchool] } : false,
                1,
                0,
              ],
            },
          ],
        }
      : 0;

  const pipeline = [
    ...(Object.keys(matchStage).length ? [{ $match: matchStage }] : []),

    // Social proof — resolve vendor profile ID for review/order lookups
    {
      $lookup: {
        from: "vendorprofiles",
        localField: "vendorId",
        foreignField: "userId",
        as: "vendorProfileDoc",
      },
    },
    {
      $addFields: {
        vendorProfileId: { $arrayElemAt: ["$vendorProfileDoc._id", 0] },
      },
    },

    // Aggregate review stats per vendor
    {
      $lookup: {
        from: "reviews",
        let: { vpId: "$vendorProfileId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$vendor", "$$vpId"] } } },
          {
            $group: {
              _id: null,
              avgRating: { $avg: "$rating" },
              reviewCount: { $sum: 1 },
            },
          },
        ],
        as: "reviewStats",
      },
    },

    // Count paid orders in the last 7 days per vendor
    {
      $lookup: {
        from: "orders",
        let: { vpId: "$vendorProfileId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$vendor", "$$vpId"] },
                  { $gte: ["$createdAt", sevenDaysAgo] },
                  { $eq: ["$paymentStatus", "paid"] },
                ],
              },
            },
          },
          { $count: "count" },
        ],
        as: "weeklyOrdersArr",
      },
    },

    {
      $addFields: {
        ratingAvg: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.avgRating", 0] }, 0],
        },
        reviewCount: {
          $ifNull: [{ $arrayElemAt: ["$reviewStats.reviewCount", 0] }, 0],
        },
        weeklyOrders: {
          $ifNull: [{ $arrayElemAt: ["$weeklyOrdersArr.count", 0] }, 0],
        },
        proximityScore: proximityExpr,
      },
    },

    { $sort: { proximityScore: -1, createdAt: -1 } },
    { $skip: skip },
    { $limit: pageLimit },

    // Populate vendor user (mirrors .populate("vendorId", "..."))
    {
      $lookup: {
        from: "users",
        localField: "vendorId",
        foreignField: "_id",
        as: "_vendorUser",
      },
    },
    {
      $addFields: {
        vendorId: {
          $let: {
            vars: { u: { $arrayElemAt: ["$_vendorUser", 0] } },
            in: {
              _id: "$$u._id",
              businessName: "$$u.businessName",
              fullName: "$$u.fullName",
              phoneNumber: "$$u.phoneNumber",
              username: "$$u.username",
              profilePic: "$$u.profilePic",
              subscriptionPlan: "$$u.subscriptionPlan",
              isVerified: "$$u.isVerified",
            },
          },
        },
      },
    },

    // Remove internal pipeline fields (exclusion-only — no mixed include/exclude)
    {
      $project: {
        vendorProfileDoc: 0,
        vendorProfileId: 0,
        reviewStats: 0,
        weeklyOrdersArr: 0,
        proximityScore: 0,
        _vendorUser: 0,
      },
    },
  ];

  const [posts, total] = await Promise.all([
    VendorPost.aggregate(pipeline),
    VendorPost.countDocuments(matchStage),
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

const getFeedProducts = asyncErrorHandler(async (req, res, next) => {
  const { school, page = 1, limit = 100 } = req.query;
  const pageLimit = Math.min(Math.max(parseInt(limit, 10) || 100, 1), 100);
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (currentPage - 1) * pageLimit;

  const query = {};
  if (school) query.school = school;
  if (req.query.area) query.area = createSafeRegex(req.query.area);
  if (req.query.search) {
    const searchRegex = createSafeRegex(req.query.search);
    query.$or = [
      { "products.title": searchRegex },
      { "products.description": searchRegex },
    ];
  }

  const pipeline = [
    { $match: query },
    { $sort: { createdAt: -1 } },
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
      $unwind: { path: "$vendorProfile", preserveNullAndEmptyArrays: true },
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
      $unwind: { path: "$vendorUser", preserveNullAndEmptyArrays: true },
    },
    { $sort: { createdAt: -1 } },
    { $skip: skip },
    { $limit: pageLimit + 1 },
    {
      $project: {
        _id: "$products._id",
        title: "$products.title",
        price: "$products.price",
        image: "$products.image",
        images: "$products.images",
        description: "$products.description",
        vendorPostId: { $toString: "$_id" },
        vendorId: "$vendorId",
        createdAt: "$createdAt",
        rating: { $ifNull: ["$vendorProfile.rating", 0] },
        vendor: {
          _id: "$vendorId",
          businessName: "$vendorUser.businessName",
          username: "$vendorUser.username",
          profilePic: "$vendorUser.profilePic",
          subscriptionPlan: "$vendorUser.subscriptionPlan",
          isVerified: "$vendorUser.isVerified",
        },
      },
    },
  ];

  const raw = await VendorPost.aggregate(pipeline);
  const hasMore = raw.length > pageLimit;
  const products = hasMore ? raw.slice(0, pageLimit) : raw;

  res.status(200).json({
    success: true,
    data: {
      products,
      page: currentPage,
      hasMore,
    },
  });
});

const getFeedProductsRandom = asyncErrorHandler(async (req, res, next) => {
  const { school, category } = req.query;
  const body = req.body || {};
  let excludedIds = Array.isArray(body.excludedIds) ? body.excludedIds : [];
  const limit = Math.min(Math.max(parseInt(body.limit, 10) || 100, 1), 100);

  const query = {};
  if (school) query.school = school;
  if (req.query.area) query.area = createSafeRegex(req.query.area);
  if (category && typeof category === "string" && category.trim()) {
    query["products.category"] = category.trim();
  }
  if (req.query.search) {
    const searchRegex = createSafeRegex(req.query.search);
    query.$or = [
      { "products.title": searchRegex },
      { "products.description": searchRegex },
    ];
  }

  const excludedObjectIds = excludedIds
    .filter((id) => id && mongoose.Types.ObjectId.isValid(id))
    .map((id) => new mongoose.Types.ObjectId(id));

  const countPipeline = [
    { $match: query },
    { $unwind: "$products" },
    { $count: "total" },
  ];

  const samplePipeline = [{ $match: query }, { $unwind: "$products" }];
  if (query["products.category"]) {
    samplePipeline.push({
      $match: { "products.category": query["products.category"] },
    });
  }
  if (excludedObjectIds.length > 0) {
    samplePipeline.push({
      $match: { "products._id": { $nin: excludedObjectIds } },
    });
  }
  samplePipeline.push({ $sample: { size: limit } });
  samplePipeline.push({
    $lookup: {
      from: "vendorprofiles",
      localField: "vendorId",
      foreignField: "userId",
      as: "vendorProfile",
    },
  });
  samplePipeline.push({
    $unwind: { path: "$vendorProfile", preserveNullAndEmptyArrays: true },
  });
  samplePipeline.push({
    $lookup: {
      from: "users",
      localField: "vendorId",
      foreignField: "_id",
      as: "vendorUser",
    },
  });
  samplePipeline.push({
    $unwind: { path: "$vendorUser", preserveNullAndEmptyArrays: true },
  });
  samplePipeline.push({
    $project: {
      _id: "$products._id",
      title: "$products.title",
      price: "$products.price",
      image: "$products.image",
      images: "$products.images",
      description: "$products.description",
      vendorPostId: { $toString: "$_id" },
      vendorId: "$vendorId",
      createdAt: "$createdAt",
      rating: { $ifNull: ["$vendorProfile.rating", 0] },
      vendor: {
        _id: "$vendorId",
        businessName: "$vendorUser.businessName",
        username: "$vendorUser.username",
        profilePic: "$vendorUser.profilePic",
        subscriptionPlan: "$vendorUser.subscriptionPlan",
        isVerified: "$vendorUser.isVerified",
      },
    },
  });

  const [countResult, products] = await Promise.all([
    VendorPost.aggregate(countPipeline).then((r) => (r[0] ? r[0].total : 0)),
    VendorPost.aggregate(samplePipeline),
  ]);

  const total = typeof countResult === "number" ? countResult : 0;

  res.status(200).json({
    success: true,
    data: {
      products,
      total,
    },
  });
});

const getById = asyncErrorHandler(async (req, res, next) => {
  const { postId } = req.params;

  const post = await VendorPost.findById(postId)
    .populate(
      "vendorId",
      "businessName fullName phoneNumber username profilePic isVerified",
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

const getProductById = asyncErrorHandler(async (req, res, next) => {
  const { productId } = req.params;
  const mongoose = require("mongoose");
  const isValidObjectId =
    mongoose.Types.ObjectId.isValid(productId) &&
    String(new mongoose.Types.ObjectId(productId)) === productId;

  const matchStage = isValidObjectId
    ? [
        { $match: { "products._id": new mongoose.Types.ObjectId(productId) } },
        { $unwind: "$products" },
        { $match: { "products._id": new mongoose.Types.ObjectId(productId) } },
      ]
    : [
        { $match: { "products.slug": productId } },
        { $unwind: "$products" },
        { $match: { "products.slug": productId } },
      ];

  const pipeline = [
    ...matchStage,
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
    {
      $project: {
        _id: "$products._id",
        title: "$products.title",
        price: "$products.price",
        image: "$products.image",
        description: "$products.description",
        condition: "$products.condition",
        category: "$products.category",
        vendorPostId: { $toString: "$_id" },
        vendorId: "$vendorId",
        postedAt: "$createdAt",
        school: "$school",
        location: "$location",
        area: "$area",
        state: "$state",
        vendor: {
          _id: "$vendorUser._id",
          businessName: "$vendorUser.businessName",
          username: "$vendorUser.username",
          profilePic: "$vendorUser.profilePic",
          phoneNumber: "$vendorUser.phoneNumber",
          subscriptionPlan: "$vendorUser.subscriptionPlan",
          isVerified: "$vendorUser.isVerified",
        },
      },
    },
  ];

  const result = await VendorPost.aggregate(pipeline);

  if (!result || result.length === 0) {
    return next(new customError("Product not found", 404));
  }

  res.status(200).json({
    success: true,
    data: { product: result[0] },
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
      new customError("You are not authorized to delete this post", 403),
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
  const { products, location, state, area } = req.body;

  const post = await VendorPost.findById(postId);

  if (!post) {
    return next(new customError("Post not found", 404));
  }

  if (post.vendorId.toString() !== userId.toString()) {
    return next(
      new customError("You are not authorized to update this post", 403),
    );
  }

  if (products && products.length < 1) {
    return next(
      new customError("You must have at least 1 product in a post.", 400),
    );
  }

  post.location = location || post.location;
  post.state = state || post.state;

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

const searchPosts = asyncErrorHandler(async (req, res) => {
  const rawSearch =
    typeof req.query.search === "string" ? req.query.search.trim() : "";
  const { school, area, page = 1, limit = 50, excludedIds = [] } = req.query;

  const pageSize = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
  const currentPage = Math.max(parseInt(page, 10) || 1, 1);
  const skip = (currentPage - 1) * pageSize;

  const baseMatch = {};
  if (school) baseMatch.school = school;
  if (area) baseMatch.area = createSafeRegex(area);

  const searchRegex = rawSearch ? createSafeRegex(rawSearch) : null;

  let excludeObjectIds = [];
  if (excludedIds) {
    const rawIds = Array.isArray(excludedIds)
      ? excludedIds
      : typeof excludedIds === "string"
        ? excludedIds.split(",")
        : [];

    excludeObjectIds = rawIds
      .map((id) => {
        try {
          return new mongoose.Types.ObjectId(id.trim());
        } catch (error) {
          return null;
        }
      })
      .filter(Boolean);
  }

  const pipeline = [];
  if (Object.keys(baseMatch).length > 0) {
    pipeline.push({ $match: baseMatch });
  }

  pipeline.push({ $unwind: "$products" });

  if (excludeObjectIds.length > 0) {
    pipeline.push({
      $match: {
        "products._id": { $nin: excludeObjectIds },
      },
    });
  }

  pipeline.push({
    $lookup: {
      from: "users",
      localField: "vendorId",
      foreignField: "_id",
      as: "vendorUser",
    },
  });
  pipeline.push({
    $unwind: { path: "$vendorUser", preserveNullAndEmptyArrays: true },
  });

  if (searchRegex) {
    pipeline.push({
      $addFields: {
        titleMatch: {
          $regexMatch: {
            input: { $ifNull: ["$products.title", ""] },
            regex: searchRegex.$regex,
            options: searchRegex.$options,
          },
        },
        vendorMatch: {
          $regexMatch: {
            input: {
              $trim: {
                input: {
                  $concat: [
                    { $ifNull: ["$vendorUser.businessName", ""] },
                    " ",
                    { $ifNull: ["$vendorUser.username", ""] },
                    " ",
                    { $ifNull: ["$vendorUser.fullName", ""] },
                  ],
                },
              },
            },
            regex: searchRegex.$regex,
            options: searchRegex.$options,
          },
        },
      },
    });

    pipeline.push({
      $match: {
        $or: [{ titleMatch: true }, { vendorMatch: true }],
      },
    });

    pipeline.push({
      $addFields: {
        matchPriority: {
          $cond: [{ $eq: ["$titleMatch", true] }, 0, 1],
        },
      },
    });
  } else {
    pipeline.push({
      $addFields: {
        matchPriority: 0,
      },
    });
  }

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
      planWeight: {
        $switch: {
          branches: [
            { case: { $eq: ["$subscription.plan", "Shopydash Max"] }, then: 3 },
            { case: { $eq: ["$subscription.plan", "Shopydash Pro"] }, then: 2 },
            {
              case: { $eq: ["$subscription.plan", "Shopydash Boost"] },
              then: 1,
            },
          ],
          default: 0,
        },
      },
    },
  });

  pipeline.push({
    $sort: {
      matchPriority: 1,
      planWeight: -1,
      createdAt: -1,
    },
  });

  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: pageSize + 1 });

  pipeline.push({
    $project: {
      _id: "$products._id",
      title: "$products.title",
      price: "$products.price",
      image: "$products.image",
      images: "$products.images",
      description: "$products.description",
      condition: "$products.condition",
      category: "$products.category",
      postId: { $toString: "$_id" },
      postedAt: "$createdAt",
      school: "$school",
      area: "$area",
      location: "$location",
      isBoosted: { $gt: ["$planWeight", 0] },
      vendor: {
        _id: "$vendorUser._id",
        businessName: "$vendorUser.businessName",
        username: "$vendorUser.username",
        profilePic: "$vendorUser.profilePic",
        phoneNumber: "$vendorUser.phoneNumber",
        subscriptionPlan: "$vendorUser.subscriptionPlan",
      },
    },
  });

  const results = await VendorPost.aggregate(pipeline);
  const hasMore = results.length > pageSize;
  const products = hasMore ? results.slice(0, pageSize) : results;

  res.status(200).json({
    success: true,
    data: {
      products,
      page: currentPage,
      limit: pageSize,
      hasMore,
    },
  });
});

const getFreshProducts = asyncErrorHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  const pageLimit = Math.min(parseInt(limit), 20);

  const pipeline = [
    { $sort: { createdAt: -1 } },

    { $unwind: "$products" },

    // Give each vendor one slot (their most recent post/product)
    { $sort: { createdAt: -1 } },
    {
      $group: {
        _id: "$vendorId",
        doc: { $first: "$$ROOT" },
      },
    },
    { $replaceRoot: { newRoot: "$doc" } },

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
        preserveNullAndEmptyArrays: true,
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
        images: "$products.images",
        description: "$products.description",
        vendorPostId: { $toString: "$_id" },
        vendorId: "$vendorId",
        postedAt: "$createdAt",
        rating: { $ifNull: ["$vendorProfile.rating", 0] },
        vendor: {
          businessName: "$vendorUser.businessName",
          username: "$vendorUser.username",
          profilePic: "$vendorUser.profilePic",
          subscriptionPlan: "$vendorUser.subscriptionPlan",
          isVerified: "$vendorUser.isVerified",
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
  const { limit = 10 } = req.query;
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
          isVerified: "$vendorUser.isVerified",
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
  getFeedProducts,
  getFeedProductsRandom,
  getById,
  getProductById,
  remove,
  update,
  searchPosts,
  getFreshProducts,
  getTrendingProducts,
};

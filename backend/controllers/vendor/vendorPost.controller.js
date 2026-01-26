const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const VendorPost = require("../../models/vendorProduct");
const VendorProfile = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");
const { createSafeRegex } = require("../../utils/regex");
const plans = require("../../config/subscriptionPlans");

const createPost = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;
  const { caption, products, school, location, state, area } = req.body;

  const limitConfig = req.subscription?.config?.limits || plans.free.limits;

  if (!products || products.length < 4) {
    return next(
      new customError(`You must upload at least 4 products per post.`, 400),
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

  const postsLast12Hours = await VendorPost.countDocuments({
    vendorId: userId,
    createdAt: { $gte: twelveHoursAgo },
  });

  if (postsLast12Hours >= limitConfig.postsPer12Hours) {
    return next(
      new customError(
        `You have reached your limit of ${limitConfig.postsPer12Hours} posts every 12 hours. Upgrade to post more.`,
        400,
      ),
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
    caption,
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
      if (req.user.area) query.area = req.user.area;
    } else if (req.query.state && req.query.area) {
      query.state = req.query.state;
      query.area = req.query.area;
    }
  }

  const pageLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page), 1);

  const [posts, total] = await Promise.all([
    VendorPost.find(query)
      .populate(
        "vendorId",
        "businessName fullName whatsAppNumber phoneNumber username profilePic logo subscriptionPlan",
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
      "businessName fullName whatsAppNumber phoneNumber username profilePic",
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
  const { caption, products, location, state, area } = req.body;

  const post = await VendorPost.findById(postId);

  if (!post) {
    return next(new customError("Post not found", 404));
  }

  if (post.vendorId.toString() !== userId.toString()) {
    return next(
      new customError("You are not authorized to update this post", 403),
    );
  }

  if (products && products.length < 4) {
    return next(
      new customError("You must have at least 4 products in a post.", 400),
    );
  }

  post.caption = caption || post.caption;
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

const searchPosts = asyncErrorHandler(async (req, res, next) => {
  const {
    search,
    school,
    area,
    page = 1,
    limit = 50,
    excludedIds = [],
  } = req.query;

  // Limits
  const totalLimit = Math.min(parseInt(limit), 50); // User asked for 35-50 products max initial
  const premiumConfig = {
    targetRatio: 0.7, // 70%
    get count() {
      return Math.round(totalLimit * this.targetRatio);
    },
  };
  const standardCount = totalLimit - premiumConfig.count;

  const baseMatch = {};
  if (school) baseMatch.school = school;
  if (area) baseMatch.area = createSafeRegex(area);

  // Exclude already loaded IDs
  let excludeArray = [];
  if (excludedIds) {
    if (Array.isArray(excludedIds)) excludeArray = excludedIds;
    else if (typeof excludedIds === "string")
      excludeArray = excludedIds.split(",");
  }

  // Ensure we exclude IDs at the product level.
  // Since vendorPost contains an array of products, filtering is complex.
  // We unwind first, then match.

  // Helper to build pipeline
  const buildPipeline = (isPremium) => {
    const pipe = [];

    // 1. Match basics (VendorPost level)
    if (Object.keys(baseMatch).length > 0) {
      pipe.push({ $match: baseMatch });
    }

    // 2. Unwind products
    pipe.push({ $unwind: "$products" });

    // 3. Match Search in Products
    if (search) {
      pipe.push({
        $match: {
          "products.title": createSafeRegex(search),
        },
      });
    }

    // 4. Exclude IDs (Product ID level)
    if (excludeArray.length > 0) {
      const objectIds = excludeArray
        .map((id) => {
          try {
            return new mongoose.Types.ObjectId(id);
          } catch (e) {
            return null;
          }
        })
        .filter(Boolean);

      if (objectIds.length > 0) {
        pipe.push({
          $match: {
            "products._id": { $nin: objectIds },
          },
        });
      }
    }

    // 5. Lookup Subscription
    pipe.push({
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

    pipe.push({
      $addFields: { subscription: { $arrayElemAt: ["$subscription", 0] } },
    });

    // 6. Filter by Plan Type
    const premiumPlans = ["Shopydash Max", "Shopydash Pro", "Shopydash Boost"];
    if (isPremium) {
      pipe.push({
        $match: {
          "subscription.plan": { $in: premiumPlans },
        },
      });
      // Sort priority for premiums?
      // User said "show them up... analytics should show them up".
      // Let's sort by randomized weight or just recent?
      // "Max" > "Pro" > "Boost".
      pipe.push({
        $addFields: {
          planWeight: {
            $switch: {
              branches: [
                {
                  case: { $eq: ["$subscription.plan", "Shopydash Max"] },
                  then: 3,
                },
                {
                  case: { $eq: ["$subscription.plan", "Shopydash Pro"] },
                  then: 2,
                },
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
      pipe.push({ $sort: { planWeight: -1, createdAt: -1 } });
    } else {
      pipe.push({
        $match: {
          "subscription.plan": { $nin: premiumPlans },
        },
      });
      pipe.push({ $sort: { createdAt: -1 } });
    }

    // 7. Limit
    pipe.push({ $limit: isPremium ? premiumConfig.count : standardCount });

    // 8. Lookup Vendor Details
    pipe.push({
      $lookup: {
        from: "users",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendor",
      },
    });
    pipe.push({
      $unwind: { path: "$vendor", preserveNullAndEmptyArrays: true },
    });

    // 9. Project
    pipe.push({
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
        isBoosted: isPremium, // or based on score
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

    return pipe;
  };

  const [premiumPosts, standardPosts] = await Promise.all([
    VendorPost.aggregate(buildPipeline(true)),
    VendorPost.aggregate(buildPipeline(false)),
  ]);

  // Interleave logic: P, P, S, P, P, S... to maintain flow?
  // Or just concat?
  // User said "show up 70% in UI".
  // A simple concat (Premium First) satisfies "Premium users show up".
  // But strictly interleaving is better UI.
  // Let's do simple chunks. 2 Premium, 1 Standard...

  const merged = [];
  const maxLen = Math.max(premiumPosts.length, standardPosts.length);

  // Strategy: Fill with premium as much as possible, sprinkle standard.
  // Actually, standard concat is fine if we fetched in ratio.
  // But let's shuffle slightly to make it look "organic" if desired.
  // For now, I will concat them to ensure Premiums are seeing their value (top of list).
  // But wait, if I put all 35 premiums then 15 standards, the user sees mostly premium. That matches "70%".

  const products = [...premiumPosts, ...standardPosts];

  // Final safeguard: uniqueness?
  // We used $nin excludedIds, so we are safe from provided duplicates.
  // Within this batch? distinct IDs.

  res.status(200).json({
    success: true,
    data: {
      products,
      page: parseInt(page),
      limit: parseInt(limit),
      // No total pages calc here because dynamic mix implies infinite stream
      hasMore: products.length >= parseInt(limit), // Approximate
    },
  });
});

const getFreshProducts = asyncErrorHandler(async (req, res, next) => {
  const { limit = 10 } = req.query;
  const pageLimit = Math.min(parseInt(limit), 20);

  const pipeline = [
    { $sort: { createdAt: -1 } },
    { $unwind: "$products" },
    {
      $group: {
        _id: "$vendorId",
        doc: { $first: "$$ROOT" },
      },
    },
    {
      $replaceRoot: { newRoot: "$doc" },
    },
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

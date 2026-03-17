const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const VendorPost = require("../../models/vendorProduct");
const VendorProfile = require("../../models/vendorProfile.model");
const User = require("../../models/auth.model");
const { createSafeRegex } = require("../../utils/regex");
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

  // NOTE: Previously, we enforced a per-12-hours post limit using
  // limitConfig.postsPer12Hours and VendorPost.countDocuments here.
  // This restriction has been intentionally removed so that all vendors
  // can create an unlimited number of posts for now.

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
      { "products.title": searchRegex },
      { "products.description": searchRegex },
    ];
  }

  const pageLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page), 1);
  const skip = (currentPage - 1) * pageLimit;

  // Near Me Discovery: when buyer has location, score by proximity (same area = 2, same school = 1, other = 0), then sort by createdAt
  const buyerSchool =
    (req.user && req.user.schoolName && req.user.schoolName.trim()) || null;
  const buyerArea =
    (req.user &&
      (req.user.schoolArea || req.user.area) &&
      (req.user.schoolArea || req.user.area).trim()) ||
    null;
  const buyerSchoolLower = buyerSchool ? buyerSchool.toLowerCase() : null;
  const buyerAreaLower = buyerArea ? buyerArea.toLowerCase() : null;
  const useProximitySort = !!(buyerSchoolLower || buyerAreaLower);

  if (useProximitySort) {
    const matchStage = { $match: query };
    const lookupVendorProfileStage = {
      $lookup: {
        from: "vendorprofiles",
        localField: "vendorId",
        foreignField: "userId",
        as: "vendorProfileDoc",
      },
    };
    const addFieldsVendorProfileIdStage = {
      $addFields: {
        vendorProfileId: { $arrayElemAt: ["$vendorProfileDoc._id", 0] },
      },
    };
    const lookupReviewsStage = {
      $lookup: {
        from: "reviews",
        let: { vendorProfileId: "$vendorProfileId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$vendor", "$$vendorProfileId"] } } },
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
    };
    const lookupOrdersStage = {
      $lookup: {
        from: "orders",
        let: { vendorProfileId: "$vendorProfileId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$vendor", "$$vendorProfileId"] },
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
    };
    const addFieldsSocialProofStage = {
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
      },
    };
    const addFieldsStage = {
      $addFields: {
        proximityScore: {
          $switch: {
            branches: [
              {
                case: {
                  $and: [
                    buyerAreaLower !== null,
                    {
                      $eq: [
                        { $toLower: { $ifNull: ["$area", ""] } },
                        buyerAreaLower,
                      ],
                    },
                  ],
                },
                then: 2,
              },
              {
                case: {
                  $and: [
                    buyerSchoolLower !== null,
                    {
                      $eq: [
                        { $toLower: { $ifNull: ["$school", ""] } },
                        buyerSchoolLower,
                      ],
                    },
                  ],
                },
                then: 1,
              },
            ],
            default: 0,
          },
        },
      },
    };
    const sortStage = { $sort: { proximityScore: -1, createdAt: -1 } };
    const skipStage = { $skip: skip };
    const limitStage = { $limit: pageLimit };
    const lookupStage = {
      $lookup: {
        from: "users",
        localField: "vendorId",
        foreignField: "_id",
        as: "vendorId",
        pipeline: [
          {
            $project: {
              businessName: 1,
              fullName: 1,
              phoneNumber: 1,
              username: 1,
              profilePic: 1,
              subscriptionPlan: 1,
              isVerified: 1,
            },
          },
        ],
      },
    };
    const unwindStage = {
      $unwind: {
        path: "$vendorId",
        preserveNullAndEmptyArrays: true,
      },
    };
    const projectStage = {
      $project: {
        proximityScore: 0,
        vendorProfileDoc: 0,
        reviewStats: 0,
        weeklyOrdersArr: 0,
        vendorProfileId: 0,
        ratingAvg: 1,
        reviewCount: 1,
        weeklyOrders: 1,
      },
    };

    const facetPipeline = [
      matchStage,
      {
        $facet: {
          total: [{ $count: "count" }],
          posts: [
            lookupVendorProfileStage,
            addFieldsVendorProfileIdStage,
            lookupReviewsStage,
            lookupOrdersStage,
            addFieldsSocialProofStage,
            addFieldsStage,
            sortStage,
            skipStage,
            limitStage,
            lookupStage,
            unwindStage,
            projectStage,
          ],
        },
      },
    ];

    const result = await VendorPost.aggregate(facetPipeline);
    const totalCount =
      result[0] && result[0].total && result[0].total[0]
        ? result[0].total[0].count
        : 0;
    const posts = result[0] && result[0].posts ? result[0].posts : [];

    return res.status(200).json({
      success: true,
      data: {
        posts,
        pagination: {
          currentPage,
          totalPages: Math.ceil(totalCount / pageLimit),
          totalItems: totalCount,
        },
      },
    });
  }

  // Non-proximity path: aggregation with social proof (ratingAvg, reviewCount, weeklyOrders)
  const nonProximityMatch = { $match: query };
  const nonProximityLookupVendorProfile = {
    $lookup: {
      from: "vendorprofiles",
      localField: "vendorId",
      foreignField: "userId",
      as: "vendorProfileDoc",
    },
  };
  const nonProximityAddVendorProfileId = {
    $addFields: {
      vendorProfileId: { $arrayElemAt: ["$vendorProfileDoc._id", 0] },
    },
  };
  const nonProximityLookupReviews = {
    $lookup: {
      from: "reviews",
      let: { vendorProfileId: "$vendorProfileId" },
      pipeline: [
        { $match: { $expr: { $eq: ["$vendor", "$$vendorProfileId"] } } },
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
  };
  const nonProximityLookupOrders = {
    $lookup: {
      from: "orders",
      let: { vendorProfileId: "$vendorProfileId" },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ["$vendor", "$$vendorProfileId"] },
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
  };
  const nonProximityAddSocialProof = {
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
    },
  };
  const nonProximitySort = { $sort: { createdAt: -1 } };
  const nonProximitySkip = { $skip: skip };
  const nonProximityLimit = { $limit: pageLimit };
  const nonProximityLookupUsers = {
    $lookup: {
      from: "users",
      localField: "vendorId",
      foreignField: "_id",
      as: "vendorId",
      pipeline: [
        {
          $project: {
            businessName: 1,
            fullName: 1,
            phoneNumber: 1,
            username: 1,
            profilePic: 1,
            subscriptionPlan: 1,
            isVerified: 1,
          },
        },
      ],
    },
  };
  const nonProximityUnwind = {
    $unwind: {
      path: "$vendorId",
      preserveNullAndEmptyArrays: true,
    },
  };
  const nonProximityProject = {
    $project: {
      vendorProfileDoc: 0,
      reviewStats: 0,
      weeklyOrdersArr: 0,
      vendorProfileId: 0,
      ratingAvg: 1,
      reviewCount: 1,
      weeklyOrders: 1,
    },
  };

  const nonProximityFacet = [
    nonProximityMatch,
    {
      $facet: {
        total: [{ $count: "count" }],
        posts: [
          nonProximityLookupVendorProfile,
          nonProximityAddVendorProfileId,
          nonProximityLookupReviews,
          nonProximityLookupOrders,
          nonProximityAddSocialProof,
          nonProximitySort,
          nonProximitySkip,
          nonProximityLimit,
          nonProximityLookupUsers,
          nonProximityUnwind,
          nonProximityProject,
        ],
      },
    },
  ];

  const nonProximityResult = await VendorPost.aggregate(nonProximityFacet);
  const total =
    nonProximityResult[0]?.total?.[0]?.count ?? 0;
  const posts = nonProximityResult[0]?.posts ?? [];

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

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return next(new customError("Invalid product ID format", 400));
  }

  const pipeline = [
    { $match: { "products._id": new mongoose.Types.ObjectId(productId) } },
    { $unwind: "$products" },
    { $match: { "products._id": new mongoose.Types.ObjectId(productId) } },
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

const searchPosts = asyncErrorHandler(async (req, res, next) => {
  const {
    search,
    school,
    area,
    page = 1,
    limit = 50,
    excludedIds = [],
  } = req.query;
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const totalLimit = Math.min(parseInt(limit), 50);
  const currentPage = Math.max(parseInt(page) || 1, 1);
  const premiumConfig = {
    targetRatio: 0.7,
    get count() {
      return Math.round(totalLimit * this.targetRatio);
    },
  };
  const standardCount = totalLimit - premiumConfig.count;
  const premiumSkip = (currentPage - 1) * premiumConfig.count;
  const standardSkip = (currentPage - 1) * standardCount;

  const baseMatch = {};
  if (school) baseMatch.school = school;
  if (area) baseMatch.area = createSafeRegex(area);

  let excludeArray = [];
  if (excludedIds) {
    if (Array.isArray(excludedIds)) excludeArray = excludedIds;
    else if (typeof excludedIds === "string")
      excludeArray = excludedIds.split(",");
  }

  const buildPipeline = (isPremium) => {
    const pipe = [];

    if (Object.keys(baseMatch).length > 0) {
      pipe.push({ $match: baseMatch });
    }

    pipe.push({ $unwind: "$products" });

    if (search) {
      pipe.push({
        $match: {
          "products.title": createSafeRegex(search),
        },
      });
    }

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

    // Social proof: vendor rating, review count, 7-day order count
    pipe.push({
      $lookup: {
        from: "vendorprofiles",
        localField: "vendorId",
        foreignField: "userId",
        as: "vendorProfileDoc",
      },
    });
    pipe.push({
      $addFields: {
        vendorProfileId: { $arrayElemAt: ["$vendorProfileDoc._id", 0] },
      },
    });
    pipe.push({
      $lookup: {
        from: "reviews",
        let: { vendorProfileId: "$vendorProfileId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$vendor", "$$vendorProfileId"] } } },
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
    });
    pipe.push({
      $lookup: {
        from: "orders",
        let: { vendorProfileId: "$vendorProfileId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$vendor", "$$vendorProfileId"] },
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
    });
    pipe.push({
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
      },
    });

    const premiumPlans = ["Shopydash Max", "Shopydash Pro", "Shopydash Boost"];
    if (isPremium) {
      pipe.push({
        $match: {
          "subscription.plan": { $in: premiumPlans },
        },
      });

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

    const skip = isPremium ? premiumSkip : standardSkip;
    const limitCount = isPremium ? premiumConfig.count : standardCount;
    pipe.push({ $skip: skip });
    pipe.push({ $limit: limitCount });

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
        isBoosted: isPremium,
        ratingAvg: 1,
        reviewCount: 1,
        weeklyOrders: 1,
        vendor: {
          _id: "$vendor._id",
          businessName: "$vendor.businessName",
          username: "$vendor.username",
          profilePic: "$vendor.profilePic",
          phoneNumber: "$vendor.phoneNumber",
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

  const merged = [];
  const maxLen = Math.max(premiumPosts.length, standardPosts.length);

  const products = [...premiumPosts, ...standardPosts];

  res.status(200).json({
    success: true,
    data: {
      products,
      page: currentPage,
      limit: totalLimit,
      hasMore: products.length >= totalLimit,
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
  getById,
  getProductById,
  remove,
  update,
  searchPosts,
  getFreshProducts,
  getTrendingProducts,
};

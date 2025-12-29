const clientProfileSchema = require("../../models/clientProfile.model");
const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const User = require("../../models/auth.model");
const vendorProfileSchema = require("../../models/vendorProfile.model");
const VendorPost = require("../../models/vendorProduct");

const get = asyncErrorHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username }).lean();

  if (!user) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  let profile;
  let profileKey;

  if (user.role === "vendor") {
    const [vendorProfile, posts] = await Promise.all([
      vendorProfileSchema
        .findOne({ userId: user._id })
        .populate(
          "userId",
          "businessName username email phoneNumber whatsAppNumber schoolName profilePic subscriptionPlan city state country schoolArea area"
        )
        .lean(),
      VendorPost.find({ vendorId: user._id })
        .select("products")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

    profile = vendorProfile;

    if (profile && posts.length > 0) {
      const allProducts = posts.reduce((acc, post) => {
        const productsWithPostId = (post.products || []).map((p) => ({
          ...p,
          vendorPostId: post._id,
        }));
        return acc.concat(productsWithPostId);
      }, []);

      profile.products = allProducts;
    }

    profileKey = "vendorProfile";
  } else {
    profile = await clientProfileSchema
      .findOne({ userId: user._id })
      .populate(
        "userId",
        "fullName username email phoneNumber schoolName profilePic city state country schoolArea area"
      )
      .lean();
    profileKey = "clientProfile";
  }

  if (!profile) {
    const err = new customError("Profile not found", 404);
    return next(err);
  }

  res.status(200).json({
    success: true,
    data: {
      [profileKey]: profile,
    },
  });
});

module.exports = { get };

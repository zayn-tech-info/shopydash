const clientProfileSchema = require("../../models/clientProfile.model");
const asyncErrorHandler = require("../../errors/asyncErrorHandle");
const customError = require("../../errors/customError");
const User = require("../../models/auth.model");

const vendorProfileSchema = require("../../models/vendorProfile.model");
const VendorPost = require("../../models/vendorProduct");

const getProfile = asyncErrorHandler(async (req, res, next) => {
  const { username } = req.params;

  const user = await User.findOne({ username });

  if (!user) {
    const error = new customError("User not found", 404);
    return next(error);
  }

  let profile;
  let profileKey;

  if (user.role === "vendor") {
    profile = await vendorProfileSchema
      .findOne({ userId: user._id })
      .populate(
        "userId",
        "businessName username email phoneNumber whatsAppNumber schoolName logo isVerified"
      )
      .lean();

    if (profile) {
      const posts = await VendorPost.find({ vendorId: user._id })
        .sort({ createdAt: -1 })
        .lean();

      const allProducts = posts.reduce((acc, post) => {
        return acc.concat(post.products || []);
      }, []);

      profile.products = allProducts;
    }

    profileKey = "vendorProfile";
  } else {
    profile = await clientProfileSchema
      .findOne({ userId: user._id })
      .populate(
        "userId",
        "fullName username email phoneNumber schoolName profilePic"
      );
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

module.exports = { getProfile };

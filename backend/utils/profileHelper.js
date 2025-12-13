const ClientProfile = require("../models/clientProfile.model");
const VendorProfile = require("../models/vendorProfile.model");

const checkUserHasProfile = async (user) => {
  if (!user || !user._id || !user.role) {
    return false;
  }

  try {
    if (user.role === "client") {
      const profile = await ClientProfile.findOne({ userId: user._id })
        .select("_id")
        .lean();
      return !!profile;
    } else if (user.role === "vendor") {
      const profile = await VendorProfile.findOne({ userId: user._id })
        .select("_id")
        .lean();
      return !!profile;
    }
    return false;
  } catch (error) {
    return false;
  }
};

module.exports = { checkUserHasProfile };

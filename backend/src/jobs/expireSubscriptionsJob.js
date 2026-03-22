const Subscription = require("../models/subscription.model");
const User = require("../models/auth.model");
const VendorProfile = require("../models/vendorProfile.model");
const { logInfo, logError } = require("../utils/logger");

const runExpireSubscriptionsJob = async () => {
  const now = new Date();

  const expiredSubs = await Subscription.find({
    status: "active",
    endDate: { $lt: now },
  });

  if (expiredSubs.length === 0) {
    logInfo("ExpireSubscriptionsJob", "No subscriptions to expire");
    return;
  }

  for (const sub of expiredSubs) {
    try {
      sub.status = "expired";
      await sub.save();

      await User.findByIdAndUpdate(sub.user, {
        subscriptionPlan: "Free",
        isSubscriptionActive: false,
        subscriptionExpiresAt: null,
      });

      await VendorProfile.findOneAndUpdate(
        { userId: sub.user },
        { isVerified: false },
      );

      logInfo("ExpireSubscriptionsJob", `Expired subscription for user ${sub.user}`);
    } catch (err) {
      logError("ExpireSubscriptionsJob", err);
    }
  }

  logInfo("ExpireSubscriptionsJob", `Processed ${expiredSubs.length} expired subscription(s)`);
};

module.exports = { runExpireSubscriptionsJob };

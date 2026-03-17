const Subscription = require("../models/subscription.model");
const plans = require("../config/subscriptionPlans");

const checkSubscription = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  try {
    const sub = await Subscription.findOne({
      user: req.user._id,
      status: "active",
      endDate: { $gt: new Date() },
    });

    if (sub) {
      const planKey = Object.keys(plans).find(
        (key) => plans[key].name === sub.plan
      );
      if (planKey) {
        req.subscription = {
          ...sub.toObject(),
          config: plans[planKey],
        };
      }
    } else {
      req.subscription = null;
    }
    next();
  } catch (error) {
    console.error("Subscription Check Error", error);
    next();
  }
};

module.exports = { checkSubscription };

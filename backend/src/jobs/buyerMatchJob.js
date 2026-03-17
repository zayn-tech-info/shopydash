const VendorPost = require("../models/vendorProduct");
const ClientProfile = require("../models/clientProfile.model");
const Notification = require("../models/notification.model");
const { logError, logInfo } = require("../utils/logger");
const { sendBuyerMatchSummaryEmail } = require("../utils/email");

const runBuyerMatchJob = async (io) => {
  try {
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newPosts = await VendorPost.find({ createdAt: { $gte: since } }).lean();

    const allCategories = new Set();
    for (const post of newPosts) {
      if (post.products && Array.isArray(post.products)) {
        for (const p of post.products) {
          if (p.category) allCategories.add(p.category);
        }
      }
    }
    const categories = [...allCategories];
    if (categories.length === 0) {
      logInfo("BuyerMatchJob", "No new posts or categories in last 24h, skipping.");
      return;
    }

    const clientProfiles = await ClientProfile.find({
      preferredCategory: { $in: categories },
    })
      .populate("userId", "fullName email")
      .lean();

    const userMap = new Map();
    for (const profile of clientProfiles) {
      if (!profile.userId || !profile.userId._id) continue;
      const userId = profile.userId._id.toString();
      const preferred = profile.preferredCategory || [];
      const matchedCategories = preferred.filter((c) => categories.includes(c));
      if (matchedCategories.length === 0) continue;
      if (!userMap.has(userId)) {
        userMap.set(userId, {
          userId,
          matchedCategories: new Set(matchedCategories),
          email: profile.userId.email,
          fullName: profile.userId.fullName || "there",
        });
      } else {
        matchedCategories.forEach((c) => userMap.get(userId).matchedCategories.add(c));
      }
    }

    const feedLink =
      process.env.FRONTEND_URL || process.env.APP_URL || "https://app.shopydash.com/feed";

    for (const [, data] of userMap) {
      const matchedList = [...data.matchedCategories];
      const message =
        matchedList.length === 1
          ? `New ${matchedList[0]} items are available.`
          : `New items in ${matchedList.join(", ")} are available.`;

      const notification = await Notification.create({
        userId: data.userId,
        type: "system",
        title: "New listings match your interests",
        message,
        readStatus: false,
        metadata: { link: "/feed" },
      });

      if (io) {
        io.to(`user:${data.userId}`).emit("notification", { notification });
      }

      if (data.email) {
        sendBuyerMatchSummaryEmail(
          data.email,
          data.fullName,
          {
            categoryCount: matchedList.length,
            categories: matchedList,
            feedLink,
          }
        ).catch((err) => {
          logError("BuyerMatchJob", `Summary email failed for ${data.userId}: ${err.message}`);
        });
      }
    }

    logInfo(
      "BuyerMatchJob",
      `Matched ${userMap.size} buyers for ${categories.length} categories from ${newPosts.length} posts.`
    );
  } catch (err) {
    logError("BuyerMatchJob", err);
    throw err;
  }
};

module.exports = { runBuyerMatchJob };

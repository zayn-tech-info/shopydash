const VendorPost = require("../models/vendorProduct");
const { logError, logInfo } = require("../utils/logger");

/**
 * Find all posts with products that have dealFlash.active true and
 * dealFlash.expiresAt < now; set those products' dealFlash.active to false.
 */
const runExpireFlashDealsJob = async () => {
  try {
    const now = new Date();
    const result = await VendorPost.updateMany(
      {
        "products.dealFlash.active": true,
        "products.dealFlash.expiresAt": { $lt: now },
      },
      {
        $set: {
          "products.$[elem].dealFlash.active": false,
        },
      },
      {
        arrayFilters: [
          {
            "elem.dealFlash.active": true,
            "elem.dealFlash.expiresAt": { $lt: now },
          },
        ],
      }
    );

    if (result.modifiedCount > 0) {
      logInfo("ExpireFlashDealsJob", `Expired flash deals in ${result.modifiedCount} post(s)`);
    }
  } catch (err) {
    logError("ExpireFlashDealsJob", err);
    throw err;
  }
};

module.exports = { runExpireFlashDealsJob };

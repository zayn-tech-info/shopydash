const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    action: {
      type: String,
      required: true,
      enum: [
        "vendor_suspended",
        "vendor_activated",
        "vendor_approved",
        "vendor_kyc_approved",
        "vendor_kyc_rejected",
        "user_banned",
        "user_unbanned",
        "user_role_changed",
        "order_cancelled",
        "order_status_updated",
        "refund_issued",
        "subscription_activated",
        "subscription_cancelled",
        "subscription_changed",
        "review_deleted",
        "settings_changed",
      ],
      index: true,
    },
    targetType: {
      type: String,
      required: true,
      enum: ["user", "vendor", "order", "subscription", "review", "settings"],
    },
    targetId: {
      type: String,
      required: true,
    },
    details: {
      type: String,
      maxlength: 500,
    },
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL
activityLogSchema.index({ action: 1, createdAt: -1 });

module.exports = mongoose.model("ActivityLog", activityLogSchema);

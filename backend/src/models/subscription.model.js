const mongoose = require("mongoose");

const plans = require("../config/subscriptionPlans");

const subscriptionSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    plan: {
      type: String,
      required: [true, "Please select a plan"],
      enum: Object.values(plans).map((p) => p.name),
    },
    status: {
      type: String,
      enum: ["active", "expired", "cancelled"],
      default: "active",
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    startDate: {
      type: Date,
      required: true,
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: true,
      index: true,
    },
    paystackAuthCode: {
      type: String,
    },
    paystackReference: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

subscriptionSchema.index({ user: 1, status: 1, endDate: 1 });

module.exports = mongoose.model("Subscription", subscriptionSchema);

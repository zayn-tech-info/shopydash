const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    buyer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorProfile",
      required: true,
      index: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "VendorPost",
          required: true,
        },
        title: String,
        image: String,
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
        price: {
          type: Number,
          required: true,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    platformFee: {
      type: Number,
      required: true,
      comment: "The 5% commission held by platform",
    },
    vendorAmount: {
      type: Number,
      required: true,
      comment: "The 95% share to be transferred to vendor",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "refunded"],
      default: "pending",
      index: true,
    },
    deliveryStatus: {
      type: String,
      enum: ["pending", "delivered", "cancelled"],
      default: "pending",
      index: true,
    },
    payoutStatus: {
      type: String,
      enum: ["held", "released", "cancelled"],
      default: "held",
    },
    transactionReference: {
      type: String,
      required: true,
      index: true,
    },
    deliveryAddress: {
      address: String,
      city: String,
      state: String,
      phone: String,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ vendor: 1, createdAt: -1 });
orderSchema.index({ transactionReference: 1 }, { unique: true });

module.exports = mongoose.model("Order", orderSchema);

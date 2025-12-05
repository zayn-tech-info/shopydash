const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  vendorPostId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "vendorPost",
  },
  vendorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    default: 1,
    min: 1,
  },
  school: String,
  location: String,
  hostelName: String,
});

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
  }
);

cartSchema.pre("save", function (next) {
  this.totalPrice = this.items.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );
  next();
});

module.exports = mongoose.model("Cart", cartSchema);

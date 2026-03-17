const Review = require("../models/review.model");
const Order = require("../models/order.model");
const VendorProfile = require("../models/vendorProfile.model");
const customError = require("../errors/customError");

const createReview = async (req, res, next) => {
  try {
    const { orderId, rating, comment, vendorId } = req.body;
    const userId = req.user._id;

    if (!orderId || !rating || !vendorId) {
      return next(new customError("Please provide all required fields", 400));
    }

    if (rating < 1 || rating > 5) {
      return next(new customError("Rating must be between 1 and 5", 400));
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return next(new customError("Order not found", 404));
    }

    if (order.buyer.toString() !== userId.toString()) {
      return next(
        new customError("You are not authorized to review this order", 403)
      );
    }

    if (order.vendor.toString() !== vendorId) {
      return next(new customError("Order does not belong to this vendor", 400));
    }

    if (order.deliveryStatus !== "delivered") {
      return next(new customError("You can only review delivered orders", 400));
    }

    const userVendorProfile = await VendorProfile.findOne({ userId: userId });
    if (userVendorProfile && userVendorProfile._id.toString() === vendorId) {
      return next(new customError("You cannot review your own store", 403));
    }

    const existingReview = await Review.findOne({ order: orderId });
    if (existingReview) {
      return next(new customError("You have already reviewed this order", 400));
    }

    const review = await Review.create({
      reviewer: userId,
      vendor: vendorId,
      order: orderId,
      rating,
      comment,
    });

    const vendor = await VendorProfile.findById(vendorId);
    
    if (!vendor) {
      return next(new customError("Vendor profile not found", 404));
    }

    const currentNumReviews = vendor.numReviews || 0;
    const currentRating = vendor.rating || 0;

    const newNumReviews = currentNumReviews + 1;
    const newRating =
      (currentRating * currentNumReviews + rating) / newNumReviews;

    vendor.rating = newRating;
    vendor.numReviews = newNumReviews;

    await vendor.save();

    res.status(201).json({
      success: true,
      message: "Review submitted successfully",
      data: review,
    });
  } catch (error) {
    next(error);
  }
};

const getVendorReviews = async (req, res, next) => {
  try {
    const { vendorId } = req.params;

    const reviews = await Review.find({ vendor: vendorId })
      .populate("reviewer", "fullName profilePic") 
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createReview,
  getVendorReviews,
};

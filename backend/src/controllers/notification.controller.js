const Notification = require("../models/notification.model");
const { logError } = require("../utils/logger");

const getNotifications = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("metadata.orderId", "_id totalAmount items");

    const total = await Notification.countDocuments({ userId });
    const unreadCount = await Notification.countDocuments({
      userId,
      readStatus: false,
    });

    res.status(200).json({
      success: true,
      data: notifications,
      meta: {
        page,
        limit,
        total,
        unreadCount,
      },
    });
  } catch (error) {
    logError("Get Notifications", error);
    res.status(500).json({ message: "Failed to fetch notifications" });
  }
};

const markAsRead = async (req, res) => {
  try {
    const userId = req.user._id;
    const { notificationId } = req.body;

    if (notificationId) {
      
      await Notification.findOneAndUpdate(
        { _id: notificationId, userId },
        { readStatus: true }
      );
    } else {
      
      await Notification.updateMany({ userId }, { readStatus: true });
    }

    res.status(200).json({ success: true, message: "Marked as read" });
  } catch (error) {
    logError("Mark Notifications Read", error);
    res.status(500).json({ message: "Failed to update notification status" });
  }
};

module.exports = { getNotifications, markAsRead };

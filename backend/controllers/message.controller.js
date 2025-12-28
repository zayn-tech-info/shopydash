const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/auth.model");
const VendorProfile = require("../models/vendorProfile.model");
const customError = require("../errors/customError");
const asyncErrorHandler = require("../errors/asyncErrorHandle");
const plans = require("../config/subscriptionPlans");


const hasPremiumMessaging = (vendorUser) => {
  if (!vendorUser.subscriptionPlan) return false;

  const plan = Object.values(plans).find(
    (p) => p.name === vendorUser.subscriptionPlan
  );
  return plan?.features?.messaging || false;
};

exports.checkMessagingAccess = asyncErrorHandler(async (req, res, next) => {
  const { recipientId } = req.body;

  if (!recipientId) {
    return next(new customError("Recipient ID is required", 400));
  }

  const recipient = await User.findById(recipientId);
  if (!recipient) {
    return next(new customError("Recipient not found", 404));
  }
  if (recipient.role === "vendor") {
    const isPremium = hasPremiumMessaging(recipient);

    if (!isPremium) {
      return res.status(200).json({
        status: "success",
        action: "Redirect WhatsApp",
        message: "This vendor uses WhatsApp for communication.",
        data: {
          whatsAppNumber: recipient.whatsAppNumber,
        },
      });
    }
  }


  if (req.user.role === "vendor") {
    const isSenderPremium = hasPremiumMessaging(req.user);
    if (!isSenderPremium) {
      return next(
        new customError("Upgrade your plan to use internal messaging.", 403)
      );
    }
  }

  req.recipient = recipient;
  next();
});

exports.initiateOrGetConversation = asyncErrorHandler(async (req, res, next) => {
  const { recipientId } = req.body;
  const senderId = req.user.id;

  let conversation = await Conversation.findOne({
    participants: { $all: [senderId, recipientId] },
  });

  if (!conversation) {
    conversation = await Conversation.create({
      participants: [senderId, recipientId],
      unreadCounts: {
        [senderId]: 0,
        [recipientId]: 0,
      },
    });
  }

  
  await conversation.populate(
    "participants",
    "fullName profilePic role businessName"
  );

  res.status(200).json({
    status: "success",
    data: {
      conversation,
    },
  });
});

exports.sendMessage = catchAsync(async (req, res, next) => {
  const { conversationId, content, replyTo } = req.body;
  const senderId = req.user.id;

  const conversation = await Conversation.findById(conversationId);
  if (!conversation) {
    return next(new customError("Conversation not found", 404));
  }

  // Create message
  const message = await Message.create({
    conversationId,
    sender: senderId,
    content,
    replyTo: replyTo || null,
  });

  // Update conversation
  conversation.lastMessage = message._id;
  // Increment unread count for the OTHER participant(s)
  conversation.participants.forEach((pId) => {
    if (pId.toString() !== senderId) {
      const currentCount = conversation.unreadCounts.get(pId.toString()) || 0;
      conversation.unreadCounts.set(pId.toString(), currentCount + 1);
    }
  });

  conversation.markModified("unreadCounts");
  await conversation.save();

  await message.populate("sender", "fullName profilePic");
  if (replyTo) {
    await message.populate("replyTo");
  }

  // NOTE: Socket.io emission will happen in the route/server layer or we can import io here if we structure it right.
  // For now, we return the data, and the frontend will handle the "optimistic" UI,
  // but ideally we want real-time.
  // We will handle socket emission in the route wrapper or a separate service.

  // Emit real-time event
  const io = req.app.get("io");
  if (io) {
    // Emit to the conversation room (for open chat windows)
    io.to(conversationId).emit("receive_message", message);

    // Emit to the recipient's personal room (for notifications/list updates)
    conversation.participants.forEach((pId) => {
      if (pId.toString() !== senderId) {
        io.to(pId.toString()).emit("conversation_updated", {
          conversationId: conversation._id,
          lastMessage: message,
          unreadCount: conversation.unreadCounts.get(pId.toString()),
        });
      }
    });
  }

  res.status(201).json({
    status: "success",
    data: {
      message,
    },
  });
});

exports.getConversations = catchAsync(async (req, res, next) => {
  const userId = req.user.id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "fullName profilePic role businessName")
    .populate("lastMessage")
    .sort({ updatedAt: -1 });

  res.status(200).json({
    status: "success",
    results: conversations.length,
    data: {
      conversations,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user.id;

  // Optional: pagination
  const page = req.query.page * 1 || 1;
  const limit = req.query.limit * 1 || 50;
  const skip = (page - 1) * limit;

  const messages = await Message.find({ conversationId })
    .populate("sender", "fullName profilePic")
    .populate("replyTo")
    .sort({ createdAt: -1 }) // Newest first for infinite scroll
    .skip(skip)
    .limit(limit);

  // Mark as read for the current user
  // We can do this asynchronously
  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    conversation.unreadCounts.set(userId, 0);
    conversation.markModified("unreadCounts");
    await conversation.save();
  }

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages: messages.reverse(), // Send back in chronological order for rendering if needed, or keep reverse for flex-col-reverse
    },
  });
});

exports.getAvailableVendorsForChat = catchAsync(async (req, res, next) => {
  const { schoolId, _id: currentUserId } = req.user;

  // Find vendors in the same school who are Pro or Max
  const vendors = await User.find({
    role: "vendor",
    schoolId: schoolId,
    subscriptionPlan: {
      $in: ["Vendora Pro", "Vendora Max"],
    },
    _id: { $ne: currentUserId }, // Exclude self
  }).select("fullName businessName profilePic subscriptionPlan schoolName");

  res.status(200).json({
    status: "success",
    results: vendors.length,
    data: {
      vendors,
    },
  });
});

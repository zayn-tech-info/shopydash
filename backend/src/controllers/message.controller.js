const Conversation = require("../models/conversation.model");
const Message = require("../models/message.model");
const User = require("../models/auth.model");
const VendorProfile = require("../models/vendorProfile.model");
const customError = require("../errors/customError");
const asyncErrorHandler = require("../errors/asyncErrorHandle");
const plans = require("../config/subscriptionPlans");
const DOMPurify = require("isomorphic-dompurify");

const hasPremiumMessaging = (vendorUser) => {
  if (!vendorUser.subscriptionPlan) return false;

  const plan = Object.values(plans).find(
    (p) => p.name === vendorUser.subscriptionPlan
  );
  return plan?.features?.messaging || false;
};

const verifyConversationAccess = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);

  if (!conversation) {
    throw new customError("Conversation not found", 404);
  }

  const isParticipant = conversation.participants.some(
    (p) => p.toString() === userId.toString()
  );

  if (!isParticipant) {
    throw new customError("Unauthorized access to conversation", 403);
  }

  return conversation;
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
        action: "REDIRECT_WHATSAPP",
        message: "This vendor uses WhatsApp for communication.",
        data: {
          phoneNumber: recipient.phoneNumber,
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

exports.initiateOrGetConversation = asyncErrorHandler(
  async (req, res, next) => {
    const { recipientId } = req.body;
    const senderId = req.user._id;

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
  }
);

exports.sendMessage = asyncErrorHandler(async (req, res, next) => {
  const { conversationId, content, replyTo } = req.body;
  const senderId = req.user._id;

  if (!conversationId || !content) {
    return next(
      new customError("Conversation ID and content are required", 400)
    );
  }

  const conversation = await verifyConversationAccess(conversationId, senderId);

  const sanitizedContent = DOMPurify.sanitize(content, {
    ALLOWED_TAGS: [],
    KEEP_CONTENT: true,
  });

  if (sanitizedContent.length > 2000) {
    return next(new customError("Message too long (max 2000 characters)", 400));
  }

  if (sanitizedContent.trim().length === 0) {
    return next(new customError("Message cannot be empty", 400));
  }

  const message = await Message.create({
    conversationId,
    sender: senderId,
    content: sanitizedContent,
    replyTo: replyTo || null,
  });

  conversation.lastMessage = message._id;

  const senderIdStr = senderId.toString();
  conversation.participants.forEach((pId) => {
    if (pId.toString() !== senderIdStr) {
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

  const io = req.app.get("io");
  if (io) {
    io.to(conversationId).emit("receive_message", message);

    conversation.participants.forEach((pId) => {
      if (pId.toString() !== senderIdStr) {
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

exports.getConversations = asyncErrorHandler(async (req, res, next) => {
  const userId = req.user._id;

  const conversations = await Conversation.find({
    participants: userId,
  })
    .populate("participants", "fullName profilePic role businessName")
    .populate("lastMessage")
    .sort({ updatedAt: -1 })
    .lean();

  res.status(200).json({
    status: "success",
    results: conversations.length,
    data: {
      conversations,
    },
  });
});

exports.getMessages = asyncErrorHandler(async (req, res, next) => {
  const { conversationId } = req.params;
  const userId = req.user._id;

  const page = req.query.page * 1 || 1;
  const limit = Math.min(req.query.limit * 1 || 50, 100);
  const skip = (page - 1) * limit;

  await verifyConversationAccess(conversationId, userId);

  const messages = await Message.find({ conversationId })
    .populate("sender", "fullName profilePic")
    .populate("replyTo")
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const conversation = await Conversation.findById(conversationId);
  if (conversation) {
    conversation.unreadCounts.set(userId, 0);
    conversation.markModified("unreadCounts");
    await conversation.save();
  }

  const total = await Message.countDocuments({ conversationId });

  res.status(200).json({
    status: "success",
    results: messages.length,
    data: {
      messages: messages.reverse(),
    },
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  });
});

exports.getAvailableVendorsForChat = asyncErrorHandler(
  async (req, res, next) => {
    const { schoolName, _id: currentUserId } = req.user;

    // Filter by current user's school (User has schoolName; schoolId was removed)
    const vendors = await User.find({
      role: "vendor",
      ...(schoolName ? { schoolName } : {}),
      subscriptionPlan: {
        $in: ["Shopydash Pro", "Shopydash Max"],
      },
      _id: { $ne: currentUserId },
    }).select("fullName businessName profilePic subscriptionPlan schoolName");

    res.status(200).json({
      status: "success",
      results: vendors.length,
      data: {
        vendors,
      },
    });
  }
);

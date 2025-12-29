/**
 * Message Controller Security Fixes
 * Apply these fixes to backend/controllers/message.controller.js
 */

const Message = require("../models/message.model");
const Conversation = require("../models/conversation.model");
const customError = require("../errors/customError");
const DOMPurify = require('isomorphic-dompurify');

/**
 * FIX 1: Add authorization check helper
 */
const verifyConversationAccess = async (conversationId, userId) => {
  const conversation = await Conversation.findById(conversationId);
  
  if (!conversation) {
    throw new customError("Conversation not found", 404);
  }
  
  // Check if user is a participant
  const isParticipant = conversation.participants.some(
    p => p.toString() === userId.toString()
  );
  
  if (!isParticipant) {
    throw new customError("Unauthorized access to conversation", 403);
  }
  
  return conversation;
};

/**
 * FIX 2: Send message with authorization and sanitization
 */
const sendMessage = async (req, res, next) => {
  try {
    const { conversationId, content, messageType = 'text' } = req.body;
    const userId = req.user.id;

    // Validate inputs
    if (!conversationId || !content) {
      return next(new customError("Conversation ID and content are required", 400));
    }

    // Verify user has access to conversation
    await verifyConversationAccess(conversationId, userId);

    // Sanitize message content to prevent XSS
    const sanitizedContent = DOMPurify.sanitize(content, {
      ALLOWED_TAGS: [], // Strip all HTML tags
      KEEP_CONTENT: true // Keep the text content
    });

    // Validate message length
    if (sanitizedContent.length > 2000) {
      return next(new customError("Message too long (max 2000 characters)", 400));
    }

    if (sanitizedContent.trim().length === 0) {
      return next(new customError("Message cannot be empty", 400));
    }

    // Create message
    const message = await Message.create({
      conversation: conversationId,
      sender: userId,
      content: sanitizedContent,
      messageType,
    });

    // Populate sender info
    await message.populate('sender', 'fullName profilePic');

    // Update conversation's last message
    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: {
        content: sanitizedContent,
        sender: userId,
        createdAt: message.createdAt,
      },
      updatedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      data: message,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FIX 3: Get messages with authorization and pagination
 */
const getMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 50, 100); // Max 100 messages per page

    // Verify user has access to conversation
    await verifyConversationAccess(conversationId, userId);

    // Fetch messages with pagination
    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('sender', 'fullName profilePic')
      .lean(); // Use lean() for better performance on read-only queries

    // Get total count for pagination
    const total = await Message.countDocuments({ conversation: conversationId });

    res.status(200).json({
      success: true,
      data: messages.reverse(), // Reverse to show oldest first
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FIX 4: Get conversations with authorization
 */
const getConversations = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // Only fetch conversations where user is a participant
    const conversations = await Conversation.find({
      participants: userId,
    })
      .sort({ updatedAt: -1 })
      .populate('participants', 'fullName profilePic')
      .lean();

    res.status(200).json({
      success: true,
      data: conversations,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * FIX 5: Create conversation with validation
 */
const createConversation = async (req, res, next) => {
  try {
    const { participantId } = req.body;
    const userId = req.user.id;

    if (!participantId) {
      return next(new customError("Participant ID is required", 400));
    }

    if (participantId === userId) {
      return next(new customError("Cannot create conversation with yourself", 400));
    }

    // Check if conversation already exists
    const existingConversation = await Conversation.findOne({
      participants: { $all: [userId, participantId], $size: 2 },
    });

    if (existingConversation) {
      return res.status(200).json({
        success: true,
        data: existingConversation,
        message: "Conversation already exists",
      });
    }

    // Create new conversation
    const conversation = await Conversation.create({
      participants: [userId, participantId],
    });

    await conversation.populate('participants', 'fullName profilePic');

    res.status(201).json({
      success: true,
      data: conversation,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  sendMessage,
  getMessages,
  getConversations,
  createConversation,
};

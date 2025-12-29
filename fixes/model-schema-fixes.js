/**
 * Database Schema Fixes for Message Feature
 * Add these indexes and validations to the models
 */

// ========================================
// MESSAGE MODEL FIXES
// File: backend/models/message.model.js
// ========================================

const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversation: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    content: {
      type: String,
      required: true,
      maxLength: [2000, "Message cannot exceed 2000 characters"],
      trim: true,
    },
    messageType: {
      type: String,
      enum: ["text", "image", "file"],
      default: "text",
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedFor: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }],
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Add compound indexes for query performance
messageSchema.index({ conversation: 1, createdAt: -1 }); // For fetching messages in order
messageSchema.index({ sender: 1, createdAt: -1 }); // For user's sent messages
messageSchema.index({ conversation: 1, isRead: 1 }); // For unread message counts

module.exports = mongoose.model("Message", messageSchema);


// ========================================
// CONVERSATION MODEL FIXES
// File: backend/models/conversation.model.js
// ========================================

const conversationSchema = new mongoose.Schema(
  {
    participants: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }],
    lastMessage: {
      content: String,
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      createdAt: Date,
    },
    conversationType: {
      type: String,
      enum: ["direct", "group"],
      default: "direct",
    },
  },
  {
    timestamps: true,
  }
);

// CRITICAL: Add indexes for conversation queries
conversationSchema.index({ participants: 1 }); // For finding user's conversations
conversationSchema.index({ updatedAt: -1 }); // For sorting by recent activity
conversationSchema.index({ "lastMessage.createdAt": -1 }); // For sorting by last message

// Compound index for finding existing conversations
conversationSchema.index({ participants: 1, conversationType: 1 });

module.exports = mongoose.model("Conversation", conversationSchema);

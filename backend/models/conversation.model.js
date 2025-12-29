const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    unreadCounts: {
      type: Map,
      of: Number,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries when fetching user's conversations
conversationSchema.index({ participants: 1 });
// CRITICAL: Additional indexes for query performance
conversationSchema.index({ updatedAt: -1 }); // For sorting by recent activity

module.exports = mongoose.model("Conversation", conversationSchema);

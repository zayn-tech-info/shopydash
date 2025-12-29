const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
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
    attachments: [
      {
        type: String,
        url: String,
      },
    ],
    replyTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        readAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);


messageSchema.index({ conversationId: 1, createdAt: -1 }); 
messageSchema.index({ sender: 1, createdAt: -1 }); 
messageSchema.index({ conversationId: 1, isRead: 1 }); 

module.exports = mongoose.model("Message", messageSchema);

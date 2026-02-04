import mongoose from "mongoose";

const aiChatMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    userMessage: {
      type: String,
      required: true,
    },
    aiResponse: {
      type: String,
      required: true,
    },
    conversationId: {
      type: String,
      default: null, // Can group related messages by conversation
    },
  },
  { timestamps: true }
);

const AIChatMessage = mongoose.model("AIChatMessage", aiChatMessageSchema);

export default AIChatMessage;

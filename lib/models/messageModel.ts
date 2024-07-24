import mongoose from "mongoose";

const messageModel = new mongoose.Schema({
  chatId: {
    type: String,
    ref: "Chat",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isUser: {
    type: Boolean,
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Message = mongoose.models.Message || mongoose.model("Message", messageModel);

export default Message;
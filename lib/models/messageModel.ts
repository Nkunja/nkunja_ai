import mongoose from "mongoose";


const messageModel = new mongoose.Schema({
  chatId: {
    type: mongoose.Types.ObjectId,
    ref: "Chat"
  },
  message: String,
  isUser: Boolean,
  createdAt: { type: Date, default: Date.now }
})

const Message = mongoose.models.Message || mongoose.model("Message", messageModel);

export default Message;
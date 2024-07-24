import mongoose from "mongoose";

const chatModel = new mongoose.Schema({
  _id: {
    type: String,
    default: () => new Date().getTime().toString(),
  },
  title: {
    type: String,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatModel);

export default Chat;
import mongoose from "mongoose";


const chatModel = new mongoose.Schema({
  title: String,
  createdAt: { type: Date, default: Date.now }
})

const Chat = mongoose.models.Chat || mongoose.model("Chat", chatModel);

export default Chat;
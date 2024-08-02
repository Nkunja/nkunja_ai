import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDb } from '../../../lib/connectDb';
import Message from '../../../lib/models/messageModel';
import Chat from '../../../lib/models/chatModel';
import { withCors } from '../../../lib/withCors';

connectDb();

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;

    const { chatId, message, isUser } = req.body;

    if (!chatId || !message) {
      return res.status(400).json({ message: 'ChatId and message are required' });
    }

    // Check if the chat exists and belongs to the user
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const newMessage = new Message({
      chatId,
      userId,
      message,
      isUser
    });

    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error: any) {
    console.error('Error creating message:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});
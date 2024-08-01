import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Message from '../../../lib/models/messageModel';
import Chat from '../../../lib/models/chatModel';
import { verifyToken } from '../../../utils/auth';

connectDb();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const userId = await verifyToken(token);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { chatId } = req.query;

    if (!chatId || typeof chatId !== 'string') {
      return res.status(400).json({ message: 'ChatId is required and must be a string' });
    }

    // Check if the chat exists and belongs to the user
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    const messages = await Message.find({ chatId });
    console.log(messages);

    res.status(200).json({ messages });
  } catch (error: any) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}
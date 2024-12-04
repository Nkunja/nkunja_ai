import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Message from '../../../lib/models/messageModel';
import Chat from '../../../lib/models/chatModel';
import { withCors } from '../../../lib/withCors';
import { verifyToken } from '../../../utils/jwt';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDb();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userId = decoded.id;
    const { chatId } = req.query;

    // Verify that the chat exists and belongs to the user
    const chat = await Chat.findOne({ _id: chatId, userId });
    if (!chat) {
      return res.status(404).json({ message: 'Chat not found' });
    }

    // Fetch messages for the chat
    const messages = await Message.find({ chatId })
      .sort({ createdAt: 1 })
      .select('message isUser createdAt');

    res.status(200).json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: 'Unknown error' });
    }
  }
});
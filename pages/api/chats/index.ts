import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { verifyToken } from '../../../utils/auth';

connectDb();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const chats = await Chat.find({ userId });

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
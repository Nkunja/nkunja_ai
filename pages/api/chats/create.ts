import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { withCors } from '../../../lib/withCors';
import { verifyToken } from '../../../utils/auth';

connectDb();

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  try {
    const decoded = await verifyToken(token);
    const { id, title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newChat = new Chat({
      _id: id,
      title,
      userId: decoded.userId,
    });

    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
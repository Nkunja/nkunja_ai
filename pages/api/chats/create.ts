import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { verifyToken } from '../../../utils/auth';

connectDb();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const token = req.headers.authorization?.split(' ')[1];
    const userId = await verifyToken(token);

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { id, title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newChat = new Chat({
      _id: id,
      title,
      userId,
    });

    await newChat.save();

    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
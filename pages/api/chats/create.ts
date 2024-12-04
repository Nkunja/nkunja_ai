import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { verifyToken } from '../../../utils/jwt';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
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

    const { id, title } = req.body;
    const newChat = new Chat({
      _id: id,
      title,
      userId: decoded.id, // Use the user ID from the decoded token
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
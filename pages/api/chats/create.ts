import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { withCors } from '../../../lib/withCors';
import { verifyToken } from '../../../utils/jwt';
import { CustomJwtPayload } from '../../../types/auth';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
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
    let decoded: CustomJwtPayload;
    
    try {
      decoded = verifyToken(token);
    } catch (error) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { id, title } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const newChat = new Chat({
      _id: id,
      title,
      userId: decoded.id, // Now TypeScript knows this exists
    });

    await newChat.save();
    res.status(201).json(newChat);
  } catch (error) {
    console.error('Error creating chat:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: 'Unknown error' });
    }
  }
});
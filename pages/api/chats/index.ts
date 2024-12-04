import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { withCors } from '../../../lib/withCors';
import { verifyToken } from '../../../utils/jwt';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    await connectDb();

    // Verify authentication
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

    // Fetch all chats for the authenticated user
    const chats = await Chat.find({ userId })
      .sort({ createdAt: -1 })
      .select('_id title createdAt');

    res.status(200).json(chats);
  } catch (error) {
    console.error('Error fetching chats:', error);
    if (error instanceof Error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      res.status(500).json({ message: 'Server error', error: 'Unknown error' });
    }
  }
});
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import { connectDb } from '../../../lib/connectDb';
import Chat from '../../../lib/models/chatModel';
import { withCors } from '../../../lib/withCors';

connectDb();

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;

    const chats = await Chat.find({ userId });

    res.status(200).json({ chats });
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
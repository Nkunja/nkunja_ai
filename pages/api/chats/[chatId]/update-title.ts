import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from ''
import { ObjectId } from 'mongodb';
import { verifyToken } from '../../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // Verify the user's token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const userId = await verifyToken(token);
    if (!userId) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const { chatId } = req.query;
    const { title } = req.body;

    if (!chatId || !title) {
      return res.status(400).json({ message: 'Missing chatId or title' });
    }

    const { db } = await connectToDatabase();

    const result = await db.collection('chats').updateOne(
      { _id: new ObjectId(chatId as string), userId: new ObjectId(userId) },
      { $set: { title } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Chat not found or user not authorized' });
    }

    res.status(200).json({ message: 'Chat title updated successfully' });
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}
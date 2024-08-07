import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]";
import { connectDb } from '../../../../lib/connectDb';
import Chat from '../../../../lib/models/chatModel';
import { ObjectId } from 'mongodb';
import { withCors } from '../../../../lib/withCors';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const session = await getServerSession(req, res, authOptions);

    if (!session || !session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const userId = session.user.id;

    const { chatId } = req.query;
    const { title } = req.body;

    if (!chatId || !title) {
      return res.status(400).json({ message: 'Missing chatId or title' });
    }

    const db: any = await connectDb();

    let query;
    if (ObjectId.isValid(chatId as string)) {
      query = { _id: new ObjectId(chatId as string), userId: new ObjectId(userId) };
    } else {
      query = { _id: chatId, userId: new ObjectId(userId) };
    }

    const result = await db.collection('chats').updateOne(
      query,
      { $set: { title } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Chat not found or user not authorized' });
    }

    res.status(200).json({ message: 'Chat title updated successfully' });
  } catch (error) {
    console.error('Error updating chat title:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
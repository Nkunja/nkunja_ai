import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import Message from '../../../lib/models/messageModel';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { chatId } = req.query;

  await connectDb();

  try {
    const messages = await Message.find({ chatId }).sort('createdAt');
    res.status(200).json({ messages });
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch messages' });
  }
}
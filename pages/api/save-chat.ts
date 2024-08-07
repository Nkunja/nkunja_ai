import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../lib/connectDb';
import Chat from '../../lib/models/chatModel';
import { withCors } from '../../lib/withCors';

connectDb();

export default withCors(async function POST(req: NextApiRequest, res: NextApiResponse) {
  const { title } = req.body;
  try {
    const chat = new Chat({
      title: title,
    })
      
    await chat.save();
    console.log('chat saved', chat);
    res.status(200).json(chat);
  } catch(e: any){
    console.error('Error creating chat:', e);
    res.status(500).json({ error: 'Failed to create chat' });
  }
});
import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./[...nextauth]";
import { withCors } from '../../../lib/withCors';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);

  if (session) {
    res.status(200).json({ message: 'Authenticated', userId: session.user.id });
  } else {
    res.status(401).json({ message: 'Not authenticated' });
  }
});
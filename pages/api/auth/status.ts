import { NextApiRequest, NextApiResponse } from 'next';
import { checkAuthStatus } from '../../../lib/functions';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authStatus = await checkAuthStatus();

  if (authStatus.isAuthenticated) {
    res.status(200).json(authStatus);
  } else {
    res.status(401).json(authStatus);
  }
}
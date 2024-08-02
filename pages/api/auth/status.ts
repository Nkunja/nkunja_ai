import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../utils/auth';
import { withCors } from '../../../lib/withCors';

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.token;

  console.log('Token from cookie in status check:', token); // Add this line for debugging

  if (!token) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  try {
    const userId = await verifyToken(token);
    if (userId) {
      res.status(200).json({ message: 'Authenticated', userId });
    } else {
      res.status(401).json({ message: 'Invalid token' });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
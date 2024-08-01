import { NextApiRequest, NextApiResponse } from 'next';
import { verifyToken } from '../../../utils/auth';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

  console.log('Token in status check:', token); // Debugging line

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
}
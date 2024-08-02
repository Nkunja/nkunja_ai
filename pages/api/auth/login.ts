import { NextApiRequest, NextApiResponse } from 'next';
import { signIn } from 'next-auth/react';
import { connectDb } from '../../../lib/connectDb';
import handleCors from '../../../lib/cors';

connectDb();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await handleCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      return res.status(401).json({ message: result.error });
    }

    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
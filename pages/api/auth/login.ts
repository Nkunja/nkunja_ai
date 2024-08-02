import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import User from '../../../lib/models/userModel';
import bcrypt from 'bcryptjs';
import { signToken } from '../../../utils/auth';
import handleCors from '../../../lib/cors';

connectDb();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  await handleCors(req, res);
  
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create and sign JWT
    const token = await signToken(user.id);
    
    // After creating the token
    res.setHeader('Set-Cookie', `token=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`);
    res.status(200).json({ message: 'Login successful' });// Send token to client

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}
import { NextApiRequest, NextApiResponse } from 'next';
import { connectDb } from '../../../lib/connectDb';
import User from '../../../lib/models/userModel';
import bcrypt from 'bcryptjs';
import { withCors } from '../../../lib/withCors';
import { signToken } from '../../../utils/jwt';

connectDb();

export default withCors(async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Function to validate email format
    const isValidEmail = (email: string): boolean => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return emailRegex.test(email);
    };

    // Function to validate password strength
    const isStrongPassword = (password: string): boolean => {
      // Password should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      return passwordRegex.test(password);
    };

    // Validate email
    if (!isValidEmail(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Validate password strength
    if (!isStrongPassword(password)) {
      return res.status(400).json({ message: 'Password is not strong enough. It should be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.' });
    }

    // Create new user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = signToken({ id: newUser._id, email: newUser.email });
    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});
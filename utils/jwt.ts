import jwt from 'jsonwebtoken';
import { CustomJwtPayload } from '../types/auth';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const signToken = (payload: Omit<CustomJwtPayload, 'iat' | 'exp'>) => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const verifyToken = (token: string): CustomJwtPayload => {
  const decoded = jwt.verify(token, JWT_SECRET);
  if (typeof decoded === 'string') {
    throw new Error('Invalid token');
  }
  return decoded as CustomJwtPayload;
};
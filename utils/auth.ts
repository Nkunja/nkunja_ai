import jwt from 'jsonwebtoken';

export const verifyToken = (token: string | undefined): Promise<string | null> => {
  return new Promise((resolve) => {
    if (!token) {
      resolve(null);
      return;
    }

    jwt.verify(token, process.env.JWT_SECRET as string, (err, decoded) => {
      if (err) {
        resolve(null);
      } else {
        resolve((decoded as any).userId);
      }
    });
  });
};
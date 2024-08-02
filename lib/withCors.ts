import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import handleCors from './cors';

export function withCors(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    await handleCors(req, res);
    return handler(req, res);
  };
}
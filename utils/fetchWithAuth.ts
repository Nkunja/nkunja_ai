import { withCors } from '../lib/withCors';
import { NextApiHandler } from 'next';

let inMemoryToken: string | null = null;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    credentials: 'include',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  const response = await fetch(url, mergedOptions);

  if (response.status === 401) {
    console.error('Unauthorized request');
    throw new Error('Unauthorized');
  }

  return response;
};

const fetchWithAuthWrapper: NextApiHandler = async (req, res) => {
  const response = await fetchWithAuth(req.url!, {
    method: req.method as string,
    headers: req.headers as HeadersInit,
    body: req.body ? JSON.stringify(req.body) : undefined,
  });
  
  res.status(response.status).json(await response.json());
};

export const withCorsAuthFetch = withCors(fetchWithAuthWrapper);

export const setAuthToken = (token: string) => {
  inMemoryToken = token;
  document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict; Secure; HttpOnly`;
};
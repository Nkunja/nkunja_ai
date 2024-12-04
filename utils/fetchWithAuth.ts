let inMemoryToken: string | null = null;

export const setAuthToken = (token: string) => {
  inMemoryToken = token;
  localStorage.setItem('token', token);
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('Unauthorized');
  }

  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
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
    localStorage.removeItem('token');
    throw new Error('Unauthorized');
  }

  return response;
};
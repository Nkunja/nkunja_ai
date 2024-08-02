let inMemoryToken: string | null = null;

export const setAuthToken = (token: string) => {
  inMemoryToken = token;
  localStorage.setItem('token', token);
  document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict; Secure; HttpOnly`;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = inMemoryToken || localStorage.getItem('token');
  
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
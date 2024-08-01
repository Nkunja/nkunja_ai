let inMemoryToken: string | null = null;

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  let token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  
  if (!token && inMemoryToken) {
    token = inMemoryToken;
  }
  
  console.log('Token used for request:', token); // Debugging line

  if (!token) {
    console.error('No authentication token found');
    throw new Error('No authentication token found');
  }

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

export const setAuthToken = (token: string) => {
  inMemoryToken = token;
  document.cookie = `token=${token}; path=/; max-age=3600; SameSite=Strict; Secure; HttpOnly`;
};
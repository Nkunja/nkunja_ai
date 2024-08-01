import { verifyToken } from './auth';

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)token\s*\=\s*([^;]*).*$)|^.*$/, "$1");
    
    console.log('Token from cookie:', token); // Debugging line

    if (!token) {
        console.error('No authentication token found in cookie');
        throw new Error('No authentication token found');
    }

    try {
        // Verify the token
        const userId = await verifyToken(token);
        if (!userId) {
            console.error('Invalid or expired token');
            throw new Error('Invalid or expired token');
        }

        const defaultOptions: RequestInit = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            credentials: 'include', // Add this line
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
    } catch (error) {
        console.error('Error in fetchWithAuth:', error);
        throw error;
    }
};
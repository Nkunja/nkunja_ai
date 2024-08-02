// 'use server';
// import { cookies } from 'next/headers';
// import { verifyToken } from '../utils/auth';


// export async function checkAuthStatus() {
//     const cookieStore = cookies();
//     const token = cookieStore.get('token')?.value;

//     if (!token) {
//         return { isAuthenticated: false, message: 'Not authenticated' };
//     }

//     try {
//         const userId = await verifyToken(token);
//         if (userId) {
//             return { isAuthenticated: true, message: 'Authenticated', userId };
//         } else {
//             return { isAuthenticated: false, message: 'Invalid token' };
//         }
//     } catch (error) {
//         console.error('Error verifying token:', error);
//         return { isAuthenticated: false, message: 'Server error' };
//     }
// }
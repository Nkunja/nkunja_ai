import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request: NextRequest) {
  // List of paths that don't require authentication
  const publicPaths = ['/', '/login', '/register', '/signup'];

  // If it's a public path, allow the request to proceed
  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  // For protected routes, check for token in Authorization header
  const token = request.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists, verify it
  const userId = await verifyToken(token);
  if (!userId) {
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
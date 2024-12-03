import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken } from './utils/auth';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;

  if (request.nextUrl.pathname.startsWith('/api/chats') || 
      request.nextUrl.pathname.startsWith('/api/messages')) {
    if (!token) {
      return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
    }
    try {
      await verifyToken(token);
    } catch (error) {
      return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/chats/:path*', '/api/messages/:path*'],
};
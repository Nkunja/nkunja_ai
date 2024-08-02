import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const publicPaths = ['/', '/login', '/register', '/signup'];

  if (publicPaths.includes(request.nextUrl.pathname)) {
    return NextResponse.next();
  }

  const token = await getToken({ req: request });

  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
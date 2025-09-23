import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT Secret - must match the one in lib/auth.ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';
const secret = new TextEncoder().encode(JWT_SECRET);

// Paths that don't require authentication
const publicPaths = ['/login', '/api/auth/login', '/api/auth/logout'];

// Paths that should be accessible only when not authenticated
const authPaths = ['/login'];

async function verifyTokenEdge(token: string): Promise<{ userId: number; username: string } | null> {
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as { userId: number; username: string };
  } catch (error) {
    console.log('JWT verification failed in middleware:', error);
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  console.log('Middleware running for path:', pathname);
  
  // Allow access to public paths and static files
  if (publicPaths.some(path => pathname.startsWith(path)) || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/.well-known/')) {
    console.log('Public path, allowing access');
    return NextResponse.next();
  }

  // Get the auth token from cookies
  const token = request.cookies.get('auth-token')?.value;
  console.log('Token found:', !!token);
  
  const isAuthenticated = token ? await verifyTokenEdge(token) : null;
  console.log('Is authenticated:', !!isAuthenticated);

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    console.log('Not authenticated, redirecting to login');
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // If authenticated but trying to access auth pages, redirect to home
  if (isAuthenticated && authPaths.includes(pathname)) {
    console.log('Authenticated user trying to access auth page, redirecting home');
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  console.log('Allowing access to protected route');
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|public).*)',
  ],
}

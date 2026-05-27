import { NextRequest, NextResponse } from 'next/server';

const AUTH_PATHS = ['/login', '/register'];
const ADMIN_PATHS = ['/admin'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const sessionCookie = request.cookies.get('session')?.value;
  const isAuthenticated = Boolean(sessionCookie);

  if (AUTH_PATHS.some((p) => pathname.startsWith(p)) && isAuthenticated) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (ADMIN_PATHS.some((p) => pathname.startsWith(p)) && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

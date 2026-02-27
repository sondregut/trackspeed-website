import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {routing} from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // Skip i18n for admin, influencer, api, and invite routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/influencer') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/invite')
  ) {
    // Admin auth check (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const sessionToken = request.cookies.get('admin_session')?.value;

      if (!sessionToken) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(loginUrl);
      }

      const expectedToken = process.env.ADMIN_SESSION_TOKEN;

      if (sessionToken !== expectedToken) {
        const loginUrl = new URL('/admin/login', request.url);
        return NextResponse.redirect(loginUrl);
      }
    }

    return NextResponse.next();
  }

  // Apply i18n middleware for all other routes
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    '/',
    '/(de|fr|nb|ja|zh-Hans|ko|hi|es|pt|it|ar|tr)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};

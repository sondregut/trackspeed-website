import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';
import type {NextRequest} from 'next/server';
import {routing} from './i18n/routing';
import {timingSafeEqualString} from './lib/server-secrets';

const intlMiddleware = createMiddleware(routing);

const englishOnlyPublicPaths = new Set([
  '/features',
  '/technology',
  '/pro',
  '/feedback',
  '/privacy',
  '/terms',
  '/delete-account',
  '/jump',
]);

function isEnglishOnlyPublicPath(pathname: string) {
  return englishOnlyPublicPaths.has(pathname) || pathname.startsWith('/blog/') || pathname.startsWith('/jump/');
}

function canonicalEnglishPath(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  const locale = segments[0];

  if (
    !locale ||
    locale === routing.defaultLocale ||
    !routing.locales.includes(locale as typeof routing.locales[number])
  ) {
    return null;
  }

  const pathWithoutLocale = `/${segments.slice(1).join('/')}`.replace(/\/$/, '');
  return isEnglishOnlyPublicPath(pathWithoutLocale) ? pathWithoutLocale : null;
}

// Only routes in app/[locale]/(public) may skip locale canonicalization.
// X-NEXT-INTL-LOCALE is client-controlled and is never an auth signal.
const publicEnglishPaths = new Set([
  '/en', '/en/about', '/en/blog', '/en/checkout/pro', '/en/checkout/success',
  '/en/creator-reward', '/en/delete-account', '/en/features', '/en/feedback',
  '/en/jump', '/en/pitch', '/en/privacy', '/en/pro', '/en/shop',
  '/en/support', '/en/technology', '/en/terms',
]);

function isPublicEnglishDestination(pathname: string) {
  const normalized = pathname.replace(/\/$/, '');
  return publicEnglishPaths.has(normalized) || /^\/en\/(?:blog|shop|jump)\/[^/]+$/.test(normalized);
}

export function proxy(request: NextRequest) {
  const {pathname, search} = request.nextUrl;

  const canonicalPath = canonicalEnglishPath(pathname);
  if (canonicalPath) {
    const canonicalUrl = request.nextUrl.clone();
    canonicalUrl.pathname = canonicalPath;
    return NextResponse.redirect(canonicalUrl, 308);
  }

  // Next 16 can run Proxy again for an internal rewrite. Let the English
  // TrackJump destination render instead of redirecting it back to /jump.
  if ((pathname === '/en/jump' || pathname.startsWith('/en/jump/')) && isPublicEnglishDestination(pathname)) {
    const headers = new Headers(request.headers);
    headers.set('X-NEXT-INTL-LOCALE', 'en');
    const response = NextResponse.next({request: {headers}});
    response.headers.set('Content-Language', 'en');
    return response;
  }

  const normalizedPathname = pathname.replace(/\/$/, '') || '/';
  if (isEnglishOnlyPublicPath(normalizedPathname)) {
    const localizedUrl = request.nextUrl.clone();
    localizedUrl.pathname = `/en${normalizedPathname}`;
    const headers = new Headers(request.headers);
    headers.set('X-NEXT-INTL-LOCALE', 'en');
    const response = NextResponse.rewrite(localizedUrl, {request: {headers}});
    response.headers.set('Content-Language', 'en');
    return response;
  }

  if (pathname === '/creator-kit' || pathname === '/creator-kit/') {
    const response = NextResponse.rewrite(new URL('/creator-kit/index.html', request.url));
    response.headers.set('Content-Language', 'en');
    return response;
  }

  // Skip i18n for admin, influencer, api, invite, and install-handoff routes
  if (
    pathname.startsWith('/admin') ||
    pathname.startsWith('/influencer') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/invite') ||
    pathname === '/get' ||
    pathname === '/get/'
  ) {
    // Admin auth check (except /admin/login)
    if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
      const sessionToken = request.cookies.get('admin_session')?.value;

      if (!sessionToken) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      }

      const expectedToken = process.env.ADMIN_SESSION_TOKEN;

      if (!expectedToken || !timingSafeEqualString(sessionToken, expectedToken)) {
        const loginUrl = new URL('/admin/login', request.url);
        loginUrl.searchParams.set('redirect', `${pathname}${search}`);
        return NextResponse.redirect(loginUrl);
      }
    }

    const response = NextResponse.next();
    response.headers.set('Content-Language', 'en');
    return response;
  }

  // Next 16 re-enters Proxy for next-intl's internal English rewrite.
  // The locale header is not trusted to grant access to any private route.
  if (
    (pathname === '/en' || pathname.startsWith('/en/')) &&
    request.headers.get('X-NEXT-INTL-LOCALE') === 'en'
  ) {
    if (isPublicEnglishDestination(pathname)) {
      const response = NextResponse.next();
      response.headers.set('Content-Language', 'en');
      return response;
    }

    // Private/non-localized destinations must pass their ordinary route checks.
    const unlocalizedPath = pathname.slice(3);
    if (
      ['/admin', '/influencer', '/api', '/invite'].some(prefix => unlocalizedPath.startsWith(prefix)) ||
      ['/get', '/get/', '/creator-kit', '/creator-kit/'].includes(unlocalizedPath)
    ) {
      const canonicalUrl = request.nextUrl.clone();
      canonicalUrl.pathname = unlocalizedPath;
      return NextResponse.redirect(canonicalUrl, 307);
    }

    // An unknown locale route must fail closed instead of canonicalizing in a loop.
    return new NextResponse('Page not found', {
      status: 404,
      headers: {'Content-Type': 'text/plain; charset=utf-8', 'Content-Language': 'en'},
    });
  }

  // Apply i18n middleware for all other routes
  const response = intlMiddleware(request);
  const localeSegment = pathname.split('/')[1];
  const locale = routing.locales.includes(localeSegment as typeof routing.locales[number])
    ? localeSegment
    : routing.defaultLocale;
  response.headers.set('Content-Language', locale);
  return response;
}

export const config = {
  matcher: [
    '/',
    '/(de|fr|nb|ja|zh-Hans|ko|hi|es|pt|it|ar|tr)/:path*',
    '/((?!_next|_vercel|.*\\..*).*)',
  ],
};

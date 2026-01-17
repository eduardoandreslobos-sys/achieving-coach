import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware for SEO-related redirects:
 * 1. Force HTTPS in production
 * 2. Redirect www to non-www (canonical URL)
 */
export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const host = request.headers.get('host') || '';
  const proto = request.headers.get('x-forwarded-proto') || 'https';

  // Only apply in production
  if (process.env.NODE_ENV !== 'production') {
    return NextResponse.next();
  }

  // Skip for localhost and internal paths
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return NextResponse.next();
  }

  let shouldRedirect = false;
  let newHost = host;
  let newProto = proto;

  // 1. Force HTTPS
  if (proto === 'http') {
    newProto = 'https';
    shouldRedirect = true;
  }

  // 2. Redirect www to non-www (canonical)
  if (host.startsWith('www.')) {
    newHost = host.replace('www.', '');
    shouldRedirect = true;
  }

  if (shouldRedirect) {
    const redirectUrl = `${newProto}://${newHost}${url.pathname}${url.search}`;
    return NextResponse.redirect(redirectUrl, { status: 301 });
  }

  return NextResponse.next();
}

// Configure which paths the middleware runs on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico
     * - public files (images, robots.txt, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|robots.txt|sitemap.xml).*)',
  ],
};

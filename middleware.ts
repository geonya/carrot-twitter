import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const cookie = req.cookies.get('carrottwitter');

  if (!req.nextUrl.pathname.startsWith('/api')) {
    if (
      !req.nextUrl.pathname.startsWith('/log-in') &&
      !req.nextUrl.pathname.startsWith('/create-account')
    ) {
      if (!cookie) {
        req.nextUrl.pathname = '/log-in';
        return NextResponse.redirect(req.nextUrl);
      }
    }
    if (
      req.nextUrl.pathname.startsWith('/log-in') ||
      req.nextUrl.pathname.startsWith('/create-account')
    ) {
      if (cookie) {
        req.nextUrl.pathname = '/';
        return NextResponse.redirect(req.nextUrl);
      }
    }
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/log-in', '/create-account'],
};

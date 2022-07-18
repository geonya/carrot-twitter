import { type NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api')) {
    if (
      !req.nextUrl.pathname.startsWith('/log-in') &&
      !req.nextUrl.pathname.startsWith('/create-account') &&
      !req.cookies.get('carrottwitter')
    ) {
      const url = req.nextUrl.clone();
      url.pathname = '/log-in';
      return NextResponse.redirect(url);
    }
    if (
      req.nextUrl.pathname.startsWith('/log-in') ||
      req.nextUrl.pathname.startsWith('/create-account')
    ) {
      if (req.cookies.get('carrottwitter')) {
        const url = req.nextUrl.clone();
        url.pathname = '/';
        return NextResponse.redirect(url);
      }
    }
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/log-in')) {
    if (!req.cookies.get('carrottwitter')) {
      return NextResponse.redirect(new URL('/log-in', req.url));
    }
  }

  return NextResponse.next();
}

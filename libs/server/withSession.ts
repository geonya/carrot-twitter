import { withIronSessionApiRoute, withIronSessionSsr } from 'iron-session/next';

declare module 'iron-session' {
  interface IronSessionData {
    user?: {
      id: number;
    };
  }
}

const cookieOptions = {
  cookieName: 'carrottwitter',
  password: process.env.COOKIE_PW!,
};

export function withApiSession(fn: any) {
  return withIronSessionApiRoute(fn, cookieOptions);
}
export function withSsrSession(handler: any) {
  return withIronSessionSsr(handler, cookieOptions);
}

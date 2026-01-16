import { NextResponse } from 'next/server';

export function middleware(request) {
  const user = process.env.BASIC_AUTH_USER;
  const pass = process.env.BASIC_AUTH_PASS;

  if (!user || !pass) {
    return NextResponse.next();
  }

  const auth = request.headers.get('authorization');
  if (auth) {
    const [scheme, encoded] = auth.split(' ');
    if (scheme === 'Basic' && encoded) {
      const decoded = atob(encoded);
      const index = decoded.indexOf(':');
      if (index !== -1) {
        const inputUser = decoded.slice(0, index);
        const inputPass = decoded.slice(index + 1);
        if (inputUser === user && inputPass === pass) {
          return NextResponse.next();
        }
      }
    }
  }

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Binance Kline Downloader"',
    },
  });
}

export const config = {
  matcher: '/:path*',
};

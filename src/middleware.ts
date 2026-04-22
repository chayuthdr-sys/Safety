import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const basicAuth = req.headers.get('authorization');
  const url = req.nextUrl;

  // ป้องกันเฉพาะหน้า /admin
  if (url.pathname.startsWith('/admin')) {
    if (basicAuth) {
      const authValue = basicAuth.split(' ')[1];
      const [user, pwd] = atob(authValue).split(':');

      // กำหนด Username และ Password สำหรับ Admin
      if (user === 'admin' && pwd === 'fujiseal1234') {
        return NextResponse.next();
      }
    }
    url.pathname = '/api/auth';
    return new NextResponse(
      `<html>
        <head><meta http-equiv="refresh" content="0; url=/" /></head>
        <body>
          <script>window.location.href="/";</script>
          <p>Authentication canceled. <a href="/">Click here to return to the home page</a>.</p>
        </body>
      </html>`,
      {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Secure Area"',
          'Content-Type': 'text/html; charset=utf-8',
        },
      }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  const existingLocale = request.cookies.get('locale')?.value;
  if (!existingLocale) {
    const country = request.headers.get('x-vercel-ip-country') || '';
    const locale = (country === 'RO' || country === 'MD') ? 'ro' : 'en';

    response.cookies.set('locale', locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
    });
  }

  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio).*)'],
};

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const existingLocale = request.cookies.get('locale')?.value;
  if (existingLocale === 'en' || existingLocale === 'ro') return NextResponse.next();

  const country = request.headers.get('x-vercel-ip-country') || '';
  const locale = country === 'RO' || country === 'MD' ? 'ro' : 'en';
  // Forward the initial choice to server-rendered pages as well as saving it.
  const headers = new Headers(request.headers);
  const cookies = (headers.get('cookie') || '').split(';').filter(c => c.trim() && !c.trim().startsWith('locale='));
  headers.set('cookie', [...cookies, `locale=${locale}`].join('; '));
  const response = NextResponse.next({request:{headers}});
  response.cookies.set('locale', locale, {path:'/', maxAge:60*60*24*365, sameSite:'lax'});
  return response;
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|studio).*)'],
};

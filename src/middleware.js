import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const userToken = request.cookies.get('accessToken')?.value;
  const adminToken = request.cookies.get('adminAccessToken')?.value;

  // ---------------- ADMIN ----------------
  if (path.startsWith('/admin')) {

  const isAdminPublicPath =
    path === '/admin/login' || 
    path === '/admin/register' || 
    path === '/admin/forgot-password' ||
    path === '/admin/verify' ||
    path === '/admin/forgot-password/change-password';

  // 🔥 IMPORTANT FIX
  if (isAdminPublicPath) {
    return NextResponse.next();
  }

  if (!adminToken) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
}

  // ---------------- USER ----------------
  const isUserLoginRegisterPath =
    path === '/login' ||
    path === '/register' ||
    path === '/forgot-password' ||
    path === '/verify' ||
    path === '/forgot-password/change-password';

  const isUserProtectedPath =
    path.startsWith('/my-account') ||
    path.startsWith('/checkout') ||
    path.startsWith('/my-orders') ||
    path.startsWith('/my-list') ||
    path.startsWith('/address');

  if (userToken && isUserLoginRegisterPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!userToken && isUserProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|pattern.png|logo.png).*)',
  ],
};
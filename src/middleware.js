import { NextResponse } from 'next/server';

export function middleware(request) {
  const path = request.nextUrl.pathname;

  // Get tokens from cookies
  const userToken = request.cookies.get('accessToken')?.value;
  const adminToken = request.cookies.get('adminAccessToken')?.value;

  // --- ADMIN AUTH LOGIC ---
  if (path.startsWith('/admin')) {
    // Admin public auth paths
    const isAdminAuthPath = 
      path === '/admin/login' || 
      path === '/admin/register' || 
      path === '/admin/forgot-password';

    // 1. If logged in as ADMIN, don't allow access to login/register pages
    if (adminToken && isAdminAuthPath) {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    // 2. If NOT logged in as ADMIN, don't allow access to dashboard (protected pages)
    if (!adminToken && !isAdminAuthPath) {
      // Allow only the login/register/forgot-password pages if not logged in
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // --- USER AUTH LOGIC ---
  const isUserAuthPath = 
    path === '/login' || 
    path === '/register' || 
    path === '/forgot-password';

  // User paths that require login (Dashboard, Account, Orders, etc.)
  const isUserProtectedPath = 
    path.startsWith('/my-account') || 
    path.startsWith('/checkout') || 
    path.startsWith('/my-orders') || 
    path.startsWith('/my-list') || 
    path.startsWith('/address');

  // 1. If logged in as USER, don't allow access to login/register pages
  if (userToken && isUserAuthPath) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 2. If NOT logged in as USER, redirect to login for protected pages
  if (!userToken && isUserProtectedPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Match all relevant paths except static files, api routes, icons, etc.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - pattern.png, logo.png (specific assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|pattern.png|logo.png).*)',
  ],
};

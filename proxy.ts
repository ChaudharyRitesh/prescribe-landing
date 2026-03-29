import { NextRequest, NextResponse } from "next/server";

/**
 * Next.js 16 Proxy (formerly middleware.ts)
 * Handles route protection and request interception.
 */
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("mr_token")?.value;
  
  // Define protected routes
  const isMrRoute = pathname.startsWith("/mr");
  const isPublicMrRoute = pathname === "/mr/login" || pathname === "/mr/register" || pathname.startsWith("/mr/forgot-password");
  
  // 1. If authenticated user tries to access home, login, or register - redirect to dashboard
  if (token && (pathname === "/" || pathname === "/mr/login" || pathname === "/mr/register")) {
    const url = request.nextUrl.clone();
    url.pathname = "/mr/dashboard";
    return NextResponse.redirect(url);
  }

  // 2. Protect MR routes
  if (isMrRoute && !isPublicMrRoute) {
    // If no token, redirect to login page
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/mr/login";
      return NextResponse.redirect(url);
    }
  }
  
  // 3. Fallback: Continue with security headers
  const response = NextResponse.next();
  
  // Security Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=(), interest-cohort=()");
  
  return response;
}

// Optional: Configure matcher if needed, although proxy.ts usually handles everything
// export const config = {
//   matcher: ["/mr/:path*"],
// };

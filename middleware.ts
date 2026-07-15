import { NextRequest, NextResponse } from "next/server";

// Auth.js v5 session cookie names (secure variant used over HTTPS).
const SESSION_COOKIES = [
  "authjs.session-token",
  "__Secure-authjs.session-token",
];

export default function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Server-side gate for the admin shell (defense-in-depth; APIs also enforce
  // auth). Redirect to sign-in when no session cookie is present at all.
  if (pathname.startsWith("/admin")) {
    const hasSession = SESSION_COOKIES.some((name) => request.cookies.has(name));
    if (!hasSession) {
      const signInUrl = new URL("/auth/signin", request.url);
      return NextResponse.redirect(signInUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Run on admin routes (for the gate) and all non-static app routes.
    "/admin/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|auth).*)",
  ],
};

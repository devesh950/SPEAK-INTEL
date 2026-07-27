import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Instantly skip public/asset paths
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/favicon.ico" ||
    pathname === "/"
  ) {
    return NextResponse.next();
  }

  // 2. Read NextAuth and custom session cookies
  const hasToken =
    req.cookies.get("authjs.session-token") ||
    req.cookies.get("__Secure-authjs.session-token") ||
    req.cookies.get("next-auth.session-token") ||
    req.cookies.get("__Secure-next-auth.session-token") ||
    req.cookies.get("speakintel-demo-session");

  const isLoggedIn = !!hasToken;

  // 3. Define route types
  const isAuthRoute = pathname === "/sign-in" || pathname === "/sign-up";
  
  const protectedRoutes = [
    "/dashboard",
    "/conversation",
    "/interview",
    "/roleplay",
    "/challenges",
    "/vocabulary",
    "/pronunciation",
    "/grammar",
    "/progress",
    "/leaderboard",
    "/settings",
  ];

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // 4. Perform redirects
  if (isProtectedRoute && !isLoggedIn) {
    const signInUrl = new URL("/sign-in", req.nextUrl.origin);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

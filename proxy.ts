import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Optimistic route gate for /admin and /business.
//
// This only reads a non-sensitive role flag cookie ("lol_session", set by
// app/lib/auth.tsx alongside the localStorage session — never the JWT itself)
// so unauthenticated visitors are redirected before the client bundle for a
// protected panel ever ships, instead of after a client-side effect fires.
//
// This is NOT the real authorization boundary: every admin/business API
// request must still be independently verified server-side via the bearer
// token, since Proxy can be bypassed and must not be the only line of
// defense (see Next.js Proxy + Data Access Layer guidance).
const SESSION_COOKIE = "lol_session";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = request.cookies.get(SESSION_COOKIE)?.value;

  const isAdminLogin = pathname === "/admin/login";
  const isBusinessLogin = pathname === "/business/login";

  if (pathname.startsWith("/admin") && !isAdminLogin && session !== "admin") {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  if (isAdminLogin && session === "admin") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (pathname.startsWith("/business") && !isBusinessLogin && session !== "business") {
    return NextResponse.redirect(new URL("/business/login", request.url));
  }
  if (isBusinessLogin && session === "business") {
    return NextResponse.redirect(new URL("/business", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/business/:path*"],
};

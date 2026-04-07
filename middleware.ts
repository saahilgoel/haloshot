import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// Routes that require authentication (everything else is public)
const protectedPatterns = [
  /^\/dashboard/,
  /^\/generate/,
  /^\/gallery/,
  /^\/editor/,
  /^\/settings/,
  /^\/refer/,
  /^\/team/,
  /^\/pick\/new$/,
  /^\/admin/,
];

function isProtectedRoute(pathname: string): boolean {
  return protectedPatterns.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh Supabase auth session
  const { user, supabaseResponse } = await updateSession(request);

  // Public routes — allow without auth
  if (!isProtectedRoute(pathname)) {
    return supabaseResponse;
  }

  // Protect /admin/* routes — check admin email
  if (pathname.startsWith("/admin")) {
    if (!user) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const adminEmails = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    if (!user.email || !adminEmails.includes(user.email.toLowerCase())) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return supabaseResponse;
  }

  // All other protected routes — require auth
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon)
     * - public folder assets
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

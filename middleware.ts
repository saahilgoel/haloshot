import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

const publicPatterns = [
  /^\/$/, // root
  /^\/(marketing)/, // marketing pages
  /^\/api\//, // API routes
  /^\/(auth)/, // auth pages (login, signup, callback)
  /^\/login/, // login page direct
  /^\/signup/, // signup page direct
  /^\/pick\/[^/]+$/, // public vote pages /pick/[slug]
  /^\/s\/[^/]+$/, // public shared headshot pages /s/[slug]
  /^\/score\/public/, // public score sharing pages
];

function isPublicRoute(pathname: string): boolean {
  return publicPatterns.some((pattern) => pattern.test(pathname));
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Refresh Supabase auth session
  const { user, supabaseResponse } = await updateSession(request);

  // Allow public routes
  if (isPublicRoute(pathname)) {
    return supabaseResponse;
  }

  // Protect /admin/* routes - check admin email
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

  // Protect all (app)/* routes (dashboard, generate, gallery, etc.)
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

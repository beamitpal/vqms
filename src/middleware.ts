// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function middleware(req: NextRequest) {
  const supabase = createSupabaseServerClient({
    getCookie: (name) => req.cookies.get(name)?.value,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    setCookie: (_name, _value, _options) => { }, // Handled in response
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    deleteCookie: (_name, _options) => { }, // Handled in response
  });

  const { pathname } = req.nextUrl;

  const publicRoutes = [
    "/",
    "/admin/login",
    "/admin/forgot-password",
    "/admin/reset-password",
    "/business/login",
    "/business/signup",
    "/business/forgot-password",
    "/business/reset-password",
    "/api/auth/confirm",
    "/api/auth/callback",
    "/api/auth/login",
    "/api/auth/logout",
  ];

  if (publicRoutes.includes(pathname) || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const { data, error } = await supabase.auth.getSession();

  if (error || !data.session) {
    return NextResponse.redirect(new URL("/business/login", req.url));
  }

  const { data: userData } = await supabase.auth.getUser();

  if (!userData.user) {
    return NextResponse.redirect(new URL("/business/login", req.url));
  }

  const userRole = userData.user.user_metadata.role;

  if (pathname.startsWith("/business") && userRole !== "business") {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  if (pathname.startsWith("/admin") && userRole !== "admin") {
    return NextResponse.redirect(new URL("/business/login", req.url));
  }

  const response = NextResponse.next();

  if (data.session) {
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    response.cookies.set("sb-access-token", data.session.access_token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
    response.cookies.set("sb-refresh-token", data.session.refresh_token, {
      path: "/",
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return response;
}

export const config = {
  matcher: ["/business/:path*", "/admin/:path*"],
};
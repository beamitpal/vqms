// api/auth/confirm/route.ts
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { EmailOtpType } from "@supabase/supabase-js";
import { CookieOptions } from "@supabase/ssr";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: { path?: string; expires?: Date; maxAge?: number; domain?: string; secure?: boolean; httpOnly?: boolean; sameSite?: boolean | "lax" | "strict" | "none" }) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.delete({ name, ...options });
        },
      },
    }
  );

  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type") as EmailOtpType | null;
  const role = searchParams.get("role") as "admin" | "business" | null;

  if (!token_hash || !type || !role) {
    return NextResponse.redirect(
      new URL("/error?message=Invalid verification link", request.url)
    );
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash,
    type,
  });

  if (error) {
    return NextResponse.redirect(
      new URL("/error?message=Verification failed", request.url)
    );
  }

  const redirectTo = role === "admin" ? "/admin" : "/business";
  return NextResponse.redirect(new URL(redirectTo, request.url));
}
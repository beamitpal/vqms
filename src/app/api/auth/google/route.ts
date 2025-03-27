// api/auth/google/route.ts
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import { cookies } from "next/headers";

export async function GET(request: Request) {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getCookie: (name) => cookieStore.get(name)?.value,
    setCookie: (name, value, options) => cookieStore.set({ name, value, ...options }),
    deleteCookie: (name, options) => cookieStore.delete({ name, ...options }),
  });

  const { searchParams } = new URL(request.url);
  const role = searchParams.get("role") as "admin" | "business" | null;

  if (!role) {
    return NextResponse.redirect(new URL("/error?message=Invalid role", request.url));
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback?role=${role}`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    return NextResponse.redirect(new URL("/error?message=Google auth failed", request.url));
  }

  return NextResponse.redirect(data.url);
}
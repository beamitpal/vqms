
import { createServerClient } from "@supabase/ssr";
import type { CookieOptions as SupabaseCookieOptions } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY) are required.");
}

export const COOKIE_OPTIONS: SupabaseCookieOptions = {
  path: "/",
  secure: process.env.NODE_ENV === "production",
  httpOnly: true,
  sameSite: "lax",
  maxAge: 60 * 60 * 24 * 7,
};

export function createSupabaseServerClient({
  getCookie,
  setCookie,
  deleteCookie,
}: {
  getCookie: (name: string) => string | undefined;
  setCookie: (name: string, value: string, options: SupabaseCookieOptions) => void;
  deleteCookie: (name: string, options: SupabaseCookieOptions) => void;
}) {
  return createServerClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
    cookies: {
      get: getCookie,
      set: (name, value, options) => setCookie(name, value, { ...COOKIE_OPTIONS, ...options }),
      remove: (name, options) => deleteCookie(name, { ...COOKIE_OPTIONS, ...options }),
    },
    auth: {
      persistSession: true, 
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  });
}
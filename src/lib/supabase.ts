
"use client";

import { createBrowserClient } from "@supabase/ssr";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Supabase environment variables are missing");
}


export const supabase = typeof window !== "undefined"
  ? createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        get: (name) => {
          const cookies = document.cookie.split(";").reduce((acc, cookie) => {
            const [key, value] = cookie.trim().split("=");
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          return cookies[name];
        },
        set: (name, value, options) => {
          document.cookie = `${name}=${value}; Path=${options.path}; Max-Age=${options.maxAge}; ${options.secure ? "Secure;" : ""} ${options.httpOnly ? "HttpOnly;" : ""} SameSite=${options.sameSite}`;
        },
        remove: (name, options) => {
          document.cookie = `${name}=; Path=${options.path}; Max-Age=0; ${options.secure ? "Secure;" : ""} ${options.httpOnly ? "HttpOnly;" : ""} SameSite=${options.sameSite}`;
        },
      },
    })
  : null as ReturnType<typeof createBrowserClient>;
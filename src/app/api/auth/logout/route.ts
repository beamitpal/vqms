
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-server";


export async function POST() {
  const cookieStore = await cookies();
  const supabase = createSupabaseServerClient({
    getCookie: (name) => cookieStore.get(name)?.value,
    setCookie: (name, value, options) => cookieStore.set({ name, value, ...options }),
    deleteCookie: (name, options) => cookieStore.delete({ name, ...options }),
  });

  try {
    await supabase.auth.signOut();
    const response = NextResponse.json({ success: true });
    response.cookies.delete("sb-access-token");
    response.cookies.delete("sb-refresh-token");
    return response;
  } catch (error) {
    console.error("Logout  error:");
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Logout failed" },
      { status: 500 }
    );
  }
}
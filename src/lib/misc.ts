import { createSupabaseServerClient } from "./supabase-server";

export async function getBusiness(req: { cookies: { get: (name: string) => { value?: string } | undefined } }) {
    const supabase = await  createSupabaseServerClient({
        getCookie: (name) => req.cookies.get(name)?.value,
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        setCookie: (_name, _value, _options) => { }, // Handled in response
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        deleteCookie: (_name, _options) => { }, // Handled in response
      });
  const { data: userData, error } = await supabase.auth.getUser();
  if (error) throw error;
  return userData?.user;
}

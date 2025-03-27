import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
    const cookieStore = await cookies();
    const supabase = createSupabaseServerClient({
        getCookie: (name) => cookieStore.get(name)?.value,
        setCookie: (name, value, options) => cookieStore.set({ name, value, ...options }),
        deleteCookie: (name, options) => cookieStore.delete({ name, ...options }),
    });

    try {
        const { fullname, email, password, role } = await request.json();

        if (!email || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: { data: { fullname, role } }, // Include role in user metadata
        });

        if (error) throw error;

        // If email confirmation is required, session will be null
        if (!data.user) {
            return NextResponse.json({ error: "User creation failed" }, { status: 500 });
        }

        // Success response indicating email confirmation is needed
        return NextResponse.json({
            success: true,
            message: "User created successfully. Please check your email to confirm your account.",
            user: {
                id: data.user.id,
                email: data.user.email,
                fullname: data.user.user_metadata.fullname,
                role: data.user.user_metadata.role,
            },
        });
    } catch (error) {
        console.error("Signup API error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "Signup failed" },
            { status: 400 }
        );
    }
}
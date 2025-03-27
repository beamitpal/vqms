"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import LoginForm from "@/components/auth/login/form";
import { signInAsAdmin, resendVerificationEmail } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

function Page() {
  const router = useRouter();
  const [pendingResend, setPendingResend] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // ✅ Check if user is already logged in
  useEffect(() => {
    async function checkSession() {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        router.replace("/admin"); // Redirect if session exists
      } else {
        setCheckingSession(false); // Allow rendering login form
      }
    }

    checkSession();
  }, [router]);

  const handleLoginSubmit = async (values: {
    email: string;
    password: string;
  }) => {
    try {
      await signInAsAdmin(values.email, values.password);
      toast.success("Login successful! Redirecting...");
      router.push("/admin");
      console.log("✅ router.push executed"); // Debug log
    } catch (error) {
      console.error("❌ Login error:", error);
      if (error instanceof Error) {
        if (error.message.includes("Email not confirmed")) {
          setUnverifiedEmail(values.email);
          toast.error("⚠️ Email not confirmed! Please check your inbox.", {
            action: {
              label: "Resend",
              onClick: () => handleResendEmail(values.email),
            },
          });
        } else {
          toast.error(error.message || "Login failed! Please try again.");
        }
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleResendEmail = async (email: string) => {
    try {
      setPendingResend(true);
      await resendVerificationEmail(email);
      toast.success("✅ Verification email sent! Check your inbox.");
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message || "❌ Failed to send verification email.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    } finally {
      setPendingResend(false);
    }
  };

  // ✅ Show loading state while checking session
  if (checkingSession) {
    return (
      <div className="flex flex-col justify-center items-center h-screen space-y-4">
        <Skeleton className=" bg-background rounded-md h-98 w-86 max-w-sm" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <LoginForm
        onSubmit={handleLoginSubmit}
        forgot={
          <Link
            href="/admin/forgot-password"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Forgot Password?
          </Link>
        }
      />

      {unverifiedEmail && (
        <div className="text-center space-y-2">
          <p className="text-red-500 text-sm">
            Your email is not verified. Please verify it before logging in.
          </p>
          <Button
            onClick={() => handleResendEmail(unverifiedEmail)}
            disabled={pendingResend}
            className=" w-full"
          >
            {pendingResend ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>
      )}
    </div>
  );
}

export default Page;

"use client";

import LoginForm from "@/components/auth/login/form";
import Logo from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { signInWithGoogle, resendVerificationEmail, getBusiness } from "@/lib/auth";
import { supabase } from "@/lib/supabase"; 
import { LoginFormValues } from "@/lib/types";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { toast } from "sonner";

function BusinessLoginPage() {
  const router = useRouter();
  const [pendingResend, setPendingResend] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkAndRedirect = async () => {
      try {
        const user = await getBusiness();
        if (user) {
          console.log("User already logged in:", user);
          toast.success("Already logged in! Redirecting...");
          router.push("/business");
          router.refresh();
        }
      } catch (error) {
        console.log("No active session on mount:", error);
      }
    };

    checkAndRedirect();


    const { data: authListener } = supabase.auth.onAuthStateChange((event: string, session: { user: { id: string; email: string } } | null) => {
      console.log("Auth state changed:", event, session);
      if (event === "SIGNED_IN" && session?.user) {
        toast.success("Login successful! Redirecting...");
        router.push("/business");
        router.refresh();
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting login with:", values);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role: "business" }),
        credentials: "include",
      });

      const response = await res.json();
      console.log("Login API response:", response);

      if (!res.ok) {
        throw new Error(response.error || "Login failed");
      }

      toast.success("Login successful! Redirecting...");
    } catch (error) {
      toast.error("Login error");
      if (error instanceof Error) {
        if (error.message.includes("Email not confirmed")) {
          setUnverifiedEmail(values.email);
          toast.error("Email not confirmed! Please check your inbox.", {
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
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendEmail = async (email: string) => {
    try {
      setPendingResend(true);
      await resendVerificationEmail(email);
      toast.success("Verification email sent! Check your inbox.");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send verification email."
      );
    } finally {
      setPendingResend(false);
    }
  };

  const onGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle("business");
      toast.success("Google login successful! Redirecting...");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to login.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <Link
        href="/business"
        className="flex items-center gap-2 self-center font-medium"
      >
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Logo className="size-16" />
        </div>
        VQMS
      </Link>
      <LoginForm
        onSubmit={handleLoginSubmit}
        isLoading={isLoading}
        footer={
          <div className="flex flex-col gap-4">
            <span className="text-sm text-muted-foreground">
              Don&apos;t have an account?
              <Link
                href="/business/signup"
                className="text-sm text-foreground hover:text-accent ml-1"
              >
                Sign Up
              </Link>
            </span>
          </div>
        }
        header={
          <>
            <div className="flex flex-col gap-4">
              <Button
                variant="outline"
                className="w-full"
                onClick={onGoogle}
                disabled={isLoading}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-5 w-5 mr-2"
                >
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                {isLoading ? "Loading..." : "Login with Google"}
              </Button>
            </div>
            <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
              <span className="relative z-10 bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </>
        }
        forgot={
          <Link
            href="/business/forgot-password"
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
            disabled={pendingResend || isLoading}
            className="w-full"
          >
            {pendingResend ? "Sending..." : "Resend Verification Email"}
          </Button>
        </div>
      )}

      <div className="text-balance text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary  ">
        By clicking continue, you agree to our{" "}
        <Link href="/terms">Terms of Service</Link>
        and <Link href="/privacy">Privacy Policy</Link>.
      </div>
    </div>
  );
}

export default BusinessLoginPage;
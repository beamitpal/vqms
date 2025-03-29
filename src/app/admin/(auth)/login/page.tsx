"use client";

import LoginForm from "@/components/auth/login/form";
import Logo from "@/components/brand/logo";
import { Button } from "@/components/ui/button";
import { resendVerificationEmail, getAdmin } from "@/lib/auth";
import { supabase } from "@/lib/supabase"; // Ensure this is set up
import { LoginFormValues } from "@/lib/types";
import Link from "next/link";

import React, { useState, useEffect } from "react";
import { toast } from "sonner";

function AdminLoginPage() {
  // Removed unused router variable
  const [pendingResend, setPendingResend] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Check initial session on mount
  useEffect(() => {
    const checkInitialSession = async () => {
      try {
        const user = await getAdmin();
        console.log("Initial admin session check:", { user });
        if (user) {
          console.log("Admin already authenticated, redirecting...");
          toast.success("Already logged in! Redirecting...");
          window.location.href = "/admin"; // Force redirect
        }
      } catch (error) {
        console.log("No initial admin session or error:", error);
      }
    };

    checkInitialSession();
  }, []);

  const handleLoginSubmit = async (values: LoginFormValues) => {
    try {
      setIsLoading(true);
      console.log("Attempting admin login with:", values);

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, role: "admin" }),
        credentials: "include",
      });

      const response = await res.json();
      console.log("Login API response:", response);

      if (!res.ok) {
        throw new Error(response.error || "Login failed");
      }

      // Check Supabase auth state after login
      const { data: userData, error: authError } = await supabase.auth.getUser();
      console.log("Supabase auth state post-login:", { user: userData.user, authError });

      if (authError) {
        console.error("Auth state check failed:", authError);
        throw authError;
      }

      if (userData.user) {
        console.log("Admin authenticated, redirecting...");
        toast.success("Login successful! Redirecting...");
        window.location.href = "/admin"; // Force redirect
      } else {
        console.error("No user found in Supabase auth state after successful login.");
        throw new Error("Authentication state not updated. Please try again.");
      }
    } catch (error) {
      toast.error("Login Failed");
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
          console.error("Login error:", error);
        }
      } else {
        toast.error("An unexpected error occurred.");
        console.error("Unexpected error:", error);
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

  return (
    <div className="flex flex-col justify-center items-center h-screen space-y-4">
      <Link
        href="/admin"
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

export default AdminLoginPage;
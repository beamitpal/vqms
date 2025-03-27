"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { forgotPasswordFormSchema, ForgotFormProps } from "@/lib/types";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { resetPasswordForEmail } from "@/lib/auth";
import { toast } from "sonner";
import { usePathname } from "next/navigation";

function ForgotPasswordForm({ back }: ForgotFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof forgotPasswordFormSchema>>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const pathname = usePathname();
  const role = pathname.includes("admin") ? "admin" : "business";

  async function onSubmit(values: z.infer<typeof forgotPasswordFormSchema>) {
    setIsLoading(true);
    try {
      await resetPasswordForEmail(values.email, role);
      toast.success("✅ Password reset email sent! Check your inbox.");
      form.reset(); // Clear the form after success
    } catch (error) {
      console.error("Forgot password error:", error);
      if (error instanceof Error) {
        if (error.message.includes("User not found")) {
          toast.error("❌ No account found with this email.");
        } else {
          toast.error(error.message || "❌ Failed to send reset email.");
        }
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-sm w-full bg-background">
      <CardHeader>
        <CardTitle className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Forgot Your Password?
        </CardTitle>
        <CardDescription className="leading-7">
          Enter your account email to receive a password reset link.
        </CardDescription>
      </CardHeader>
      <Separator className="w-full" />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="abc@example.com"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    We’ll send a reset link to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button 
              className="w-full" 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {back && (
        <CardFooter className="flex justify-center items-center">
          {back}
        </CardFooter>
      )}
    </Card>
  );
}

export default ForgotPasswordForm;
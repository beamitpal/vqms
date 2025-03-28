"use client";

import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updatePassword } from "@/lib/auth";
import { ResetFormProps, ResetPasswordFormSchema } from "@/lib/types";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

function ResetPasswordForm({ back }: ResetFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof ResetPasswordFormSchema>>({
    resolver: zodResolver(ResetPasswordFormSchema),
    defaultValues: {
      password: "",
      confirm: "",
    },
  });

  const pathname = usePathname();
  const router = useRouter();
  const role = pathname.includes("admin") ? "admin" : "business";

  async function onSubmit(values: z.infer<typeof ResetPasswordFormSchema>) {
    setIsLoading(true);
    try {
      await updatePassword(values.password); // Use password, not confirm
      toast.success("✅ Password Reset Successfully!");
      router.push(`/${role}/login`);
    } catch (error) {
      toast.error("Reset password error");
      if (error instanceof Error) {
        if (
          error.message.includes("Invalid login credentials") ||
          error.message.includes("token")
        ) {
          toast.error(
            "❌ Reset link expired or invalid. Please request a new one."
          );
        } else {
          toast.error(error.message || "❌ Failed to reset password.");
        }
      } else {
        toast.error("❌ An unexpected error occurred.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full bg-background max-w-sm">
      <CardHeader>
        <CardTitle className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
          Reset Your Password
        </CardTitle>
        <CardDescription className="leading-7">
          Enter and confirm your new password to update your account.
        </CardDescription>
      </CardHeader>
      <Separator className="w-full" />
      <CardContent className="pt-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Must be at least 8 characters long
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm New Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Confirm new password"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>Must match the new password</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? "Resetting..." : "Reset Password"}
            </Button>
          </form>
        </Form>
      </CardContent>
      {back && <CardFooter>{back}</CardFooter>}
    </Card>
  );
}

export default ResetPasswordForm;

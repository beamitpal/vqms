
"use client";
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
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginFormProps, loginformSchema } from "@/lib/types";
import { useState } from "react";
import { toast } from "sonner";

function LoginForm({
  onSubmit,
  footer,
  header,
  forgot,
  isLoading,
}: LoginFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm<z.infer<typeof loginformSchema>>({
    resolver: zodResolver(loginformSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function handleSubmit(values: z.infer<typeof loginformSchema>) {
    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch {
      toast.error("Login failed:");
    } finally {
      setIsSubmitting(false);
    }
  }


  const submitDisabled = isLoading !== undefined ? isLoading : isSubmitting;

  return (
    <Card className="bg-background max-w-sm w-full">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Google Account or Email Address
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-8"
          >
            <div className="grid gap-6">
              {header && header}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="abc@example.com"
                        {...field}
                        disabled={submitDisabled}
                      />
                    </FormControl>
                    <FormDescription>Enter Your Email Address</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="abc@1234"
                        {...field}
                        disabled={submitDisabled}
                      />
                    </FormControl>
                    <FormDescription>Enter Your Password</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {forgot && forgot}
              <Button
                type="submit"
                className="w-full"
                disabled={submitDisabled}
              >
                {submitDisabled ? "Logging in..." : "Login"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </Card>
  );
}

export default LoginForm;

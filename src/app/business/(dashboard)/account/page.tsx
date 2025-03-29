"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, RefreshCw } from "lucide-react";
import {
  AccountDetailsFormSchema,
  AccountDetailsFormValues,
  AvatarFormSchema,
  AvatarFormValues,
  NewDetailsFormSchema,
  NewDetailsFormValues,
  PasswordFormSchema,
  PasswordFormValues,
} from "@/lib/types";

export default function AccountPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    user_metadata?: {
      full_name?: string;
      phone?: string;
      bio?: string;
      avatar_url?: string;
    };
  } | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const router = useRouter();

  const accountForm = useForm<AccountDetailsFormValues>({
    resolver: zodResolver(AccountDetailsFormSchema),
    defaultValues: { email: "", fullName: "" },
  });

  const newDetailsForm = useForm<NewDetailsFormValues>({
    resolver: zodResolver(NewDetailsFormSchema),
    defaultValues: { phone: "", bio: "" },
  });

  const avatarForm = useForm<AvatarFormValues>({
    resolver: zodResolver(AvatarFormSchema),
    defaultValues: { avatar: undefined },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(PasswordFormSchema),
    defaultValues: { password: "", confirm: "" },
  });

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();
      if (error || !user) {
        toast.error("❌ Failed to load user data. Please log in again.");
        router.push("/login");
        return;
      }
      setUser(user);
      accountForm.reset({
        email: user.email || "",
        fullName: user.user_metadata?.full_name || "",
      });
      newDetailsForm.reset({
        phone: user.user_metadata?.phone || "",
        bio: user.user_metadata?.bio || "",
      });
      setAvatarPreview(user.user_metadata?.avatar_url || null);
    };
    fetchUser();
  }, [accountForm, newDetailsForm, router]);

  async function onAccountSubmit(values: AccountDetailsFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        email: values.email,
        data: { full_name: values.fullName },
      });
      if (error) throw error;
      toast.success("✅ Account details updated successfully!");
    } catch (error) {
      toast.error("Update account error");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onNewDetailsSubmit(values: NewDetailsFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: { phone: values.phone, bio: values.bio },
      });
      if (error) throw error;
      toast.success("✅ Additional details updated successfully!");
    } catch (error) {
      toast.error("Update new details error");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onAvatarSubmit(values: AvatarFormValues) {
    if (!values.avatar) return;
    setIsLoading(true);
    try {
      const file = values.avatar;
      const fileExt = file.name.split(".").pop();
      if (!user) {
        toast.error("❌ User not found. Please log in again.");
        return;
      }
      const fileName = `${user.id}-${Date.now()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl },
      });
      if (updateError) throw updateError;

      setAvatarPreview(publicUrl);
      toast.success("✅ Avatar updated successfully!");
      avatarForm.reset();
    } catch (error) {
      toast.error("Update avatar error");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  async function onPasswordSubmit(values: PasswordFormValues) {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: values.password,
      });
      if (error) throw error;
      toast.success("✅ Password updated successfully!");
      passwordForm.reset();
    } catch (error) {
      toast.error("Update password error");
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  }

  function handleError(error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes("Email rate limit exceeded")) {
        toast.error("❌ Too many email updates. Please try again later.");
      } else if (error.message.includes("duplicate")) {
        toast.error("❌ This email is already in use.");
      } else {
        toast.error(error.message || "❌ Failed to update details.");
      }
    } else {
      toast.error("❌ An unexpected error occurred.");
    }
  }

  if (!user && !isLoading)
    return (
      <div className="h-screen flex justify-center items-center">
        <RefreshCw className="animate-spin m-2" />
      </div>
    ); 

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          size="lg"
          className="mb-4 flex items-center gap-2"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold mb-6">Account Settings</h1>
        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Account Details
                </CardTitle>
                <CardDescription>
                  Update your email and full name.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Form {...accountForm}>
                  <form
                    onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={accountForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>Your login email.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={accountForm.control}
                      name="fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter your full name"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>2-100 characters.</FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoading}
                    >
                      {isLoading ? "Updating..." : "Update Details"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Additional Details
                </CardTitle>
                <CardDescription>
                  Add or update your phone number and bio.
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Form {...newDetailsForm}>
                  <form
                    onSubmit={newDetailsForm.handleSubmit(onNewDetailsSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={newDetailsForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Enter your phone number"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional, 10-15 digits.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={newDetailsForm.control}
                      name="bio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Bio</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter a short bio"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Optional, max 500 characters.
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
                      {isLoading ? "Updating..." : "Update Details"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Update Avatar
                </CardTitle>
                <CardDescription>
                  Upload a new profile picture (JPEG, PNG, GIF, max 5MB).
                </CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Form {...avatarForm}>
                  <form
                    onSubmit={avatarForm.handleSubmit(onAvatarSubmit)}
                    className="space-y-6"
                  >
                    <div className="flex justify-center mb-4">
                      <Avatar className="h-24 w-24">
                        <AvatarImage
                          src={avatarPreview || "/default-avatar.png"}
                          alt="User avatar"
                        />
                        <AvatarFallback>
                          {user?.user_metadata?.full_name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <FormField
                      control={avatarForm.control}
                      name="avatar"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Avatar</FormLabel>
                          <FormControl>
                            <Input
                              type="file"
                              accept="image/jpeg,image/png,image/gif"
                              disabled={isLoading}
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  field.onChange(file);
                                  setAvatarPreview(URL.createObjectURL(file));
                                }
                              }}
                            />
                          </FormControl>
                          <FormDescription>
                            JPEG, PNG, or GIF, max 5MB.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full"
                      type="submit"
                      disabled={isLoading || !avatarForm.watch("avatar")}
                    >
                      {isLoading ? "Uploading..." : "Upload Avatar"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="bg-background">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold">
                  Update Password
                </CardTitle>
                <CardDescription>Change your account password.</CardDescription>
              </CardHeader>
              <Separator />
              <CardContent className="pt-6">
                <Form {...passwordForm}>
                  <form
                    onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                    className="space-y-6"
                  >
                    <FormField
                      control={passwordForm.control}
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
                            At least 8 characters.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={passwordForm.control}
                      name="confirm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm new password"
                              disabled={isLoading}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Must match the new password.
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
                      {isLoading ? "Updating..." : "Update Password"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

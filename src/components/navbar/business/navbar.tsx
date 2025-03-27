"use client";

import Logo from "@/components/brand/logo";
import { ReusableBreadCrumb } from "@/components/breadcrumb/reusable-breadcrumb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function BusinessNavBar() {
  const [user, setUser] = useState<{
    name: string;
    email: string;
    avatar: string;
  } | null>(null);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      try {
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError || !session) {
          router.push("/business/login");
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          router.push("/business/login");
          return;
        }

        if (isMounted) {
          setUser({
            name: user.user_metadata.full_name || "Business",
            email: user.email || "",
            avatar:
              user.user_metadata.avatar_url ||
              "https://github.com/beamitpal.png",
          });
        }
      } catch (error) {
        console.error("User fetch error:", error);
        router.push("/business/login");
      }
    };

    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (
        event:
          | "SIGNED_IN"
          | "SIGNED_OUT"
          | "PASSWORD_RECOVERY"
          | "TOKEN_REFRESH"
      ) => {
        if (event === "SIGNED_OUT") {
          router.push("/business/login");
        }
      }
    );

    return () => {
      isMounted = false;
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/business/login");
      router.refresh();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <header className="flex h-14 items-center border-b px-4 lg:px-6">
      {/* Left Section: Sidebar Trigger, Logo & Brand Name */}
      <div className="flex items-center gap-3">
        <SidebarTrigger size="icon" variant="outline" />
        <Logo className="h-8 w-8" />

        <Separator orientation="vertical" className="h-6" />
        <ReusableBreadCrumb path={pathname} />
      </div>

      {/* Right Section: Avatar Dropdown */}
      <div className="ml-auto">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar>
              {user && (
                <>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </>
              )}
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className=" bg-background">
            {user && <DropdownMenuLabel>Hello, {user.name} </DropdownMenuLabel>}
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link href="/business/account"><DropdownMenuItem>My Account <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut></DropdownMenuItem></Link>
              <Link href="/business/settings"><DropdownMenuItem>Settings<DropdownMenuShortcut>⇧⌘B</DropdownMenuShortcut></DropdownMenuItem></Link>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>Log out <DropdownMenuShortcut>⇧⌘M</DropdownMenuShortcut></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

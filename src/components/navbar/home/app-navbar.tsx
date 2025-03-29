"use client";

import { usePathname } from "next/navigation";
import Logo from "@/components/brand/logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn, User } from "lucide-react";

export default function HomeNavbar() {
  const pathname = usePathname();

  const navLinks = [
    { href: "/book", label: "Join Queue" },
    { href: "/contact", label: "Contact" },
    { href: "/about", label: "About" },
    { href: "/privacy", label: "Privacy" },
    { href: "/terms", label: "Terms & Conditions" },
  ];

  return (
    <header className="sticky top-0 flex w-full items-center gap-4 border-b bg-background px-4 min-h-16 md:px-6">
      <div className="flex items-center gap-4">
        <div className="md:hidden">
          <SidebarTrigger size="icon" variant="outline" className="m-1" />
        </div>
        <Link
          href="/"
          className="flex items-center gap-2 text-lg font-semibold md:text-base"
        >
          <Logo className="size-8" />
          <span className=" gap-0.5">VQMS</span>
        </Link>
      </div>
      <nav className="hidden md:flex flex-col md:flex-row items-center gap-5 text-sm lg:gap-6 flex-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-foreground ${
                isActive ? "text-foreground" : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" asChild>
          <Link href="/business/login">
            Login
            <LogIn />
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/business/signup"> <User /> Sign Up</Link>
        </Button>
      </div>
      &nbsp;
      <Separator orientation="vertical" className="hidden md:block h-12 mx-4" />
    </header>
  );
}

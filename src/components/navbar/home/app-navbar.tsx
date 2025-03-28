
"use client"; 

import { usePathname } from "next/navigation"; 
import Logo from "@/components/brand/logo";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomeNavbar() {
  const pathname = usePathname(); 

  // Array of navigation links
  const navLinks = [
    { href: "/dashboard", label: "Dashboard", muted: true },
    { href: "/orders", label: "Orders", muted: true },
    { href: "/products", label: "Products", muted: true },
    { href: "/customers", label: "Customers", muted: true },
    { href: "/settings", label: "Settings", muted: false },
  ];

  return (
    <header className="sticky top-0 flex w-full items-center gap-4 border-b bg-background px-4 md:px-6">
    
      <div className="flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold md:text-base">
          <Logo className="size-8" />
          <span className="sr-only">VQMS</span>
        </Link>
        <div className="md:hidden">
          <SidebarTrigger size="icon" variant="outline" className="m-1" />
        </div>
      </div>

  
      <nav className="hidden md:flex flex-col md:flex-row items-center gap-5 text-sm lg:gap-6 flex-1">
        {navLinks.map((link) => {
          const isActive = pathname === link.href; // Check if the current path matches the link
          return (
            <Link
              key={link.label}
              href={link.href}
              className={`transition-colors hover:text-foreground ${
                isActive ? "text-foreground" : link.muted ? "text-muted-foreground" : "text-foreground"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

   
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="outline" size="sm" asChild>
          <Link href="/business/login">Login</Link>
        </Button>
        <Button size="sm" asChild>
          <Link href="/business/signup">Sign Up</Link>
        </Button>
      </div>

      <Separator orientation="vertical" className="hidden md:block h-12 mx-4" />
    </header>
  );
}
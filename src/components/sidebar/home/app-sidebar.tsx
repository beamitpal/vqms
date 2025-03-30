"use client";
import Logo from "@/components/brand/logo";
import {
  Sidebar,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Book,
  Contact,
  PersonStanding,
  Phone,
  TerminalIcon,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
export function HomeAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const data = {
    navMain: [
      { title: "Join Queue", url: "/book", label: "Join Queue", icon: Book },
      { title: "Contact", url: "/contact", label: "Contact", icon: Contact },
      { title: "About", url: "/about", label: "About", icon: PersonStanding },
      { title: "Privacy", url: "/privacy", label: "Privacy", icon: Phone },
      {
        title: " Terms & Conditions",
        url: "/terms",
        label: "Terms & Conditions",
        icon: TerminalIcon,
      },
    ],
  };

  const isRouteActive = (pathname: string | null, url: string) => {
    if (!pathname || !url) return false;

    if (url === "/business") return pathname === url;

    return pathname.startsWith(url);
  };
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/business" onClick={toggleSidebar}>
                <Logo className="size-10" />
                <span className="text-base font-semibold">VQMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                isActive={isRouteActive(pathname, item.url)}
                tooltip={item.title}
              >
                <Link href={item.url} onClick={toggleSidebar}>
                  <item.icon />
                  <span>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarHeader>
    </Sidebar>
  );
}

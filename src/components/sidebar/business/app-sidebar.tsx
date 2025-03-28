"use client";
import Logo from "@/components/brand/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  BookOpen,
  FolderOpenDot,
  LayoutDashboard,
  Settings2,
  Users,
} from "lucide-react";

import Link from "next/link";
import { usePathname } from "next/navigation";
export function BusinessAppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  const data = {
    navMain: [
      {
        title: "Dashboard",
        url: "/business",
        icon: LayoutDashboard,
      },
      {
        title: "Projects",
        url: "/business/projects",
        icon: FolderOpenDot,
      },
      {
        title: "Queue Manage",
        url: "/business/queue-manage",
        icon: Users,
      },

      {
        title: "API Documentation",
        url: "/business/api-docs",
        icon: BookOpen,
      },
      {
        title: "Settings",
        url: "/business/settings",
        icon: Settings2,
      },
    ],
  };

  const isRouteActive = (pathname: string | null, url: string) => {
    if (!pathname || !url) return false;

    if (url === "/business") return pathname === url;
   
    return pathname.startsWith(url);
  };
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/business">
                <Logo className="size-10" />
                <span className="text-base font-semibold">VQMS</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        <SidebarContent>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isRouteActive(pathname, item.url)}
                  tooltip={item.title}
                >
                  <Link href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
      </SidebarHeader>
    </Sidebar>
  );
}

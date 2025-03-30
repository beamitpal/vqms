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
  BookOpen,
  FolderOpenDot,
  LayoutDashboard,
  Settings2,
  Users,
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

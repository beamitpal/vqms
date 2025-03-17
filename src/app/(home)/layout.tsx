import HomeNavbar from "@/components/navbar/home/app-navbar";
import { HomeAppSidebar } from "@/components/sidebar/home/app-sidebar";

import { SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider defaultOpen={false} className="flex h-screen">
      <HomeAppSidebar />
      <div className="flex flex-col flex-1">
        <HomeNavbar />
     
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:p-10">{children}</main>
      </div>
    </SidebarProvider>
  );
}

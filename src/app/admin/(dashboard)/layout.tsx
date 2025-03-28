import AdminNavBar from "@/components/navbar/admin/navbar";

import { AdminAppSidebar } from "@/components/sidebar/admin/app-sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AdminAppSidebar variant="inset" />
      <SidebarInset>
        <AdminNavBar />
        <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-background p-4 md:gap-8 md:p-10">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { Outlet } from "react-router-dom";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AdminChatWidget } from "@/components/chat/AdminChatWidget";

export function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <AdminHeader />
          <main className="flex-1 p-3 md:p-6 bg-background overflow-x-hidden">
            <Outlet />
          </main>
        </div>
      </div>
      <AdminChatWidget />
    </SidebarProvider>
  );
}
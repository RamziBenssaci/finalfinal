import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Package,
  Archive,
  Settings,
  BarChart3,
  MapPin,
  Shield,
} from "lucide-react";

const menuItems = [
  {
    title: "Clients",
    url: "/admin",
    icon: Users,
  },
  {
    title: "Shipments",
    url: "/admin/shipments",
    icon: Package,
  },
  {
    title: "Shipping Addresses",
    url: "/admin/shipping-addresses",
    icon: MapPin,
  },
  {
    title: "Discounts",
    url: "/admin/discounts",
    icon: BarChart3,
  },
  {
    title: "Insured Packages",
    url: "/admin/insured-packages",
    icon: Shield,
  },
  {
    title: "Customs Requests",
    url: "/admin/customs-requests",
    icon: Package,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <Sidebar className={collapsed ? "w-14" : "w-60"}>
      <SidebarContent>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">A</span>
            </div>
            {!collapsed && (
              <span className="font-semibold text-lg">Admin Panel</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/admin"}
                      className={({ isActive: navIsActive }) =>
                        `flex items-center space-x-2 ${
                          navIsActive || isActive(item.url)
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted/50"
                        }`
                      }
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
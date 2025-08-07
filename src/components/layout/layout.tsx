import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "./app-sidebar"
import { ChatWidget } from "@/components/chat/ChatWidget"
import { ReactNode } from "react"
import { LogOut, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CountrySelector } from "@/components/ui/navigation-selector"
import { InsuranceModal, DiscountCodeModal } from "@/components/ui/modals"
import { NotificationsModal } from "@/components/modals/NotificationsModal"
import { ApiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { useQuery } from "@tanstack/react-query"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)

  const { data: notificationsResponse } = useQuery({
    queryKey: ["user-notifications"],
    queryFn: () => ApiService.getUserNotifications(),
    refetchInterval: 30000, // Refetch every 30 seconds
  })

  const notifications = notificationsResponse?.data || []
  const unreadCount = notifications.filter((n: any) => !n.is_read).length

  const handleLogout = async () => {
    try {
      await ApiService.logout()
      toast({
        title: "Logged out successfully",
        description: "You have been signed out of your account.",
      })
      navigate("/login")
    } catch (error) {
      toast({
        title: "Logout failed",
        description: "There was an error logging out. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <main className="flex-1 flex flex-col min-w-0">
          {/* Header */}
          <header className="h-14 md:h-16 flex items-center justify-between px-2 md:px-4 lg:px-6 border-b border-border bg-card">
            <div className="flex items-center space-x-1 md:space-x-2 lg:space-x-4 flex-1 min-w-0 overflow-hidden">
              <SidebarTrigger className="text-foreground flex-shrink-0" />
              <div className="flex items-center space-x-1 md:space-x-2 overflow-x-auto">
                <div className="flex-shrink-0">
                  <CountrySelector />
                </div>
                <div className="flex-shrink-0">
                  <InsuranceModal />
                </div>
                <div className="flex-shrink-0">
                  <DiscountCodeModal />
                </div>
              </div>
              
              {/* Shipping Status */}
              <div className="hidden xl:flex items-center space-x-2 text-sm text-muted-foreground ml-auto">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>All shipping methods operational</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setIsNotificationsOpen(true)}
                  className="flex items-center space-x-1 relative"
                >
                  <Bell className="w-4 h-4" />
                  <span className="hidden md:inline">Notifications</span>
                  {unreadCount > 0 && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-xs rounded-full flex items-center justify-center font-bold">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </div>
                  )}
                </Button>
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleLogout}
                className="flex items-center space-x-1"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Logout</span>
              </Button>
            </div>
          </header>
          
          {/* Content */}
          <div className="flex-1 p-3 md:p-4 lg:p-6 overflow-x-hidden">
            {children}
          </div>
        </main>
      </div>

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
      <ChatWidget />
    </SidebarProvider>
  )
}
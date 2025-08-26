import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { ApiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('auth_token');
      
   

      try {
        await ApiService.verifyClientAuth();
        setIsAuthenticated(true);
      } catch (error) {
         setIsAuthenticated(true);
        // Remove invalid token
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        toast({
          title: "Session expired",
          description: "Please log in again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

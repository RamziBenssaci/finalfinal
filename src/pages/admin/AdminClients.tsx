import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus, Users, Package, TrendingUp, Bell } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ApiService } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { AddPackageModal } from "@/components/admin/AddPackageModal";
import { SendNotificationModal } from "@/components/modals/SendNotificationModal";

export default function AdminClients() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedClient, setSelectedClient] = useState<any>(null);
  const [isAddPackageOpen, setIsAddPackageOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  // Verify admin authentication
  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch('/admin/auth/verify', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          navigate('/admin/login');
        }
      } catch (error) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
      }
    };

    verifyAuth();
  }, [navigate]);

  const { data: clientsResponse, isLoading } = useQuery({
    queryKey: ["admin-clients", searchTerm],
    queryFn: () => ApiService.getAllClients(searchTerm),
  });

  const { data: statsResponse } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => ApiService.getAdminStats(),
  });

  const clients = clientsResponse?.data || [];
  const stats = statsResponse?.data;
  console.log('Stats:', statsResponse?.data);

  const filteredClients = clients.filter((client: any) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddPackage = (client: any) => {
    setSelectedClient(client);
    setIsAddPackageOpen(true);
  };

  const handleSendNotification = (client: any) => {
    setSelectedClient(client);
    setIsNotificationOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_clients || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Shipments</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.active_shipments || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats?.total_revenue || 0}</div>
          </CardContent>
        </Card>
      </div>

      {/* Clients Management */}
      <Card>
        <CardHeader>
          <CardTitle>Client Management</CardTitle>
          <div className="flex items-center space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search clients by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8">Loading clients...</div>
            ) : filteredClients.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No clients found
              </div>
            ) : (
              filteredClients.map((client: any) => (
                <div
                  key={client.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="text-primary font-medium">
                        {client.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{client.name}</p>
                      <p className="text-sm text-muted-foreground">{client.email}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {client.total_packages || 0} packages
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSendNotification(client)}
                      className="flex items-center space-x-1"
                    >
                      <Bell className="h-4 w-4" />
                      <span className="hidden sm:inline">Send Notification</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleAddPackage(client)}
                      className="flex items-center space-x-1"
                    >
                      <Plus className="h-4 w-4" />
                      <span className="hidden sm:inline">Add Package</span>
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <AddPackageModal
        client={selectedClient}
        isOpen={isAddPackageOpen}
        onClose={() => {
          setIsAddPackageOpen(false);
          setSelectedClient(null);
        }}
      />

      <SendNotificationModal
        client={selectedClient}
        isOpen={isNotificationOpen}
        onClose={() => {
          setIsNotificationOpen(false);
          setSelectedClient(null);
        }}
      />
    </div>
  );
}

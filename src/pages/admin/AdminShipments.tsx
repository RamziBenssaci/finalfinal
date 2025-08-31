import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api";

interface PackageShipment {
id: string;
packageId: string;
clientId: string;
clientName: string;
clientEmail: string;
description: string;
country: string;
shippingMethod: string;
weight: number;
price: number;
status: "pending" | "shipped" | "arrived";
trackingNumber: string;
createdAt: string;
arrivedAt?: string;
}

export default function AdminShipments() {
const navigate = useNavigate();
const { toast } = useToast();
const queryClient = useQueryClient();
const [searchTerm, setSearchTerm] = useState("");

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

// Fetch all shipments
const { data: shipments = [], isLoading } = useQuery({
queryKey: ['admin-shipments'],
queryFn: () => ApiService.getAllShipments().then(res => res.data)
});

// Update package status mutation
const updateStatusMutation = useMutation({
mutationFn: ({ packageId, status }: { packageId: number, status: string }) => 
ApiService.updatePackageStatus(packageId, status),
onSuccess: () => {
queryClient.invalidateQueries({ queryKey: ['admin-shipments'] });
toast({
title: "Success",
description: "Package status updated successfully"
});
},
onError: (error: any) => {
toast({
title: "Error",
description: error.message || "Failed to update package status",
variant: "destructive"
});
}
});

const filteredShipments = shipments.filter((shipment: any) =>
shipment.client_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
shipment.package_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
shipment.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
shipment.description?.toLowerCase().includes(searchTerm.toLowerCase())
);

const handleMarkArrived = (packageId: number) => {
updateStatusMutation.mutate({ packageId, status: "arrived" });
};

const getStatusBadge = (status: string) => {
const variants = {
pending: "secondary",
shipped: "default",
arrived: "default"
} as const;

const colors = {
pending: "bg-yellow-100 text-yellow-800",
shipped: "bg-blue-100 text-blue-800",
arrived: "bg-green-100 text-green-800"
};

return (
<Badge 
variant={variants[status as keyof typeof variants]} 
className={colors[status as keyof typeof colors]}
>
{status.charAt(0).toUpperCase() + status.slice(1)}
</Badge>
);
};

const getShipmentStats = () => {
const total = shipments.length;
const pending = shipments.filter(s => s.status === "pending").length;
const shipped = shipments.filter(s => s.status === "shipped").length;
const arrived = shipments.filter(s => s.status === "arrived").length;

return { total, pending, shipped, arrived };
};

const stats = getShipmentStats();

return (
<div className="space-y-6">
<div className="flex justify-between items-center">
<h1 className="text-2xl font-bold">Package Shipments</h1>
</div>

{/* Stats Cards */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<Card>
<CardContent className="p-4">
<div className="flex items-center space-x-2">
<Package className="h-4 w-4 text-muted-foreground" />
<div>
<p className="text-sm font-medium">Total</p>
<p className="text-2xl font-bold">{stats.total}</p>
</div>
</div>
</CardContent>
</Card>

<Card>
<CardContent className="p-4">
<div className="flex items-center space-x-2">
<div className="w-3 h-3 rounded-full bg-yellow-500"></div>
<div>
<p className="text-sm font-medium">Pending</p>
<p className="text-2xl font-bold">{stats.pending}</p>
</div>
</div>
</CardContent>
</Card>

<Card>
<CardContent className="p-4">
<div className="flex items-center space-x-2">
<div className="w-3 h-3 rounded-full bg-blue-500"></div>
<div>
<p className="text-sm font-medium">Shipped</p>
<p className="text-2xl font-bold">{stats.shipped}</p>
</div>
</div>
</CardContent>
</Card>

<Card>
<CardContent className="p-4">
<div className="flex items-center space-x-2">
<Check className="h-4 w-4 text-green-600" />
<div>
<p className="text-sm font-medium">Arrived</p>
<p className="text-2xl font-bold">{stats.arrived}</p>
</div>
</div>
</CardContent>
</Card>
</div>

{/* Search */}
<Card>
<CardContent className="p-4">
<div className="relative">
<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
<Input
placeholder="Search by client name, package ID, tracking number, or description..."
value={searchTerm}
onChange={(e) => setSearchTerm(e.target.value)}
className="pl-10"
/>
</div>
</CardContent>
</Card>

{/* Shipments Table - Desktop */}
<Card className="hidden md:block">
<CardHeader>
<CardTitle>All Package Shipments</CardTitle>
</CardHeader>
<CardContent>
<div className="overflow-x-auto">
<Table>
<TableHeader>
<TableRow>
<TableHead>Package ID</TableHead>
<TableHead>Client</TableHead>
<TableHead>Description</TableHead>
<TableHead>Country</TableHead>
<TableHead>Shipping Method</TableHead>
<TableHead>Weight</TableHead>
<TableHead>Price</TableHead>
<TableHead>Status</TableHead>
<TableHead>Tracking</TableHead>
<TableHead>Created</TableHead>
<TableHead>Actions</TableHead>
</TableRow>
</TableHeader>
<TableBody>
{filteredShipments.map((shipment: any) => (
<TableRow key={shipment.id}>
<TableCell className="font-medium">{shipment.package_id || shipment.id}</TableCell>
<TableCell>
<div>
<p className="font-medium">{shipment.client_name}</p>
<p className="text-sm text-muted-foreground">{shipment.client_email}</p>
</div>
</TableCell>
<TableCell>{shipment.description}</TableCell>
<TableCell>{shipment.country}</TableCell>
<TableCell>{shipment.shipping_method || 'Standard'}</TableCell>
<TableCell>{shipment.weight} kg</TableCell>
<TableCell>${shipment.price}</TableCell>
<TableCell>{getStatusBadge(shipment.status)}</TableCell>
<TableCell className="font-mono text-sm">{shipment.tracking_number}</TableCell>
<TableCell>{new Date(shipment.created_at).toLocaleDateString()}</TableCell>
                     <TableCell>
                       {shipment.status !== "arrived" && (
                         <Button
                           variant="outline"
                           size="sm"
                           onClick={() => handleMarkArrived(shipment.id)}
                           disabled={updateStatusMutation.isPending}
                           className="flex items-center gap-1"
                         >
                           <Check className="h-3 w-3" />
                           {updateStatusMutation.isPending ? "Updating..." : "Mark Arrived"}
                         </Button>
                       )}
                       {shipment.status === "arrived" && shipment.arrived_at && (
                         <span className="text-sm text-green-600">
                           Arrived: {new Date(shipment.arrived_at).toLocaleDateString()}
                         </span>
                       )}
                     </TableCell>
                    <TableCell className="space-y-1">
  {shipment.status !== "arrived" && (
    <div className="flex flex-col gap-1">
      {shipment.status !== "shipped" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatusMutation.mutate({ packageId: shipment.id, status: "shipped" })}
          disabled={updateStatusMutation.isPending}
          className="flex items-center gap-1"
        >
          <Package className="h-3 w-3" />
          {updateStatusMutation.isPending ? "Updating..." : "Mark Shipped"}
        </Button>
      )}

      {shipment.status !== "close_to_arrival" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatusMutation.mutate({ packageId: shipment.id, status: "close_to_arrival" })}
          disabled={updateStatusMutation.isPending}
          className="flex items-center gap-1"
        >
          <Check className="h-3 w-3 text-yellow-600" />
          {updateStatusMutation.isPending ? "Updating..." : "Mark Close to Arrival"}
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleMarkArrived(shipment.id)}
        disabled={updateStatusMutation.isPending}
        className="flex items-center gap-1"
      >
        <Check className="h-3 w-3 text-green-600" />
        {updateStatusMutation.isPending ? "Updating..." : "Mark Arrived"}
      </Button>
    </div>
  )}
  {shipment.status === "arrived" && shipment.arrived_at && (
    <span className="text-sm text-green-600">
      Arrived: {new Date(shipment.arrived_at).toLocaleDateString()}
    </span>
  )}
</TableCell>
</TableRow>
))}
</TableBody>
</Table>
</div>
</CardContent>
</Card>

{/* Shipments Cards - Mobile */}
<div className="md:hidden space-y-4">
{filteredShipments.map((shipment: any) => (
<Card key={shipment.id}>
<CardContent className="p-4">
<div className="space-y-3">
<div className="flex justify-between items-start">
<div>
<p className="font-medium text-sm text-muted-foreground">Package ID</p>
<p className="font-bold">{shipment.package_id || shipment.id}</p>
</div>
<div className="text-right">
{getStatusBadge(shipment.status)}
</div>
</div>

<div>
<p className="font-medium text-sm text-muted-foreground">Client</p>
<p className="font-medium">{shipment.client_name}</p>
<p className="text-sm text-muted-foreground">{shipment.client_email}</p>
</div>

<div className="grid grid-cols-2 gap-3">
<div>
<p className="font-medium text-sm text-muted-foreground">Country</p>
<p>{shipment.country}</p>
</div>
<div>
<p className="font-medium text-sm text-muted-foreground">Weight</p>
<p>{shipment.weight} kg</p>
</div>
<div>
<p className="font-medium text-sm text-muted-foreground">Price</p>
<p>${shipment.price}</p>
</div>
<div>
<p className="font-medium text-sm text-muted-foreground">Method</p>
<p>{shipment.shipping_method || 'Standard'}</p>
</div>
</div>

<div>
<p className="font-medium text-sm text-muted-foreground">Description</p>
<p>{shipment.description}</p>
</div>

<div>
<p className="font-medium text-sm text-muted-foreground">Tracking Number</p>
<p className="font-mono text-sm">{shipment.tracking_number}</p>
</div>

                <div className="flex justify-between items-center pt-2 border-t">
                  <div>
                    <p className="text-sm text-muted-foreground">Created: {new Date(shipment.created_at).toLocaleDateString()}</p>
                    {shipment.status === "arrived" && shipment.arrived_at && (
                      <p className="text-sm text-green-600">Arrived: {new Date(shipment.arrived_at).toLocaleDateString()}</p>
                    )}
                  </div>
                  {shipment.status !== "arrived" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleMarkArrived(shipment.id)}
                      disabled={updateStatusMutation.isPending}
                      className="flex items-center gap-1"
                    >
                      <Check className="h-3 w-3" />
                      {updateStatusMutation.isPending ? "Updating..." : "Mark Arrived"}
                    </Button>
                  )}
                </div>
              <div className="flex justify-between items-center pt-2 border-t">
  <div>
    <p className="text-sm text-muted-foreground">
      Created: {new Date(shipment.created_at).toLocaleDateString()}
    </p>
    {shipment.status === "arrived" && shipment.arrived_at && (
      <p className="text-sm text-green-600">
        Arrived: {new Date(shipment.arrived_at).toLocaleDateString()}
      </p>
    )}
  </div>

  {shipment.status !== "arrived" && (
    <div className="flex flex-col gap-1 items-end">
      {shipment.status !== "shipped" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatusMutation.mutate({ packageId: shipment.id, status: "shipped" })}
          disabled={updateStatusMutation.isPending}
          className="flex items-center gap-1"
        >
          <Package className="h-3 w-3" />
          {updateStatusMutation.isPending ? "Updating..." : "Mark Shipped"}
        </Button>
      )}

      {shipment.status !== "close_to_arrival" && (
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateStatusMutation.mutate({ packageId: shipment.id, status: "close_to_arrival" })}
          disabled={updateStatusMutation.isPending}
          className="flex items-center gap-1"
        >
          <Check className="h-3 w-3 text-yellow-600" />
          {updateStatusMutation.isPending ? "Updating..." : "Mark Close to Arrival"}
        </Button>
      )}

      <Button
        variant="outline"
        size="sm"
        onClick={() => handleMarkArrived(shipment.id)}
        disabled={updateStatusMutation.isPending}
        className="flex items-center gap-1"
      >
        <Check className="h-3 w-3 text-green-600" />
        {updateStatusMutation.isPending ? "Updating..." : "Mark Arrived"}
      </Button>
    </div>
  )}
</div>

</div>
</CardContent>
</Card>
))}
</div>
</div>
);
}
}

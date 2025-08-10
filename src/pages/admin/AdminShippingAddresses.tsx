import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin, Save, Flag, Plane, Ship } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";

interface ShippingAddress {
  id: number;
  title: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
}

export default function AdminShippingAddresses() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    state: "",
    zip_code: ""
  });

  // Verify admin authentication
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
  }, [navigate]);

  // Static shipping address titles (matching customer panel header)
  const staticAddresses = [
    { id: 1, title: "Belgium", icon: Flag },
    { id: 2, title: "China Air", icon: Plane },
    { id: 3, title: "China-Sea-KG", icon: Ship },
    { id: 4, title: "Germany", icon: Flag },
    { id: 5, title: "India", icon: Flag },
    { id: 6, title: "Saudi Arabia", icon: Flag },
    { id: 7, title: "SHEIN - United Arab Emirates - Sea", icon: Ship },
    { id: 8, title: "Turkey", icon: Flag },
    { id: 9, title: "United Arab Emirates - Air", icon: Plane },
    { id: 10, title: "United Arab Emirates - Sea", icon: Ship },
    { id: 11, title: "USA", icon: Flag },
    { id: 12, title: "UK London", icon: Flag },
    { id: 13, title: "USA - Sea", icon: Ship },

  ];

  const { data: addressesResponse, isLoading } = useQuery({
    queryKey: ['admin-shipping-addresses'],
    queryFn: () => ApiService.getShippingAddresses(),
  });

  const updateAddressMutation = useMutation({
    mutationFn: (data: { id: number; address: string; city: string; state: string; zip_code: string }) =>
      ApiService.updateShippingAddress(data.id, data),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Shipping address updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-shipping-addresses'] });
      setSelectedAddressId(null);
      setFormData({ address: "", city: "", state: "", zip_code: "" });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update shipping address",
        variant: "destructive",
      });
    },
  });

  const addresses = addressesResponse?.data || [];
  const selectedAddress = selectedAddressId ? addresses.find((addr: ShippingAddress) => addr.id === selectedAddressId) : null;

  const handleAddressSelect = (addressId: string) => {
    const staticId = parseInt(addressId);
    const staticAddress = staticAddresses.find(addr => addr.id === staticId);
    
    if (staticAddress) {
      // Find the real address from API by matching title
      const realAddress = addresses.find((addr: ShippingAddress) => 
        addr.title.toLowerCase() === staticAddress.title.toLowerCase()
      );
      
      if (realAddress) {
        setSelectedAddressId(realAddress.id);
        setFormData({
          address: realAddress.address,
          city: realAddress.city,
          state: realAddress.state,
          zip_code: realAddress.zip_code
        });
      } else {
        // No real address found, clear form
        setSelectedAddressId(null);
        setFormData({ address: "", city: "", state: "", zip_code: "" });
        toast({
          title: "Address not found",
          description: `No address data found for ${staticAddress.title}`,
          variant: "destructive",
        });
      }
    }
  };

  const handleSave = () => {
    if (selectedAddressId && formData.address && formData.city && formData.state && formData.zip_code) {
      updateAddressMutation.mutate({
        id: selectedAddressId,
        ...formData
      });
    }
  };

  const handleCancel = () => {
    setSelectedAddressId(null);
    setFormData({ address: "", city: "", state: "", zip_code: "" });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex items-center space-x-2">
        <MapPin className="h-6 w-6 text-primary" />
        <h1 className="text-2xl md:text-3xl font-bold">Edit Shipping Addresses</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Modify Shipping Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="address-select">Select Address to Edit</Label>
              <Select value={selectedAddressId?.toString() || ""} onValueChange={handleAddressSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a shipping address to edit" />
                </SelectTrigger>
                <SelectContent className="bg-background border shadow-lg z-50">
                  {staticAddresses.map((address) => (
                    <SelectItem key={address.id} value={address.id.toString()} className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <address.icon className="h-4 w-4" />
                        <span>{address.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                placeholder={selectedAddress ? selectedAddress.address : "Select an address first"}
                disabled={!selectedAddressId}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={formData.city}
                onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
                placeholder={selectedAddress ? selectedAddress.city : "Select an address first"}
                disabled={!selectedAddressId}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder={selectedAddress ? selectedAddress.state : "Select an address first"}
                disabled={!selectedAddressId}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input
                id="zip_code"
                value={formData.zip_code}
                onChange={(e) => setFormData(prev => ({ ...prev, zip_code: e.target.value }))}
                placeholder={selectedAddress ? selectedAddress.zip_code : "Select an address first"}
                disabled={!selectedAddressId}
              />
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2">
            <Button 
              onClick={handleSave}
              disabled={!selectedAddressId || !formData.address || !formData.city || !formData.state || !formData.zip_code || updateAddressMutation.isPending}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{updateAddressMutation.isPending ? "Saving..." : "Update Address"}</span>
            </Button>
            
            <Button variant="outline" onClick={handleCancel} disabled={!selectedAddressId}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>

    </div>
  );
}

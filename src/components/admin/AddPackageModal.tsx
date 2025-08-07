import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api";
import { toast } from "@/hooks/use-toast";

interface AddPackageModalProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
}

const shippingOptions = [
  { value: "belgium", label: "Belgium" },
  { value: "china-air", label: "China Air" },
  { value: "china-sea-kg", label: "China-Sea-KG" },
  { value: "germany", label: "Germany" },
  { value: "india", label: "India" },
  { value: "saudi-arabia", label: "Saudi Arabia" },
  { value: "shein-uae-sea", label: "SHEIN - United Arab Emirates - Sea" },
  { value: "turkey", label: "Turkey" },
  { value: "uae-air", label: "United Arab Emirates - Air" },
  { value: "uae-sea", label: "United Arab Emirates - Sea" },
  { value: "uk", label: "United Kingdom" },
  { value: "usa", label: "United States" },
  { value: "usa-sea", label: "USA - Sea" },
];

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "in_transit", label: "In Transit" },
  { value: "arrived", label: "Arrived" },
  { value: "delivered", label: "Delivered" },
];

export function AddPackageModal({ client, isOpen, onClose }: AddPackageModalProps) {
  const [formData, setFormData] = useState({
    description: "",
    weight: "",
    price: "",
    country: "",
    shippingMethod: "",
    status: "pending",
    estimatedArrival: null as Date | null,
    notes: "",
    trackingNumber: "",
  });

  const queryClient = useQueryClient();

  const createPackageMutation = useMutation({
    mutationFn: (data: any) => ApiService.createPackageForClient(client?.id, data),
    onSuccess: () => {
      toast({
        title: "Package created successfully",
        description: `Package has been added for ${client?.name}`,
      });
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      onClose();
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error creating package",
        description: error.message || "Failed to create package",
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      description: "",
      weight: "",
      price: "",
      country: "",
      shippingMethod: "",
      status: "pending",
      estimatedArrival: null,
      notes: "",
      trackingNumber: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.description || !formData.weight || !formData.price || !formData.country || !formData.shippingMethod) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createPackageMutation.mutate({
      description: formData.description,
      weight: parseFloat(formData.weight),
      price: parseFloat(formData.price),
      country: formData.country,
      shipping_method: formData.shippingMethod,
      status: formData.status,
      estimated_arrival: formData.estimatedArrival?.toISOString(),
      notes: formData.notes,
      tracking_number: formData.trackingNumber,
    });
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add Package for {client?.name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="description">Package Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the package contents..."
                className="min-h-[80px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="Enter country name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shipping-method">Shipping Method</Label>
              <Select
                value={formData.shippingMethod}
                onValueChange={(value) => setFormData({ ...formData, shippingMethod: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select shipping method" />
                </SelectTrigger>
                <SelectContent>
                  {shippingOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="weight">Weight (kg)</Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                placeholder="0.0"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price ($)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="tracking-number">Tracking Number</Label>
              <Input
                id="tracking-number"
                value={formData.trackingNumber}
                onChange={(e) => setFormData({ ...formData, trackingNumber: e.target.value })}
                placeholder="Enter tracking number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Estimated Arrival To Irak</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.estimatedArrival && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.estimatedArrival ? (
                      format(formData.estimatedArrival, "PPP")
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.estimatedArrival}
                    onSelect={(date) => setFormData({ ...formData, estimatedArrival: date })}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Any additional information..."
              className="min-h-[60px]"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createPackageMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createPackageMutation.isPending}
            >
              {createPackageMutation.isPending ? "Creating..." : "Create Package"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

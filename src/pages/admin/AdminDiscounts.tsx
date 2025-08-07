import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api";

interface DiscountCode {
  id: string;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  expiresAt: string;
  createdAt: string;
}

export default function AdminDiscounts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

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

  // Fetch all discounts
  const { data: discounts = [], isLoading } = useQuery({
    queryKey: ['admin-discounts'],
    queryFn: () => ApiService.getAllDiscounts().then(res => res.data)
  });

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<any | null>(null);
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discount_type: "percentage" as "percentage" | "fixed",
    discount_value: 0,
    min_order_amount: 0,
    usage_limit: 0,
    expires_at: ""
  });

  // Create discount mutation
  const createDiscountMutation = useMutation({
    mutationFn: (data: any) => ApiService.createDiscount(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      toast({
        title: "Success",
        description: "Discount code created successfully"
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create discount code",
        variant: "destructive"
      });
    }
  });

  // Update discount mutation
  const updateDiscountMutation = useMutation({
    mutationFn: ({ id, data }: { id: number, data: any }) => ApiService.updateDiscount(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      toast({
        title: "Success",
        description: "Discount code updated successfully"
      });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update discount code",
        variant: "destructive"
      });
    }
  });

  // Delete discount mutation
  const deleteDiscountMutation = useMutation({
    mutationFn: (id: number) => ApiService.deleteDiscount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-discounts'] });
      toast({
        title: "Success",
        description: "Discount code deleted successfully"
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete discount code",
        variant: "destructive"
      });
    }
  });

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "percentage",
      discount_value: 0,
      min_order_amount: 0,
      usage_limit: 0,
      expires_at: ""
    });
    setEditingDiscount(null);
  };

  const handleAddNew = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const handleEdit = (discount: any) => {
    setFormData({
      code: discount.code,
      description: discount.description,
      discount_type: discount.discount_type,
      discount_value: discount.discount_value,
      min_order_amount: discount.min_order_amount,
      usage_limit: discount.usage_limit,
      expires_at: discount.expires_at
    });
    setEditingDiscount(discount);
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingDiscount) {
      updateDiscountMutation.mutate({ id: editingDiscount.id, data: formData });
    } else {
      createDiscountMutation.mutate(formData);
    }
  };

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingDiscountId, setDeletingDiscountId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setDeletingDiscountId(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (deletingDiscountId) {
      deleteDiscountMutation.mutate(deletingDiscountId);
      setDeleteDialogOpen(false);
      setDeletingDiscountId(null);
    }
  };

  const toggleStatus = (id: number) => {
    const discount = discounts.find((d: any) => d.id === id);
    if (discount) {
      updateDiscountMutation.mutate({ 
        id, 
        data: { ...discount, is_active: !discount.is_active } 
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Discount Codes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Discount Code
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingDiscount ? "Edit Discount Code" : "Add New Discount Code"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Enter discount code"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountType">Discount Type</Label>
                <select
                  id="discountType"
                  value={formData.discount_type}
                  onChange={(e) => setFormData({ ...formData, discount_type: e.target.value as "percentage" | "fixed" })}
                  className="w-full h-10 px-3 py-2 text-sm bg-background border border-input rounded-md"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="discountValue">
                  Discount Value {formData.discount_type === "percentage" ? "(%)" : "($)"}
                </Label>
                <Input
                  id="discountValue"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minOrderAmount">Minimum Order Amount ($)</Label>
                <Input
                  id="minOrderAmount"
                  type="number"
                  value={formData.min_order_amount}
                  onChange={(e) => setFormData({ ...formData, min_order_amount: Number(e.target.value) })}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="usageLimit">Usage Limit</Label>
                <Input
                  id="usageLimit"
                  type="number"
                  value={formData.usage_limit}
                  onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                  min="1"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiresAt">Expiry Date</Label>
                <Input
                  id="expiresAt"
                  type="date"
                  value={formData.expires_at}
                  onChange={(e) => setFormData({ ...formData, expires_at: e.target.value })}
                  required
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={createDiscountMutation.isPending || updateDiscountMutation.isPending}
                >
                  {createDiscountMutation.isPending || updateDiscountMutation.isPending
                    ? "Saving..." 
                    : (editingDiscount ? "Update" : "Create") + " Discount Code"
                  }
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Discounts Table - Desktop */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle>Discount Codes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>Usage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Expires</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
               <TableBody>
                 {discounts.map((discount: any) => (
                   <TableRow key={discount.id}>
                     <TableCell className="font-medium">{discount.code}</TableCell>
                     <TableCell>{discount.description}</TableCell>
                     <TableCell>
                       <Badge variant="outline">
                         {discount.discount_type === "percentage" ? "%" : "$"}
                       </Badge>
                     </TableCell>
                     <TableCell>
                       {discount.discount_value}
                       {discount.discount_type === "percentage" ? "%" : "$"}
                     </TableCell>
                     <TableCell>
                       {discount.used_count || 0}/{discount.usage_limit}
                     </TableCell>
                     <TableCell>
                       <Badge 
                         variant={discount.is_active ? "default" : "secondary"}
                         className="cursor-pointer"
                         onClick={() => toggleStatus(discount.id)}
                       >
                         {discount.is_active ? "Active" : "Inactive"}
                       </Badge>
                     </TableCell>
                     <TableCell>{discount.expires_at}</TableCell>
                     <TableCell>
                       <div className="flex gap-2">
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleEdit(discount)}
                         >
                           <Pencil className="h-4 w-4" />
                         </Button>
                         <Button
                           variant="ghost"
                           size="sm"
                           onClick={() => handleDelete(discount.id)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                     </TableCell>
                   </TableRow>
                 ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Discounts Cards - Mobile */}
      <div className="md:hidden space-y-4">
        {discounts.map((discount: any) => (
          <Card key={discount.id}>
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-mono font-bold text-lg">{discount.code}</p>
                    <p className="text-sm text-muted-foreground">{discount.description}</p>
                  </div>
                  <Badge 
                    variant={discount.is_active ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => toggleStatus(discount.id)}
                  >
                    {discount.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Type</p>
                    <Badge variant="outline">
                      {discount.discount_type === "percentage" ? "%" : "$"}
                    </Badge>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Value</p>
                    <p>{discount.discount_value}{discount.discount_type === "percentage" ? "%" : "$"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Usage</p>
                    <p>{discount.used_count || 0}/{discount.usage_limit}</p>
                  </div>
                  <div>
                    <p className="font-medium text-sm text-muted-foreground">Expires</p>
                    <p>{discount.expires_at}</p>
                  </div>
                </div>

                <div className="flex justify-end space-x-2 pt-2 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(discount)}
                  >
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(discount.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the discount code.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiService } from "@/services/api";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Package, ExternalLink, Check, X, Clock, Truck, CheckCircle, AlertCircle } from "lucide-react";

const AdminCustomsRequests = () => {
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [isUpdateDialogOpen, setIsUpdateDialogOpen] = useState(false);
  const [updateData, setUpdateData] = useState({
    status: '',
    actual_price: '',
    tracking_number: '',
    admin_notes: ''
  });

  const queryClient = useQueryClient();

  const { data: requestsData, isLoading, error } = useQuery({
    queryKey: ['admin-buy-for-me-requests'],
    queryFn: () => ApiService.getAdminBuyForMeRequests()
  });

  const updateRequestMutation = useMutation({
    mutationFn: (data: { id: number; updateData: any }) => 
      ApiService.updateBuyForMeRequestStatus(data.id, data.updateData),
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      queryClient.invalidateQueries({ queryKey: ['admin-buy-for-me-requests'] });
      setIsUpdateDialogOpen(false);
      setSelectedRequest(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update request",
        variant: "destructive",
      });
    },
  });

  const requests = requestsData?.data || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
      case 'purchased': return 'bg-green-500/20 text-green-600 border-green-500/30'
      case 'shipped': return 'bg-purple-500/20 text-purple-600 border-purple-500/30'
      case 'in transit': return 'bg-blue-500/20 text-blue-600 border-blue-500/30'
      case 'delivered': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
      case 'not found': return 'bg-orange-500/20 text-orange-600 border-orange-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-600 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30'
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'purchased': return <Check className="w-4 h-4" />
      case 'shipped': return <Truck className="w-4 h-4" />
      case 'in transit': return <Truck className="w-4 h-4" />
      case 'delivered': return <CheckCircle className="w-4 h-4" />
      case 'not found': return <AlertCircle className="w-4 h-4" />
      case 'cancelled': return <X className="w-4 h-4" />
      default: return <Package className="w-4 h-4" />
    }
  };

  const handleUpdateRequest = (request: any) => {
    setSelectedRequest(request);
    setUpdateData({
      status: request.status,
      actual_price: request.actual_price || '',
      tracking_number: request.tracking_number || '',
      admin_notes: request.admin_notes || ''
    });
    setIsUpdateDialogOpen(true);
  };

  const handleSubmitUpdate = () => {
    if (!selectedRequest) return;

    const submitData: any = {
      status: updateData.status,
      admin_notes: updateData.admin_notes
    };

    if (updateData.actual_price) {
      submitData.actual_price = parseFloat(updateData.actual_price);
    }

    if (updateData.tracking_number) {
      submitData.tracking_number = updateData.tracking_number;
    }

    updateRequestMutation.mutate({
      id: selectedRequest.id,
      updateData: submitData
    });
  };


  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading customs requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Requests</h3>
          <p className="text-muted-foreground mb-6">Failed to load customs requests</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Customs Requests</h1>
          <p className="text-muted-foreground">Manage and approve customer buy-for-me requests</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant="secondary">{requests.length} Total Requests</Badge>
        </div>
      </div>

      {/* Requests List */}
      <Card>
        <CardHeader>
          <CardTitle>Buy For Me Requests</CardTitle>
          <CardDescription>Review and manage customer purchase requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Requests</h3>
              <p className="text-muted-foreground">No buy for me requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request: any) => (
                <div key={request.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    {/* Request Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start space-x-3">
                        {request.product_image_path && (
                          <img 
                            src={`https://api.obourexpress.com/storage/${request.product_image_path}`} 
                            alt={request.product_name}
                            className="w-16 h-16 rounded-lg object-cover bg-muted flex-shrink-0"
                          />
                        )}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-foreground">{request.product_name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                          <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
                            <span>Customer: {request.user?.name || 'Unknown'}</span>
                            <span>•</span>
                            <span>Qty: {request.quantity}</span>
                            <span>•</span>
                            <span>Est: {request.estimated_price} {request.currency}</span>
                          </div>
                          {request.admin_notes && (
                            <div className="mt-2 p-2 bg-muted rounded text-sm">
                              <strong>Admin Notes:</strong> {request.admin_notes}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(request.status)}
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                      </div>

                      <div className="flex space-x-2">
                        {request.product_url && (
                          <Button size="sm" variant="outline" asChild>
                            <a href={request.product_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          </Button>
                        )}
                        

                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleUpdateRequest(request)}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Additional Info */}
                  <div className="mt-3 pt-3 border-t border-border">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Created:</span>
                        <div className="font-medium">{new Date(request.created_at).toLocaleDateString()}</div>
                      </div>
                      {request.actual_price && (
                        <div>
                          <span className="text-muted-foreground">Actual Price:</span>
                          <div className="font-medium text-green-600">{request.actual_price} {request.currency}</div>
                        </div>
                      )}
                      {request.tracking_number && (
                        <div>
                          <span className="text-muted-foreground">Tracking:</span>
                          <div className="font-mono text-xs bg-muted px-2 py-1 rounded">{request.tracking_number}</div>
                        </div>
                      )}
                      <div>
                        <span className="text-muted-foreground">Updated:</span>
                        <div className="font-medium">{new Date(request.updated_at).toLocaleDateString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update Request Dialog */}
      <Dialog open={isUpdateDialogOpen} onOpenChange={setIsUpdateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Request</DialogTitle>
            <DialogDescription>
              Update the status and details for this buy-for-me request
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={updateData.status} onValueChange={(value) => setUpdateData({...updateData, status: value})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="purchased">Purchased</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="actual_price">Actual Price</Label>
              <Input
                id="actual_price"
                type="number"
                step="0.01"
                value={updateData.actual_price}
                onChange={(e) => setUpdateData({...updateData, actual_price: e.target.value})}
                placeholder="Enter actual price"
              />
            </div>

            <div>
              <Label htmlFor="tracking_number">Tracking Number</Label>
              <Input
                id="tracking_number"
                value={updateData.tracking_number}
                onChange={(e) => setUpdateData({...updateData, tracking_number: e.target.value})}
                placeholder="Enter tracking number"
              />
            </div>

            <div>
              <Label htmlFor="admin_notes">Admin Notes</Label>
              <Textarea
                id="admin_notes"
                value={updateData.admin_notes}
                onChange={(e) => setUpdateData({...updateData, admin_notes: e.target.value})}
                placeholder="Add notes for the customer..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsUpdateDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitUpdate}
              disabled={updateRequestMutation.isPending}
            >
              {updateRequestMutation.isPending ? "Updating..." : "Update Request"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminCustomsRequests;

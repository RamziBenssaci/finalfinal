import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ShoppingCart, Plus, Search, Package, DollarSign, Eye, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { BuyForMeModal } from "@/components/modals/BuyForMeModal"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "@tanstack/react-query"
import { ApiService } from "@/services/api"

const BuyForMe = () => {
  const { data: requestsData, isLoading, error } = useQuery({
    queryKey: ['buy-for-me-requests'],
    queryFn: () => ApiService.getBuyForMeRequests()
  })

  const requests = requestsData?.data?.requests || []

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30'
      case 'processing': return 'bg-blue-500/20 text-blue-600 border-blue-500/30'
      case 'purchased': return 'bg-green-500/20 text-green-600 border-green-500/30'
      case 'shipped': return 'bg-purple-500/20 text-purple-600 border-purple-500/30'
      case 'delivered': return 'bg-emerald-500/20 text-emerald-600 border-emerald-500/30'
      case 'cancelled': return 'bg-red-500/20 text-red-600 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30'
    }
  }
  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">BUY FOR ME Service</h1>
            <p className="text-muted-foreground">Let us purchase and ship products for you from any store worldwide</p>
          </div>
          <div className="flex-shrink-0">
            <BuyForMeModal>
              <Button className="bg-gradient-primary text-white hover:shadow-glow w-full sm:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                <span className="hidden sm:inline">Create Buy For Me Request</span>
                <span className="sm:hidden">New Request</span>
              </Button>
            </BuyForMeModal>
          </div>
        </div>

        {/* Buy For Me Requests Section */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5" />
              <span>Your Buy For Me Requests</span>
            </CardTitle>
            <CardDescription>Track and manage your purchase requests</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-12">
                <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading your requests...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <Package className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-2">Error Loading Requests</h3>
                <p className="text-muted-foreground mb-6">Failed to load your buy for me requests</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try Again
                </Button>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="w-20 h-20 text-muted-foreground mx-auto mb-6" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Purchase Requests</h3>
                <p className="text-muted-foreground mb-6">You haven't created any buy for me requests yet</p>
                <BuyForMeModal>
                  <Button className="bg-gradient-primary text-white hover:shadow-glow">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Request
                  </Button>
                </BuyForMeModal>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request: any) => (
                  <div key={request.id} className="border border-border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                    {/* Mobile Card Layout */}
                    <div className="block sm:hidden space-y-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-foreground truncate">{request.product_name}</h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{request.description}</p>
                        </div>
                        <Badge className={`ml-2 ${getStatusColor(request.status)}`}>
                          {request.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Estimated:</span>
                        <span className="font-medium">{request.estimated_price} {request.currency}</span>
                      </div>
                      
                      {request.actual_price && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Actual:</span>
                          <span className="font-medium text-green-600">{request.actual_price} {request.currency}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Quantity:</span>
                        <span className="font-medium">{request.quantity}</span>
                      </div>
                      
                      {request.tracking_number && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tracking:</span>
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">{request.tracking_number}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex gap-2 pt-2">
                        {request.product_url && (
                          <Button size="sm" variant="outline" className="flex-1" asChild>
                            <a href={request.product_url} target="_blank" rel="noopener noreferrer">
                              <ExternalLink className="w-3 h-3 mr-1" />
                              View Product
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* Desktop Table Layout */}
                    <div className="hidden sm:flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3">
                          {request.product_image_path && (
                            <img 
                              src={`https://api.obourexpress.com/storage/${request.product_image_path}`} 
                              alt={request.product_name}
                              className="w-12 h-12 rounded-lg object-cover bg-muted"
                            />
                          )}
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-foreground truncate">{request.product_name}</h3>
                            <p className="text-sm text-muted-foreground truncate">{request.description}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6 text-sm">
                        <div className="text-center">
                          <div className="text-muted-foreground">Estimated</div>
                          <div className="font-medium">{request.estimated_price} {request.currency}</div>
                        </div>
                        
                        {request.actual_price && (
                          <div className="text-center">
                            <div className="text-muted-foreground">Actual</div>
                            <div className="font-medium text-green-600">{request.actual_price} {request.currency}</div>
                          </div>
                        )}
                        
                        <div className="text-center">
                          <div className="text-muted-foreground">Qty</div>
                          <div className="font-medium">{request.quantity}</div>
                        </div>
                        
                        <div className="text-center">
                          <div className="text-muted-foreground">Status</div>
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
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* How It Works */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Request</h3>
              <p className="text-sm text-muted-foreground">Tell us what you want to buy with product details and images</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-warning rounded-lg flex items-center justify-center mx-auto mb-4">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. Purchase</h3>
              <p className="text-sm text-muted-foreground">We find and purchase the item for you at the best price</p>
            </CardContent>
          </Card>
          
          <Card className="bg-card border-border">
            <CardContent className="p-6 text-center">
              <div className="w-12 h-12 bg-gradient-success rounded-lg flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Ship</h3>
              <p className="text-sm text-muted-foreground">Your purchased item is shipped to your address safely</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default BuyForMe;

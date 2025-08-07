import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, Search, Filter, Eye, Truck, CheckCircle, Clock, AlertCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShippingStatusBanner } from "@/components/ui/shipping-status-banner"
import { useState, useEffect } from "react"
import { ApiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useCountry } from "@/contexts/CountryContext"

const Shipments = () => {
  const { selectedCountry } = useCountry()
  const [shipments, setShipments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  // Filter shipments based on search term
  const filteredShipments = shipments.filter(shipment =>
    shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fetch shipments when country changes
  useEffect(() => {
    const fetchShipments = async () => {
      setIsLoading(true)
      try {
        const response = await ApiService.getShipments(selectedCountry)
        setShipments(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch shipments for the selected country.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchShipments()
  }, [selectedCountry, toast])

  return (
    <Layout>
      <div className="space-y-6">
        {/* Shipping Status Banner */}
        <ShippingStatusBanner selectedCountry={selectedCountry} />
        
        {/* Header with Search */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Shipments</h1>
            <p className="text-muted-foreground">Track and manage your shipments for {selectedCountry}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input 
                placeholder="Search by tracking number..." 
                className="w-full pl-10 bg-background border-border"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Shipments Content */}
        {isLoading ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading shipments for {selectedCountry}...</p>
            </CardContent>
          </Card>
        ) : filteredShipments.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">📦</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">0 Shipments</h2>
              <p className="text-muted-foreground">
                {searchTerm ? `No shipments found matching "${searchTerm}"` : `No shipments found for ${selectedCountry}. Create your first shipment to get started.`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3 md:space-y-4">
            {filteredShipments.map((shipment) => (
              <Card key={shipment.id} className="bg-card border-border">
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between space-y-3 md:space-y-0">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                        <Package className="w-5 h-5 md:w-6 md:h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-foreground text-sm md:text-base">{shipment.tracking_number}</h3>
                        <p className="text-xs md:text-sm text-muted-foreground">
                          {shipment.origin} → {shipment.destination}
                        </p>
                        <p className="text-xs text-muted-foreground">Country: {shipment.country}</p>
                      </div>
                    </div>
                    <div className="text-left md:text-right">
                      <span className={`inline-flex items-center px-2 md:px-3 py-1 rounded-full text-xs font-medium ${
                        shipment.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        shipment.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        shipment.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {shipment.status === 'delivered' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {shipment.status === 'in_transit' && <Truck className="w-3 h-3 mr-1" />}
                        {shipment.status === 'processing' && <Clock className="w-3 h-3 mr-1" />}
                        {shipment.status.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Shipments;
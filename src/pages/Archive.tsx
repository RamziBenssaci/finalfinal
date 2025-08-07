import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Archive as ArchiveIcon, Package, Calendar, Search, CheckCircle } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ShippingStatusBanner } from "@/components/ui/shipping-status-banner"
import { useState, useEffect } from "react"
import { ApiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useCountry } from "@/contexts/CountryContext"

const Archive = () => {
  const { selectedCountry } = useCountry()
  const [archivedShipments, setArchivedShipments] = useState<any[]>([])
  const [returnedPackages, setReturnedPackages] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingReturned, setIsLoadingReturned] = useState(false)
  const { toast } = useToast()

  // Filter archived shipments based on search term
  const filteredArchivedShipments = archivedShipments.filter(shipment =>
    shipment.tracking_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredReturnedPackages = returnedPackages.filter(pkg =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Fetch archived shipments when country changes
  useEffect(() => {
    const fetchArchivedShipments = async () => {
      setIsLoading(true)
      try {
        const response = await ApiService.getArchivedShipments(selectedCountry)
        setArchivedShipments(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch archived shipments for the selected country.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    const fetchReturnedPackages = async () => {
      setIsLoadingReturned(true)
      try {
        const response = await ApiService.getReturnedPackages(selectedCountry)
        setReturnedPackages(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch returned packages for the selected country.",
          variant: "destructive"
        })
      } finally {
        setIsLoadingReturned(false)
      }
    }

    fetchArchivedShipments()
    fetchReturnedPackages()
  }, [selectedCountry, toast])
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Shipping Status Banner */}
        <ShippingStatusBanner selectedCountry={selectedCountry} />
        
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">Archive</h1>
            <p className="text-muted-foreground">View completed shipments for {selectedCountry}</p>
          </div>
          
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

        {/* Archive Tabs */}
        <Tabs defaultValue="delivered" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="delivered">Delivered Shipments</TabsTrigger>
            <TabsTrigger value="returned">Returned Packages</TabsTrigger>
          </TabsList>
          
          <TabsContent value="delivered" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <Package className="w-5 h-5" />
                  <span>Delivered Shipments for {selectedCountry}</span>
                </CardTitle>
                <CardDescription>Successfully delivered packages</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading archived shipments for {selectedCountry}...</p>
                  </div>
                ) : filteredArchivedShipments.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Archived Shipments</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? `No archived shipments found matching "${searchTerm}"` : `No completed shipments found for ${selectedCountry}.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {filteredArchivedShipments.map((shipment) => (
                      <div key={shipment.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-muted rounded-lg space-y-2 md:space-y-0">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <CheckCircle className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm md:text-base">{shipment.tracking_number}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">Country: {shipment.country}</p>
                            <p className="text-xs text-muted-foreground flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Delivered on {new Date(shipment.completed_at).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full self-start md:self-center">Delivered</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="returned" className="space-y-4">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground flex items-center space-x-2">
                  <ArchiveIcon className="w-5 h-5" />
                  <span>Returned Packages</span>
                </CardTitle>
                <CardDescription>Packages that were returned to sender</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingReturned ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-muted-foreground">Loading returned packages for {selectedCountry}...</p>
                  </div>
                ) : filteredReturnedPackages.length === 0 ? (
                  <div className="text-center py-8">
                    <ArchiveIcon className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Returned Packages</h3>
                    <p className="text-muted-foreground">
                      {searchTerm ? `No returned packages found matching "${searchTerm}"` : `No returned packages found for ${selectedCountry}.`}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 md:space-y-4">
                    {filteredReturnedPackages.map((pkg) => (
                      <div key={pkg.id} className="flex flex-col md:flex-row md:items-center justify-between p-3 md:p-4 bg-muted rounded-lg space-y-2 md:space-y-0">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="w-10 h-10 md:w-12 md:h-12 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <ArchiveIcon className="w-5 h-5 md:w-6 md:h-6 text-red-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-foreground text-sm md:text-base">{pkg.tracking_number}</h3>
                            <p className="text-xs md:text-sm text-muted-foreground">Country: {pkg.country || selectedCountry}</p>
                            <p className="text-xs text-muted-foreground flex items-center space-x-1">
                              <Calendar className="w-3 h-3" />
                              <span>Returned on {new Date(pkg.return_date || pkg.updated_at).toLocaleDateString()}</span>
                            </p>
                            {pkg.return_reason && (
                              <p className="text-xs text-muted-foreground">Reason: {pkg.return_reason}</p>
                            )}
                          </div>
                        </div>
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full self-start md:self-center">Returned</span>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default Archive;
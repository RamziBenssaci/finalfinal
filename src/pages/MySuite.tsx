import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { User, MapPin, Phone, Mail, Search, RotateCcw, Truck, AlertCircle } from "lucide-react"
import { ShippingStatusBanner } from "@/components/ui/shipping-status-banner"
import { useState, useEffect } from "react"
import { ApiService } from "@/services/api"
import { useToast } from "@/hooks/use-toast"
import { useCountry } from "@/contexts/CountryContext"

const MySuite = () => {
  const { selectedCountry } = useCountry()
  const [searchTerm, setSearchTerm] = useState("")
  const [packages, setPackages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessages, setErrorMessages] = useState<Record<string, string>>({})
  const { toast } = useToast()

  // Fetch packages when country changes
  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true)
      try {
        const response = await ApiService.getPackages(selectedCountry)
        setPackages(response.data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to fetch packages for the selected country.",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [selectedCountry, toast])

  const handleReturnRequest = async (packageId: number) => {
    try {
      await ApiService.requestPackageReturn(packageId)
      toast({
        title: "Return Request Submitted",
        description: "Your return request has been submitted successfully.",
        variant: "default"
      })
      // Refresh packages to show updated status
      const response = await ApiService.getPackages(selectedCountry)
      setPackages(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit return request.",
        variant: "destructive"
      })
    }
  }

  const handleShippingRequest = async (packageId: number) => {
    try {
      await ApiService.requestPackageShipping(packageId)
      toast({
        title: "Shipping Request Submitted",
        description: "Your shipping request has been submitted successfully.",
        variant: "default"
      })
      // Refresh packages to show updated status
      const response = await ApiService.getPackages(selectedCountry)
      setPackages(response.data)
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to submit shipping request.",
        variant: "destructive"
      })
    }
  }

  const handleDisabledAction = (packageId: number, action: string, status: string) => {
    const errorKey = `${packageId}-${action}`
    let message = ""
    
    if (action === "return") {
      message = status === "delivered" ? "Returns only available for in-transit packages" : 
                status === "pending" ? "Package must be shipped first" : 
                "Returns not available for this status"
    } else if (action === "shipping") {
      message = status === "delivered" ? "Package already delivered" : 
                status === "pending" ? "Package not ready for shipping" : 
                "Shipping request not available for this status"
    }
    
    setErrorMessages(prev => ({ ...prev, [errorKey]: message }))
    setTimeout(() => {
      setErrorMessages(prev => {
        const newErrors = { ...prev }
        delete newErrors[errorKey]
        return newErrors
      })
    }, 3000)
  }

  // Filter packages based on search term
  const filteredPackages = packages.filter(pkg =>
    pkg.tracking_number.toLowerCase().includes(searchTerm.toLowerCase())
  )
  
  return (
    <Layout>
      <div className="space-y-6">
        {/* Shipping Status Banner */}
        <ShippingStatusBanner selectedCountry={selectedCountry} />
        {/* Header */}
        <div className="flex flex-col space-y-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Suite</h1>
            <p className="text-muted-foreground">Manage your account and personal information</p>
          </div>
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search by tracking number..."
              className="pl-10 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && filteredPackages.length > 0 && filteredPackages.length !== packages.length && (
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Search Results</CardTitle>
              <CardDescription>Found {filteredPackages.length} packages matching "{searchTerm}"</CardDescription>
            </CardHeader>
          </Card>
        )}

        {/* Package Status */}
        {isLoading ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading packages for {selectedCountry}...</p>
            </CardContent>
          </Card>
        ) : filteredPackages.length === 0 ? (
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-orange-500 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">📦</span>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-2">0 Packages</h2>
              <p className="text-muted-foreground">
                {searchTerm ? `No packages found matching "${searchTerm}"` : `No packages found for ${selectedCountry}`}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-foreground">
                {searchTerm ? `${filteredPackages.length} Package${filteredPackages.length !== 1 ? 's' : ''} found` : `${packages.length} Package${packages.length !== 1 ? 's' : ''}`}
              </h2>
            </div>
            <div className="grid gap-4">
              {filteredPackages.map((pkg) => (
                <Card key={pkg.id} className="bg-card border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-white text-sm font-bold">📦</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-foreground">{pkg.tracking_number}</h3>
                          <p className="text-sm text-muted-foreground">{pkg.description}</p>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        pkg.status === 'delivered' ? 'bg-green-100 text-green-800' :
                        pkg.status === 'in_transit' ? 'bg-blue-100 text-blue-800' :
                        pkg.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {pkg.status.replace('_', ' ')}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-muted-foreground">Price</p>
                        <p className="font-medium text-foreground">${pkg.price}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Weight</p>
                        <p className="font-medium text-foreground">{pkg.weight} kg</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Route</p>
                        <p className="font-medium text-foreground">{pkg.origin_country} → {pkg.destination_country}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Est. Delivery</p>
                        <p className="font-medium text-foreground">
                          {pkg.estimated_delivery ? new Date(pkg.estimated_delivery).toLocaleDateString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    
                    {pkg.insurance > 0 && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground">Insurance</span>
                          <span className="font-medium text-foreground">${pkg.insurance}</span>
                        </div>
                      </div>
                    )}
                    
                    {/* Action Buttons */}
                    <div className="mt-3 pt-3 border-t border-border">
                      <div className="flex gap-2">
                        <Button
                          onClick={() => pkg.status === 'in_transit' ? handleReturnRequest(pkg.id) : handleDisabledAction(pkg.id, 'return', pkg.status)}
                          variant="outline"
                          size="sm"
                          className={`flex-1 text-xs h-8 ${pkg.status !== 'in_transit' ? 'opacity-60 blur-[0.5px] hover:opacity-75' : ''}`}
                        >
                          <RotateCcw className="w-3 h-3 mr-1" />
                          Return
                        </Button>
                        <Button
                          onClick={() => pkg.status === 'in_transit' ? handleShippingRequest(pkg.id) : handleDisabledAction(pkg.id, 'shipping', pkg.status)}
                          variant="outline"
                          size="sm"
                          className={`flex-1 text-xs h-8 ${pkg.status !== 'in_transit' ? 'opacity-60 blur-[0.5px] hover:opacity-75' : ''}`}
                        >
                          <Truck className="w-3 h-3 mr-1" />
                          Ship Now
                        </Button>
                      </div>
                      
                      {/* Error Messages */}
                      {errorMessages[`${pkg.id}-return`] && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                          <span className="text-xs text-red-600">{errorMessages[`${pkg.id}-return`]}</span>
                        </div>
                      )}
                      {errorMessages[`${pkg.id}-shipping`] && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center gap-2">
                          <AlertCircle className="w-3 h-3 text-red-500 flex-shrink-0" />
                          <span className="text-xs text-red-600">{errorMessages[`${pkg.id}-shipping`]}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MySuite;
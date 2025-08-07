import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Shield, Search, Package, DollarSign, Calendar, User, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ApiService } from "@/services/api"
import { toast } from "sonner"

export default function AdminInsuredPackages() {
  const [searchTerm, setSearchTerm] = useState("")

  const { data: packages, isLoading, error } = useQuery({
    queryKey: ['insured-packages'],
    queryFn: async () => {
      const response = await ApiService.getInsuredPackages()
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch insured packages')
    }
  })

  const { data: statistics, isLoading: statsLoading } = useQuery({
    queryKey: ['insurance-statistics'],
    queryFn: async () => {
      const response = await ApiService.getInsuranceStatistics()
      if (response.success) {
        return response.data
      }
      throw new Error(response.message || 'Failed to fetch insurance statistics')
    }
  })

  // Filter packages based on search only
  const filteredPackages = packages ? packages.filter(pkg => {
    const searchLower = searchTerm.toLowerCase()
    return (pkg.tracking_number?.toLowerCase() || '').includes(searchLower) ||
           (pkg.client_name?.toLowerCase() || '').includes(searchLower) ||
           (pkg.description?.toLowerCase() || '').includes(searchLower) ||
           (pkg.country?.toLowerCase() || '').includes(searchLower) ||
           (pkg.origin_country?.toLowerCase() || '').includes(searchLower) ||
           (pkg.destination_country?.toLowerCase() || '').includes(searchLower)
  }) : []

  // Get statistics from API
  const totalPackages = statistics?.total_insured_packages || 0
  const totalInsuredValue = statistics?.total_insurance_value || 0

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'in_transit': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'delivered': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'returned': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (error) {
    toast.error('Failed to load insured packages')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 md:w-8 h-8 text-primary" />
          Insured Packages
        </h1>
        <p className="text-muted-foreground mt-1">
          Manage and monitor all packages with insurance coverage
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Packages</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPackages}</div>
            <p className="text-xs text-muted-foreground">total packages</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalInsuredValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">total package value</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search by tracking number, client name, description, or country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Packages List */}
      <div className="space-y-4">
        {isLoading || statsLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredPackages.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <Package className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium text-foreground">No packages found</h3>
                <p className="mt-2 text-muted-foreground">
                  {searchTerm 
                    ? "No packages match your search criteria." 
                    : "No packages available."}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredPackages.map((pkg) => (
            <Card key={pkg.user_id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <span className="font-mono font-medium text-primary">
                        {pkg.tracking_number}
                      </span>
                      <Badge className={getStatusColor(pkg.status)}>
                        {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1).replace('_', ' ')}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{pkg.client_name || 'N/A'}</div>
                          <div className="text-muted-foreground">User ID: {pkg.user_id}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{pkg.description}</div>
                          <div className="text-muted-foreground">{pkg.weight}kg - {pkg.shipping_method}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">{pkg.origin_country} → {pkg.destination_country}</div>
                          <div className="text-muted-foreground">{pkg.country}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">${pkg.price?.toLocaleString() || 'N/A'}</div>
                          <div className="text-muted-foreground">
                            {pkg.estimated_delivery ? `Est: ${formatDate(pkg.estimated_delivery)}` : 'No estimate'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
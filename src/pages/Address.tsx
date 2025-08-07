import { useState, useEffect } from "react"
import { Layout } from "@/components/layout/layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Building, Phone, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCountry } from "@/contexts/CountryContext"
import { CountrySelector } from "@/components/ui/navigation-selector"
import { ApiService } from "@/services/api"
import { User as UserType } from "@/types/api"
import { useQuery } from "@tanstack/react-query"

const Address = () => {
  const { selectedCountry } = useCountry();

  // Fetch user data using React Query
  const { data: userResponse } = useQuery({
    queryKey: ['user'],
    queryFn: () => ApiService.getUser(),
  });

  // Fetch shipping locations using React Query
  const { data: locationsResponse, isLoading } = useQuery({
    queryKey: ['shipping-locations'],
    queryFn: () => ApiService.getShippingLocations(),
  });

  const user = userResponse?.data;
  const locations = locationsResponse?.data || [];

  // Normalize country name to handle variations
  const normalizeCountry = (countryName: string) => {
    if (countryName.includes("China")) return "China Air";
    if (countryName.includes("United Arab Emirates")) return "UAE Dubai";
    if (countryName.includes("United States") || countryName.includes("USA")) return "USA";
    if (countryName.includes("Saudi Arabia")) return "Saudi Arabia";
    if (countryName.includes("United Kingdom")) return "UK London";
    return countryName;
  };

  // Find the matching shipping location
  const getCurrentAddress = () => {
    const normalizedCountry = normalizeCountry(selectedCountry);
    const location = locations.find(loc => 
      loc.title.toLowerCase().includes(normalizedCountry.toLowerCase()) ||
      normalizedCountry.toLowerCase().includes(loc.title.toLowerCase())
    );

    if (location) {
      return {
        title: `${location.title} ADDRESS`,
        companyName: `Obour Express ${location.title} ADDRESS`,
        suite: user?.suite_number || `${location.title.slice(0, 2).toUpperCase()}1ZZ649`,
        address: `${location.address}${user?.suite_number ? ` - ${user.suite_number}` : ''}`,
        city: location.city,
        state: location.state,
        zipCode: location.zip_code,
        notice: `Make sure to use the exact same information available above as your shipping address when shopping from any website in ${location.title}`
      };
    }

    // Return null if no location found
    return null;
  };

  const currentAddress = getCurrentAddress();

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!currentAddress) {
    return (
      <Layout>
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">No Address Available</h1>
            <p className="text-muted-foreground">No shipping address found for {selectedCountry}</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{currentAddress.title}</h1>
            <p className="text-muted-foreground">Manage your shipping addresses</p>
          </div>
          <div className="flex-shrink-0">
            <CountrySelector />
          </div>
        </div>

        {/* Address Card with 3D Visual */}
        <Card className="bg-gradient-primary text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-64 h-32 opacity-20">
            <div className="transform rotate-12 scale-150">
              <Building className="w-full h-full" />
            </div>
          </div>
          
          <CardContent className="p-8 relative z-10">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold">{currentAddress.companyName}</h2>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span className="text-white/90">Your registered shipping address</span>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold">Suite Number</p>
                <p className="text-3xl font-bold">{currentAddress.suite}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Address Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2 text-lg md:text-xl">
                <User className="w-4 h-4 md:w-5 md:h-5" />
                <span>Personal Information</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Name</label>
                <p className="text-base md:text-lg font-semibold text-foreground">{user?.name || "Loading..."}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Phone Number</label>
                <p className="text-base md:text-lg text-foreground flex items-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>{user?.phone || "Loading..."}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground flex items-center space-x-2 text-lg md:text-xl">
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
                <span>Address Details</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 md:space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Address</label>
                <p className="text-base md:text-lg text-foreground break-words">{currentAddress.address}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">City</label>
                  <p className="text-base md:text-lg text-foreground">{currentAddress.city}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">State</label>
                  <p className="text-base md:text-lg text-foreground">{currentAddress.state}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Zip Code</label>
                <p className="text-base md:text-lg text-foreground">{currentAddress.zipCode}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Important Notice */}
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold">!</span>
              </div>
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">Important Notice</h3>
                <p className="text-blue-800 text-sm">
                  {currentAddress.notice}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Address;
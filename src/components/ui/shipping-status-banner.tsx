import { useState, useEffect } from "react"
import { Plus, Clock } from "lucide-react"
import { cn } from "@/lib/utils"

interface ShippingStatusBannerProps {
  selectedCountry?: string
  className?: string
}

export function ShippingStatusBanner({ selectedCountry = "Belgium", className }: ShippingStatusBannerProps) {
  const [timeRemaining, setTimeRemaining] = useState({
    days: 4,
    hours: 19
  })

  // Mock countdown (in a real app, this would calculate from actual next shipment date)
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev.hours > 0) {
          return { ...prev, hours: prev.hours - 1 }
        } else if (prev.days > 0) {
          return { days: prev.days - 1, hours: 23 }
        }
        return prev
      })
    }, 3600000) // Update every hour

    return () => clearInterval(interval)
  }, [])

  return (
    <div className={cn(
      "flex items-center justify-between px-4 py-2 rounded-lg text-sm",
      "bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm",
      className
    )}>
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-1">
          <Plus className="w-3 h-3" />
          <span className="font-medium">{selectedCountry} Standard</span>
        </div>
        <div className="font-mono text-xs bg-white/20 px-2 py-1 rounded">
          UM1ZZ649
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Clock className="w-3 h-3" />
        <span className="text-xs">
          {timeRemaining.days} Days {timeRemaining.hours} Hours Until Next Shipment from{" "}
          <span className="font-medium">
            {selectedCountry === "Belgium" ? "BLG" : 
             selectedCountry === "Germany" ? "GER" :
             selectedCountry === "United States" ? "USA" :
             selectedCountry === "United Kingdom" ? "UK" :
             selectedCountry === "China Air" ? "CHN" :
             selectedCountry === "Turkey" ? "TUR" :
             selectedCountry === "India" ? "IND" :
             selectedCountry === "Saudi Arabia" ? "SA" :
             selectedCountry.slice(0, 3).toUpperCase()}
          </span>
        </span>
      </div>
    </div>
  )
}
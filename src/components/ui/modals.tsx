
import { useState, useEffect } from "react"
import { Shield, Percent, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ApiService } from "@/services/api"
import { toast } from "sonner"

export function InsuranceModal() {
  const [open, setOpen] = useState(false)
  const [insuranceValue, setInsuranceValue] = useState("")
  const [selectedPackage, setSelectedPackage] = useState("")
  const [packages, setPackages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPackages, setLoadingPackages] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPackages()
    }
  }, [open])

  const fetchPackages = async () => {
    setLoadingPackages(true)
    try {
      const response = await ApiService.getAllPackages()
      if (response.success) {
        setPackages(response.data || [])
      }
    } catch (error: any) {
      console.error("Failed to fetch packages:", error)
      toast.error("Failed to load packages")
    } finally {
      setLoadingPackages(false)
    }
  }

  const handleActivate = async () => {
    if (!insuranceValue) {
      toast.error("Please enter an insurance value")
      return
    }

    if (!selectedPackage) {
      toast.error("Please select a package")
      return
    }

    setIsLoading(true)
    try {
      const response = await ApiService.applyInsurance(parseInt(selectedPackage), {
        insurance_value: parseFloat(insuranceValue)
      })
      
      if (response.success) {
        toast.success("Insurance applied successfully")
        setOpen(false)
        setInsuranceValue("")
        setSelectedPackage("")
      }
    } catch (error: any) {
      console.error("Insurance application failed:", error)
      toast.error(error.message || "Failed to apply insurance")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>Insurance</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Shield className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold">OBOUR EXPRESS</span>
              <div className="text-sm font-normal text-muted-foreground">Insurance</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary">3.50<span className="text-lg">%</span></div>
          </div>

          <p className="text-sm text-muted-foreground text-center leading-relaxed">
            While damaged or lost packages are rare, we recommend insuring each shipment in the unlikely 
            event something does happen to your goods. In the event your shipment is damaged upon delivery or 
            lost, OBOUR EXPRESS will cover all of your lost fees.
          </p>

          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Select Package & Declare Value</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Select Package</label>
                <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder={loadingPackages ? "Loading packages..." : "Select a package"} />
                  </SelectTrigger>
                  <SelectContent>
                    {packages.map((pkg) => (
                      <SelectItem key={pkg.id} value={pkg.id.toString()}>
                        Package #{pkg.id} - {pkg.description || 'No description'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Insurance Value</label>
                <Input 
                  placeholder="Enter value..." 
                  value={insuranceValue}
                  onChange={(e) => setInsuranceValue(e.target.value)}
                  type="number"
                />
              </div>

              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={handleActivate}
                disabled={isLoading || loadingPackages || !selectedPackage}
              >
                {isLoading ? "Activating..." : "Activate"}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function DiscountCodeModal() {
  const [open, setOpen] = useState(false)
  const [discountCode, setDiscountCode] = useState("")
  const [selectedPackage, setSelectedPackage] = useState("")
  const [packages, setPackages] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingPackages, setLoadingPackages] = useState(false)

  useEffect(() => {
    if (open) {
      fetchPackages()
    }
  }, [open])

  const fetchPackages = async () => {
    setLoadingPackages(true)
    try {
      const response = await ApiService.getAllPackages()
      if (response.success) {
        setPackages(response.data || [])
      }
    } catch (error: any) {
      console.error("Failed to fetch packages:", error)
      toast.error("Failed to load packages")
    } finally {
      setLoadingPackages(false)
    }
  }

  const handleApply = async () => {
    if (!discountCode) {
      toast.error("Please enter a discount code")
      return
    }

    if (!selectedPackage) {
      toast.error("Please select a package")
      return
    }

    setIsLoading(true)
    try {
      const response = await ApiService.applyDiscount({
        discount_code: discountCode,
        package_id: parseInt(selectedPackage)
      })
      
      if (response.success) {
        toast.success("Discount code applied successfully")
        setOpen(false)
        setDiscountCode("")
        setSelectedPackage("")
      }
    } catch (error: any) {
      console.error("Discount application failed:", error)
      toast.error(error.message || "Failed to apply discount code")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center space-x-2">
          <Percent className="w-4 h-4" />
          <span>Discount Code</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-foreground">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Percent className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-bold">OBOUR EXPRESS</span>
              <div className="text-sm font-normal text-muted-foreground">Discount Code</div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <p className="text-sm text-muted-foreground text-center">
            Write down the discount code below to save costs on your next shipment with OBOUR EXPRESS
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Select Package</label>
              <Select value={selectedPackage} onValueChange={setSelectedPackage}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={loadingPackages ? "Loading packages..." : "Select a package"} />
                </SelectTrigger>
                <SelectContent>
                  {packages.map((pkg) => (
                    <SelectItem key={pkg.id} value={pkg.id.toString()}>
                      Package #{pkg.id} - {pkg.description || 'No description'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-2 block">Discount Code</label>
              <Input 
                placeholder="Enter discount code..." 
                className="text-center"
                value={discountCode}
                onChange={(e) => setDiscountCode(e.target.value)}
              />
            </div>

            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white"
              onClick={handleApply}
              disabled={isLoading || loadingPackages || !selectedPackage}
            >
              {isLoading ? "Applying..." : "Apply"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

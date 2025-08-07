import { ChevronDown, Flag, Ship, Plane } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { useCountry } from "@/contexts/CountryContext"

const shippingOptions = [
  { name: "Belgium", icon: Flag },
  { name: "China Air", icon: Plane },
  { name: "China-Sea-KG", icon: Ship },
  { name: "Germany", icon: Flag },
  { name: "India", icon: Flag },
  { name: "Saudi Arabia", icon: Flag },
  { name: "SHEIN - United Arab Emirates - Sea", icon: Ship },
  { name: "Turkey", icon: Flag },
  { name: "United Arab Emirates - Air", icon: Plane },
  { name: "United Arab Emirates - Sea", icon: Ship },
  { name: "United Kingdom", icon: Flag },
  { name: "United States", icon: Flag },
  { name: "USA - Sea", icon: Ship },
]

export function CountrySelector() {
  const { selectedCountry, setSelectedCountry } = useCountry()
  const selected = shippingOptions.find(option => option.name === selectedCountry) || shippingOptions[0]
  
  const handleSelect = (option: typeof shippingOptions[0]) => {
    setSelectedCountry(option.name)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center space-x-2 min-w-[200px] justify-between">
          <div className="flex items-center space-x-2">
            <selected.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{selected.name}</span>
          </div>
          <ChevronDown className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 max-h-64 overflow-y-auto">
        {shippingOptions.map((option) => (
          <DropdownMenuItem
            key={option.name}
            onClick={() => handleSelect(option)}
            className="flex items-center space-x-2"
          >
            <option.icon className="w-4 h-4" />
            <span>{option.name}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
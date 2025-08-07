import { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Crown, Check } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ApiService } from "@/services/api"

interface EditMembershipModalProps {
  children?: React.ReactNode
}

export function EditMembershipModal({ children }: EditMembershipModalProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const queryClient = useQueryClient()

  const { data: membershipsResponse } = useQuery({
    queryKey: ['memberships'],
    queryFn: ApiService.getMemberships
  })

  const memberships = membershipsResponse?.data || []

  const updateMembershipMutation = useMutation({
    mutationFn: (membershipId: number) => ApiService.updateMembership(membershipId),
    onSuccess: (response) => {
      if (response.success) {
        toast({
          title: "Success",
          description: response.message || "Membership updated successfully",
        })
        queryClient.invalidateQueries({ queryKey: ['memberships'] })
        queryClient.invalidateQueries({ queryKey: ['user'] })
        setOpen(false)
      } else {
        toast({
          title: "Error",
          description: response.message || "Failed to update membership",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update membership",
        variant: "destructive",
      })
    }
  })

  const handleMembershipChange = (membershipId: number) => {
    updateMembershipMutation.mutate(membershipId)
  }

  const activeMembership = memberships.find(m => m.is_active)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <Crown className="w-4 h-4" />
            <span>Change Membership</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Crown className="w-4 h-4 text-white" />
            </div>
            <span>Choose Your Membership</span>
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {memberships.map((membership) => (
            <Card 
              key={membership.id} 
              className={`relative cursor-pointer transition-all ${
                membership.is_active 
                  ? 'ring-2 ring-primary bg-primary/5' 
                  : 'hover:shadow-md'
              }`}
              onClick={() => !membership.is_active && handleMembershipChange(membership.id)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <span>{membership.name}</span>
                    {membership.is_active && (
                      <Badge variant="default" className="ml-2">
                        Current
                      </Badge>
                    )}
                  </CardTitle>
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {membership.price === 0 ? 'Free' : `${membership.price.toLocaleString()} ${membership.currency}`}
                    </div>
                    {membership.price > 0 && (
                      <div className="text-sm text-muted-foreground">per month</div>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {membership.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {!membership.is_active && (
                  <Button 
                    className="w-full mt-4" 
                    disabled={updateMembershipMutation.isPending}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleMembershipChange(membership.id)
                    }}
                  >
                    {updateMembershipMutation.isPending 
                      ? "Updating..." 
                      : membership.price === 0 
                        ? "Switch to Basic" 
                        : "Upgrade to Premium"
                    }
                  </Button>
                )}
              </CardContent>
              
              {membership.is_active && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-primary" />
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-end">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { MapPin } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { ApiService } from "@/services/api"

const locationSchema = z.object({
  location: z.string().min(1, "Location is required"),
})

interface ChangeLocationModalProps {
  children?: React.ReactNode
}

export function ChangeLocationModal({ children }: ChangeLocationModalProps) {
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const { data: userData } = useQuery({
    queryKey: ['user'],
    queryFn: ApiService.getUser,
  })

  const form = useForm<z.infer<typeof locationSchema>>({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      location: "",
    },
  })

  // Update form when user data is loaded
  useEffect(() => {
    if (userData?.data?.location) {
      form.setValue("location", userData.data.location)
    }
  }, [userData, form])

  const queryClient = useQueryClient()

  const changeLocationMutation = useMutation({
    mutationFn: (data: { location: string }) => ApiService.updateUserLocation(data),
    onSuccess: (response: any) => {
      if (response?.success) {
        toast({
          title: "Success",
          description: response?.message || "Location updated successfully",
        })
        queryClient.invalidateQueries({ queryKey: ['user'] })
        setOpen(false)
      } else {
        toast({
          title: "Error",
          description: response?.message || "Failed to update location",
          variant: "destructive",
        })
      }
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update location",
        variant: "destructive",
      })
    }
  })

  const onSubmit = (values: z.infer<typeof locationSchema>) => {
    if (values.location) {
      changeLocationMutation.mutate({ location: values.location })
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center space-x-2">
            <MapPin className="w-4 h-4" />
            <span>Change Location</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>Change Location</span>
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder={userData?.data?.location || "Enter your location"}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={changeLocationMutation.isPending}
              >
                {changeLocationMutation.isPending ? "Updating..." : "Update Location"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
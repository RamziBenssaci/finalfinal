import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Send, X } from "lucide-react";
import { ApiService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface SendNotificationModalProps {
  client: any;
  isOpen: boolean;
  onClose: () => void;
}

export function SendNotificationModal({ client, isOpen, onClose }: SendNotificationModalProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const sendNotificationMutation = useMutation({
    mutationFn: (data: { clientId: number; message: string }) =>
      ApiService.sendNotification(data.clientId, data.message),
    onSuccess: () => {
      toast({
        title: "Notification sent",
        description: `Notification sent successfully to ${client?.name}`,
      });
      setMessage("");
      onClose();
      queryClient.invalidateQueries({ queryKey: ["admin-clients"] });
    },
    onError: (error) => {
      toast({
        title: "Failed to send notification",
        description: "There was an error sending the notification. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSend = () => {
    if (!message.trim()) {
      toast({
        title: "Message required",
        description: "Please enter a notification message",
        variant: "destructive",
      });
      return;
    }

    sendNotificationMutation.mutate({
      clientId: client?.id,
      message: message.trim(),
    });
  };

  const handleClose = () => {
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md w-[95vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            Send Notification
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Recipient</Label>
            <div className="p-3 bg-muted rounded-md">
              <p className="font-medium">{client?.name}</p>
              <p className="text-sm text-muted-foreground">{client?.email}</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Notification Message
            </Label>
            <Textarea
              id="message"
              placeholder="Enter your notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="min-h-[120px] resize-none"
              maxLength={500}
            />
            <div className="flex justify-between items-center text-xs text-muted-foreground">
              <span>Maximum 500 characters</span>
              <span>{message.length}/500</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <Button
            variant="outline"
            onClick={handleClose}
            className="flex-1 order-2 sm:order-1"
            disabled={sendNotificationMutation.isPending}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            disabled={sendNotificationMutation.isPending || !message.trim()}
            className="flex-1 order-1 sm:order-2 flex items-center justify-center gap-2"
          >
            {sendNotificationMutation.isPending ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Send Notification
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
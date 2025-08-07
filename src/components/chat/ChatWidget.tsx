import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Minimize2, Maximize2 } from "lucide-react"
import { ApiService } from "@/services/api"
import { toast } from "@/hooks/use-toast"

interface ChatMessage {
  id: number
  message: string
  sender_type: 'admin' | 'user'
  sender_name: string
  created_at: string
}

export const ChatWidget = () => {
  const [isMinimized, setIsMinimized] = useState(true)
  const [message, setMessage] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Fetch messages with polling for real-time updates
  const { data: messagesResponse } = useQuery({
    queryKey: ['user-chat-messages'],
    queryFn: ApiService.getUserChatMessages,
    refetchInterval: 2000, // Poll every 2 seconds for real-time effect
    enabled: !isMinimized
  })

  const messages = messagesResponse?.data || []

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) => ApiService.sendUserChatMessage(messageText),
    onSuccess: () => {
      setMessage("")
      queryClient.invalidateQueries({ queryKey: ['user-chat-messages'] })
    },
    onError: (error: any) => {
      toast({
        title: "Error sending message",
        description: error.message || "Failed to send message",
        variant: "destructive",
      })
    }
  })

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      sendMessageMutation.mutate(message.trim())
    }
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isMinimized ? (
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </Button>
      ) : (
        <Card className="w-80 h-96 shadow-xl border-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm flex items-center space-x-2">
                <MessageCircle className="w-4 h-4" />
                <span>Support Chat</span>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(true)}
                className="h-6 w-6 p-0"
              >
                <Minimize2 className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-2 flex flex-col h-80">
            {/* Messages Area */}
            <ScrollArea className="flex-1 mb-2 p-2 border rounded" ref={scrollRef}>
              <div className="space-y-2">
                {messages.length > 0 ? (
                  messages.map((msg: ChatMessage) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender_type === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                          msg.sender_type === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <div className="font-medium text-xs mb-1">
                          {msg.sender_name}
                        </div>
                        <div>{msg.message}</div>
                        <div className="text-xs opacity-70 mt-1">
                          {formatTime(msg.created_at)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center text-muted-foreground text-sm py-8">
                    No messages yet. Start the conversation!
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="flex space-x-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 text-sm"
                disabled={sendMessageMutation.isPending}
              />
              <Button
                type="submit"
                size="sm"
                disabled={!message.trim() || sendMessageMutation.isPending}
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
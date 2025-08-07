import { useState, useEffect, useRef } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageCircle, Send, Minimize2, Search, Users, User } from "lucide-react"
import { ApiService } from "@/services/api"
import { toast } from "@/hooks/use-toast"

interface ChatMessage {
  id: number
  message: string
  sender_type: 'admin' | 'user'
  sender_name: string
  user_id?: number
  created_at: string
}

interface ChatUser {
  id: number
  name: string
  email: string
  last_message?: string
  last_message_time?: string
  unread_count?: number
}

export const AdminChatWidget = () => {
  const [isMinimized, setIsMinimized] = useState(true)
  const [message, setMessage] = useState("")
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showUserList, setShowUserList] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)
  const queryClient = useQueryClient()

  // Fetch chat users
  const { data: usersResponse } = useQuery({
    queryKey: ['admin-chat-users'],
    queryFn: ApiService.getAdminChatUsers,
    refetchInterval: 5000, // Poll every 5 seconds for new users
    enabled: !isMinimized
  })

  // Fetch messages for selected user
  const { data: messagesResponse } = useQuery({
    queryKey: ['admin-chat-messages', selectedUserId],
    queryFn: () => ApiService.getAdminChatMessages(selectedUserId || undefined),
    refetchInterval: 2000, // Poll every 2 seconds for real-time effect
    enabled: !isMinimized && selectedUserId !== null
  })

  const users = usersResponse?.data || []
  const messages = messagesResponse?.data || []

  // Filter users based on search query
  const filteredUsers = users.filter((user: ChatUser) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: (messageText: string) => {
      if (!selectedUserId) {
        throw new Error("Please select a user to chat with")
      }
      return ApiService.sendAdminChatMessage(messageText, selectedUserId)
    },
    onSuccess: () => {
      setMessage("")
      queryClient.invalidateQueries({ queryKey: ['admin-chat-messages', selectedUserId] })
      queryClient.invalidateQueries({ queryKey: ['admin-chat-users'] })
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
    if (message.trim() && selectedUserId) {
      sendMessageMutation.mutate(message.trim())
    }
  }

  const handleUserSelect = (userId: number) => {
    setSelectedUserId(userId)
    setShowUserList(false)
  }

  const handleBackToUserList = () => {
    setSelectedUserId(null)
    setShowUserList(true)
  }

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const selectedUser = users.find((user: ChatUser) => user.id === selectedUserId)

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
                <span>
                  {showUserList || !selectedUser ? "Live Chat (Admin)" : `Chat with ${selectedUser.name}`}
                </span>
              </CardTitle>
              <div className="flex items-center space-x-1">
                {!showUserList && selectedUser && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToUserList}
                    className="h-6 w-6 p-0"
                  >
                    <Users className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(true)}
                  className="h-6 w-6 p-0"
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-2 flex flex-col h-80">
            {showUserList || !selectedUserId ? (
              // User List View
              <>
                {/* Search Bar */}
                <div className="relative mb-2">
                  <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search users..."
                    className="pl-8 text-sm"
                  />
                </div>

                {/* Users List */}
                <ScrollArea className="flex-1">
                  <div className="space-y-2">
                    {filteredUsers.length > 0 ? (
                      filteredUsers.map((user: ChatUser) => (
                        <div
                          key={user.id}
                          onClick={() => handleUserSelect(user.id)}
                          className="flex items-center space-x-3 p-2 rounded-lg bg-muted hover:bg-muted/80 cursor-pointer transition-colors"
                        >
                          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-sm text-foreground truncate">
                              {user.name}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                            {user.last_message && (
                              <p className="text-xs text-muted-foreground truncate">
                                {user.last_message}
                              </p>
                            )}
                          </div>
                          {user.unread_count && user.unread_count > 0 && (
                            <div className="w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center text-xs font-medium">
                              {user.unread_count}
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="text-center text-muted-foreground text-sm py-8">
                        {searchQuery ? "No users found" : "No active chats"}
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </>
            ) : (
              // Chat View
              <>
                {/* Messages Area */}
                <ScrollArea className="flex-1 mb-2 p-2 border rounded" ref={scrollRef}>
                  <div className="space-y-2">
                    {messages.length > 0 ? (
                      messages.map((msg: ChatMessage) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.sender_type === 'admin' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[75%] px-3 py-2 rounded-lg text-sm ${
                              msg.sender_type === 'admin'
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
                    placeholder={`Message ${selectedUser?.name || 'user'}...`}
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
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
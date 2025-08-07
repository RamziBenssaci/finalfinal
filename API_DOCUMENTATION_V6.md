# API Documentation v6.0

## Live Chat Endpoints

### User Chat Endpoints

#### Get User Chat Messages
```http
GET /api/chat/messages
```

**Headers:**
```
Authorization: Bearer {user_token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "message": "Hello, I need help with my order",
      "sender_type": "user",
      "sender_name": "John Doe",
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "message": "Hi! How can I help you today?",
      "sender_type": "admin",
      "sender_name": "Admin",
      "created_at": "2024-01-15T10:31:00Z"
    }
  ]
}
```

#### Send User Chat Message
```http
POST /api/chat/messages
```

**Headers:**
```
Authorization: Bearer {user_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Hello, I need help with my shipment",
  "admin_id": 3
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 3,
    "message": "Hello, I need help with my shipment",
    "sender_type": "user",
    "sender_name": "John Doe",
    "created_at": "2024-01-15T10:32:00Z"
  },
  "message": "Message sent successfully"
}
```

### Admin Chat Endpoints

#### Get Admin Chat Users
```http
GET /api/admin/chat/users
```

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 123,
      "name": "John Doe",
      "email": "john@example.com",
      "last_message": "Hello, I need help with my order",
      "last_message_time": "2024-01-15T10:30:00Z",
      "unread_count": 2
    },
    {
      "id": 124,
      "name": "Jane Smith",
      "email": "jane@example.com",
      "last_message": "Thank you for your help!",
      "last_message_time": "2024-01-15T09:15:00Z",
      "unread_count": 0
    }
  ]
}
```

#### Get Admin Chat Messages
```http
GET /api/admin/chat/messages
```

**Query Parameters:**
- `user_id` (optional): Get messages for specific user

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "message": "Hello, I need help with my order",
      "sender_type": "user",
      "sender_name": "John Doe",
      "user_id": 123,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "message": "Hi! How can I help you today?",
      "sender_type": "admin",
      "sender_name": "Admin",
      "created_at": "2024-01-15T10:31:00Z"
    }
  ]
}
```

#### Send Admin Chat Message
```http
POST /api/admin/chat/messages
```

**Headers:**
```
Authorization: Bearer {admin_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "message": "Hi! How can I help you today?",
  "user_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 4,
    "message": "Hi! How can I help you today?",
    "sender_type": "admin",
    "sender_name": "Admin",
    "user_id": 123,
    "created_at": "2024-01-15T10:33:00Z"
  },
  "message": "Message sent successfully"
}
```

## Chat Object Structures

### Chat Message Fields
- `id` (integer): Unique message identifier
- `message` (string): The chat message content
- `sender_type` (string): Either "user" or "admin"
- `sender_name` (string): Name of the person who sent the message
- `user_id` (integer, admin view only): ID of the user (only included in admin responses)
- `created_at` (datetime): When the message was sent

### Chat User Fields (Admin View)
- `id` (integer): Unique user identifier
- `name` (string): User's full name
- `email` (string): User's email address
- `last_message` (string, optional): Last message from this conversation
- `last_message_time` (datetime, optional): Timestamp of the last message
- `unread_count` (integer, optional): Number of unread messages from this user

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "message": ["The message field is required."]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "message": "Unauthorized access"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Implementation Notes

### Real-time Communication
- The frontend polls for new messages every 2 seconds using React Query
- Admin chat users list is polled every 5 seconds for new conversations
- Messages are automatically refreshed when new ones are sent
- The chat widget maintains its own state for minimize/maximize

### Authentication
- User endpoints require user authentication token
- Admin endpoints require admin authentication token
- All requests must include proper Authorization headers

### Message Routing
- User messages are sent to a fixed admin (ID: 3)
- Admin can view all users who have initiated chats
- Admin can select specific users to chat with
- Messages are returned in chronological order (oldest first)

### User Management for Admins
- Admin can search through chat users using React-based search
- User list shows last message and unread count
- Admin can switch between different user conversations
- Each conversation is isolated per user

### Performance Considerations
- Polling is only active when the chat widget is open (not minimized)
- Messages are cached using React Query for better performance
- User search is client-side for instant filtering
- Consider implementing pagination for high-volume chat histories

## Chat Widget Features

### User Features
- Send messages directly to admin (ID: 3)
- View conversation history with admin
- Real-time message updates every 2 seconds
- Minimizable floating widget
- Responsive design for mobile
- Simple one-to-one chat interface

### Admin Features
- View list of all users who have initiated chats
- Search through users by name or email
- Select specific users to chat with
- Real-time message updates every 2 seconds
- User list updates every 5 seconds
- Unread message indicators
- Switch between different user conversations
- Minimizable floating widget with user management
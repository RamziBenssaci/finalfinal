# API Documentation Version 4 - Notification System

This document contains the API endpoints for the notification system functionality.

## Base URL
```
https://api.example.com/api
```

## Authentication
All endpoints require authentication via Bearer token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Admin Endpoints

### Send Notification to Client
**POST** `/admin/notifications`

Send a notification message to a specific client.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "client_id": 123,
  "message": "Your package has been processed and will be shipped soon."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification sent successfully",
  "data": {
    "id": 456,
    "client_id": 123,
    "message": "Your package has been processed and will be shipped soon.",
    "is_read": false,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Client not found",
  "error_code": "CLIENT_NOT_FOUND"
}
```

---

## Client/User Endpoints

### Get User Notifications
**GET** `/notifications`

Retrieve all notifications for the authenticated user.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Query Parameters:**
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `status` (optional): Filter by read status (`read`, `unread`, `all`) (default: all)

**Response:**
```json
{
  "success": true,
  "message": "Notifications retrieved successfully",
  "data": [
    {
      "id": 456,
      "message": "Your package has been processed and will be shipped soon.",
      "is_read": false,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 455,
      "message": "Your delivery request has been approved.",
      "is_read": true,
      "created_at": "2024-01-14T14:20:00Z",
      "updated_at": "2024-01-14T15:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 45,
    "items_per_page": 20
  }
}
```

### Mark Notification as Read
**PUT** `/notifications/{id}/read`

Mark a specific notification as read.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Path Parameters:**
- `id`: Notification ID

**Response:**
```json
{
  "success": true,
  "message": "Notification marked as read",
  "data": {
    "id": 456,
    "message": "Your package has been processed and will be shipped soon.",
    "is_read": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T11:00:00Z"
  }
}
```

### Mark All Notifications as Read
**PUT** `/notifications/read-all`

Mark all notifications for the authenticated user as read.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Response:**
```json
{
  "success": true,
  "message": "All notifications marked as read",
  "data": {
    "updated_count": 15
  }
}
```

### Delete Notification
**DELETE** `/notifications/{id}`

Delete a specific notification.

**Headers:**
```
Authorization: Bearer <user_token>
```

**Path Parameters:**
- `id`: Notification ID

**Response:**
```json
{
  "success": true,
  "message": "Notification deleted successfully"
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Notification not found",
  "error_code": "NOTIFICATION_NOT_FOUND"
}
```

---

## Database Schema

### Notifications Table
```sql
CREATE TABLE notifications (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    client_id BIGINT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (client_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication token |
| `FORBIDDEN` | Insufficient permissions |
| `CLIENT_NOT_FOUND` | The specified client does not exist |
| `NOTIFICATION_NOT_FOUND` | The specified notification does not exist |
| `VALIDATION_ERROR` | Invalid request data |
| `SERVER_ERROR` | Internal server error |

---

## Rate Limiting

- Admin notification sending: 60 requests per minute per admin
- User notification fetching: 120 requests per minute per user
- Mark as read operations: 180 requests per minute per user

---

## Real-time Updates (Optional)

For real-time notification updates, consider implementing WebSocket connections:

**WebSocket Endpoint:** `wss://api.example.com/ws/notifications`

**Authentication:** Send token in connection query parameter:
```
wss://api.example.com/ws/notifications?token=<user_token>
```

**Real-time Events:**
```json
{
  "type": "new_notification",
  "data": {
    "id": 456,
    "message": "Your package has been processed and will be shipped soon.",
    "is_read": false,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```
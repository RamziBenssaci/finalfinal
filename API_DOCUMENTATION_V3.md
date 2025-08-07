# API Documentation V3 - Buy For Me Service (Admin)

## Admin Buy For Me Requests Management

### Get All Buy For Me Requests (Admin)
**Endpoint:** `GET /api/admin/buy-for-me-requests`

**Description:** Retrieves all buy for me requests from all customers for admin review and management.

**Authentication:** Admin Bearer Token required

**Query Parameters:**
- `status` (optional): Filter by request status (pending, processing, purchased, shipped, delivered, cancelled)
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of items per page (default: 20)
- `search` (optional): Search by product name, customer name, or description

**Example Request:**
```http
GET /api/admin/buy-for-me-requests?status=pending&page=1&limit=10
Authorization: Bearer admin_token_here
```

**Response:**
```json
{
  "success": true,
  "message": "Buy for me requests retrieved successfully",
  "data": [
    {
      "id": 1,
      "user_id": 123,
      "user": {
        "id": 123,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "product_name": "MacBook Pro 14\"",
      "description": "Latest MacBook Pro with M3 chip, 512GB storage",
      "product_url": "https://apple.com/macbook-pro",
      "product_image_url": "https://example.com/image.jpg",
      "estimated_price": 2499.00,
      "actual_price": 2399.00,
      "currency": "USD",
      "quantity": 1,
      "status": "pending",
      "tracking_number": "1Z999AA1234567890",
      "admin_notes": "Waiting for customer payment confirmation",
      "additional_notes": "Please get it in Space Gray color",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T14:45:00Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 47,
    "per_page": 10
  }
}
```

### Update Buy For Me Request Status (Admin)
**Endpoint:** `PUT /api/admin/buy-for-me-requests/{id}/status`

**Description:** Updates the status and details of a buy for me request. Admin can approve, reject, or update progress.

**Authentication:** Admin Bearer Token required

**Path Parameters:**
- `id`: Buy for me request ID

**Request Body:**
```json
{
  "status": "processing",
  "actual_price": 2399.00,
  "tracking_number": "1Z999AA1234567890",
  "admin_notes": "Order placed successfully. Expected delivery in 5-7 business days."
}
```

**Request Body Fields:**
- `status` (required): New status (pending, processing, purchased, shipped, delivered, cancelled)
- `actual_price` (optional): Actual purchase price if different from estimated
- `tracking_number` (optional): Tracking number once item is shipped
- `admin_notes` (optional): Internal notes for the customer

**Example Request:**
```http
PUT /api/admin/buy-for-me-requests/1/status
Authorization: Bearer admin_token_here
Content-Type: application/json

{
  "status": "shipped",
  "actual_price": 2399.00,
  "tracking_number": "1Z999AA1234567890",
  "admin_notes": "Item purchased and shipped. Tracking details available."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Buy for me request updated successfully",
  "data": {
    "id": 1,
    "user_id": 123,
    "product_name": "MacBook Pro 14\"",
    "description": "Latest MacBook Pro with M3 chip, 512GB storage",
    "product_url": "https://apple.com/macbook-pro",
    "product_image_url": "https://example.com/image.jpg",
    "estimated_price": 2499.00,
    "actual_price": 2399.00,
    "currency": "USD",
    "quantity": 1,
    "status": "shipped",
    "tracking_number": "1Z999AA1234567890",
    "admin_notes": "Item purchased and shipped. Tracking details available.",
    "additional_notes": "Please get it in Space Gray color",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T09:15:00Z"
  }
}
```

### Get Buy For Me Request Statistics (Admin)
**Endpoint:** `GET /api/admin/buy-for-me-requests/stats`

**Description:** Retrieves statistics about buy for me requests for admin dashboard.

**Authentication:** Admin Bearer Token required

**Response:**
```json
{
  "success": true,
  "message": "Statistics retrieved successfully",
  "data": {
    "total_requests": 150,
    "pending_requests": 12,
    "processing_requests": 8,
    "completed_requests": 125,
    "cancelled_requests": 5,
    "total_revenue": 45750.00,
    "average_order_value": 305.00,
    "top_products": [
      {
        "product_name": "iPhone 15 Pro",
        "count": 15,
        "total_value": 17985.00
      }
    ]
  }
}
```

## Status Flow

### Request Status Lifecycle:
1. **pending** - Initial state when customer submits request
2. **processing** - Admin has approved and is working on the request
3. **purchased** - Item has been purchased by admin
4. **shipped** - Item has been shipped to customer
5. **delivered** - Item has been delivered to customer
6. **cancelled** - Request has been cancelled (by admin or customer)

### Admin Actions by Status:
- **pending** → Can approve (→ processing) or cancel (→ cancelled)
- **processing** → Can mark as purchased (→ purchased) or cancel (→ cancelled)
- **purchased** → Can mark as shipped (→ shipped) with tracking number
- **shipped** → Can mark as delivered (→ delivered)
- **delivered** → Final state, no further actions
- **cancelled** → Final state, no further actions

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "message": "Invalid status transition",
  "errors": {
    "status": ["Cannot change from delivered to processing"]
  }
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Buy for me request not found"
}
```

### 422 Validation Error
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "status": ["The status field is required"],
    "actual_price": ["The actual price must be a positive number"]
  }
}
```

## Notes

- All admin endpoints require proper admin authentication
- Status changes should follow the logical flow (e.g., cannot go from delivered back to pending)
- Tracking numbers should only be provided when status is "shipped" or "delivered"
- Admin notes are visible to customers and should be customer-friendly
- Actual price should be provided when status changes to "purchased" if different from estimated price
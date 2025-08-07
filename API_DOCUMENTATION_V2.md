# Obour Express API Documentation v2

This document serves as the API documentation for new endpoints and features in the Obour Express platform.

## Authentication

All API requests require authentication using Bearer tokens:
```
Authorization: Bearer {token}
```

## Response Format

All API responses follow this JSON format:

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": { ... } // Optional validation errors
}
```

## API Endpoints

### Shipping Addresses Management

#### Get All Shipping Addresses
**GET** `/api/admin/shipping-addresses`

Returns all shipping addresses configured by admin.

**Headers:**
- `Authorization: Bearer {admin_token}`
- `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "China Air",
      "address": "123 Beijing Street",
      "city": "Beijing",
      "state": "Beijing",
      "zip_code": "100000"
    },
    {
      "id": 2,
      "title": "Belgium",
      "address": "456 Brussels Avenue",
      "city": "Brussels",
      "state": "Brussels",
      "zip_code": "1000"
    }
  ]
}
```

#### Create Shipping Address
**POST** `/api/admin/shipping-addresses`

Creates a new shipping address.

**Headers:**
- `Authorization: Bearer {admin_token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "title": "China Air",
  "address": "123 Beijing Street",
  "city": "Beijing",
  "state": "Beijing",
  "zip_code": "100000"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "China Air",
    "address": "123 Beijing Street",
    "city": "Beijing",
    "state": "Beijing",
    "zip_code": "100000"
  },
  "message": "Shipping address created successfully"
}
```

#### Update Shipping Address
**PUT** `/api/admin/shipping-addresses/{id}`

Updates an existing shipping address.

**Headers:**
- `Authorization: Bearer {admin_token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "address": "123 Updated Beijing Street",
  "city": "Beijing",
  "state": "Beijing",
  "zip_code": "100001"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "China Air",
    "address": "123 Updated Beijing Street",
    "city": "Beijing",
    "state": "Beijing",
    "zip_code": "100001"
  },
  "message": "Shipping address updated successfully"
}
```

#### Delete Shipping Address
**DELETE** `/api/admin/shipping-addresses/{id}`

Deletes a shipping address.

**Headers:**
- `Authorization: Bearer {admin_token}`
- `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "message": "Shipping address deleted successfully"
}
```

### Customer Portal - Shipping Addresses

#### Get Available Shipping Locations
**GET** `/api/shipping-locations`

Returns all available shipping locations for customers to select from.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "China Air",
      "address": "123 Beijing Street",
      "city": "Beijing",
      "state": "Beijing",
      "zip_code": "100000"
    },
    {
      "id": 2,
      "title": "Belgium",
      "address": "456 Brussels Avenue",
      "city": "Brussels",
      "state": "Brussels",
      "zip_code": "1000"
    }
  ]
}
```

#### Get Shipping Location by ID
**GET** `/api/shipping-locations/{id}`

Returns a specific shipping location details.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "China Air",
    "address": "123 Beijing Street",
    "city": "Beijing",
    "state": "Beijing",
    "zip_code": "100000"
  }
}
```

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "title": ["The title field is required."],
    "address": ["The address field is required."]
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Unauthenticated"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "Access denied"
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Shipping address not found"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Notes for Backend Implementation

### Shipping Addresses
- Title should be unique (cannot have duplicate shipping locations)
- All fields are required when creating/updating
- Only admin users can manage shipping addresses
- Regular users can only read shipping locations
- Implement proper validation for all fields
- Consider adding soft deletes for shipping addresses

### Validation Rules
- `title`: required, string, max 100 characters, unique
- `address`: required, string, max 255 characters
- `city`: required, string, max 100 characters
- `state`: required, string, max 100 characters
- `zip_code`: required, string, max 20 characters

### Security Considerations
- Ensure proper admin authentication for management endpoints
- Validate all input data
- Implement rate limiting
- Log all administrative actions
- Use HTTPS for all API communications

## Package Return Requests

### Request Package Return
**POST** `/api/packages/{package_id}/return-request`

Allows customers to request a return for packages with "in_transit" status.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: application/json`

**URL Parameters:**
- `package_id` (integer): The ID of the package to request return for

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "package_id": 123,
    "status": "pending",
    "requested_at": "2024-01-15T10:30:00Z",
    "message": "Return request submitted successfully"
  },
  "message": "Return request submitted successfully"
}
```

**Error Response (Package not eligible for return):**
```json
{
  "success": false,
  "message": "Package is not eligible for return. Only packages with 'in_transit' status can be returned."
}
```

**Error Response (Package not found):**
```json
{
  "success": false,
  "message": "Package not found"
}
```

### Request Package Shipping
**POST** `/api/packages/{package_id}/shipping-request`

Allows customers to request immediate shipping for packages with "in_transit" status.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: application/json`

**URL Parameters:**
- `package_id` (integer): The ID of the package to request shipping for

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 2,
    "package_id": 123,
    "status": "pending",
    "requested_at": "2024-01-15T10:30:00Z",
    "message": "Shipping request submitted successfully"
  },
  "message": "Shipping request submitted successfully"
}
```

**Error Response (Package not eligible for shipping request):**
```json
{
  "success": false,
  "message": "Package is not eligible for shipping request. Only packages with 'in_transit' status can be requested for immediate shipping."
}
```

### Implementation Notes for Laravel Backend:

#### Return Requests:
- Only packages with status "in_transit" should be eligible for return requests
- Verify the package belongs to the authenticated user
- Create a return_requests table with columns: id, package_id, user_id, status (pending/approved/rejected), requested_at, processed_at, notes
- Send the request data as POST to `/api/packages/{package_id}/return-request`
- The package_id will be sent in the URL path
- No additional data is sent in the request body for this endpoint

#### Shipping Requests:
- Only packages with status "in_transit" should be eligible for shipping requests
- Verify the package belongs to the authenticated user
- Create a shipping_requests table with columns: id, package_id, user_id, status (pending/approved/rejected), requested_at, processed_at, notes
- Send the request data as POST to `/api/packages/{package_id}/shipping-request`
- The package_id will be sent in the URL path
- No additional data is sent in the request body for this endpoint

## Buy For Me Service

The Buy For Me service allows customers to request the purchase of products from any store worldwide. Customers can provide product details, images, and specifications, and the service will handle purchasing and shipping.

### Create Buy For Me Request
**POST** `/api/buy-for-me-requests`

Creates a new buy for me request with optional product image upload.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: multipart/form-data`

**Request Body (FormData):**
- `product_name` (string, required): Name of the product
- `product_url` (string, optional): URL of the product if available
- `description` (string, required): Detailed description of the product (min 10 characters)
- `estimated_price` (number, required): Estimated price of the product
- `currency` (string, required): Currency code (e.g., USD, EUR)
- `quantity` (number, required): Quantity to purchase (min 1)
- `shipping_address` (string, required): Full shipping address
- `special_instructions` (string, optional): Special requirements or instructions
- `product_image` (file, optional): Product image (JPG, PNG, GIF, max 10MB)

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_name": "Wireless Bluetooth Headphones",
    "product_url": "https://example.com/product/123",
    "description": "High-quality wireless headphones with noise cancellation",
    "estimated_price": 199.99,
    "currency": "USD",
    "quantity": 1,
    "shipping_address": "123 Main St, City, State, ZIP",
    "special_instructions": "Please ensure original packaging",
    "product_image_url": "https://storage.example.com/images/request_1_product.jpg",
    "status": "pending",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Buy for me request created successfully"
}
```

### Get Buy For Me Requests
**GET** `/api/buy-for-me-requests`

Retrieves all buy for me requests for the authenticated user.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: application/json`

**Query Parameters:**
- `status` (string, optional): Filter by status (pending, processing, purchased, shipped, delivered, cancelled)
- `page` (number, optional): Page number for pagination (default: 1)
- `limit` (number, optional): Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "requests": [
      {
        "id": 1,
        "product_name": "Wireless Bluetooth Headphones",
        "product_url": "https://example.com/product/123",
        "description": "High-quality wireless headphones with noise cancellation",
        "estimated_price": 199.99,
        "actual_price": 189.99,
        "currency": "USD",
        "quantity": 1,
        "shipping_address": "123 Main St, City, State, ZIP",
        "special_instructions": "Please ensure original packaging",
        "product_image_url": "https://storage.example.com/images/request_1_product.jpg",
        "status": "purchased",
        "tracking_number": "TN123456789",
        "created_at": "2024-01-15T10:30:00Z",
        "updated_at": "2024-01-16T14:20:00Z"
      }
    ],
    "pagination": {
      "current_page": 1,
      "total_pages": 3,
      "total_items": 25,
      "items_per_page": 10
    }
  }
}
```

### Get Buy For Me Request by ID
**GET** `/api/buy-for-me-requests/{id}`

Retrieves a specific buy for me request.

**Headers:**
- `Authorization: Bearer {user_token}`
- `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "product_name": "Wireless Bluetooth Headphones",
    "product_url": "https://example.com/product/123",
    "description": "High-quality wireless headphones with noise cancellation",
    "estimated_price": 199.99,
    "actual_price": 189.99,
    "currency": "USD",
    "quantity": 1,
    "shipping_address": "123 Main St, City, State, ZIP",
    "special_instructions": "Please ensure original packaging",
    "product_image_url": "https://storage.example.com/images/request_1_product.jpg",
    "status": "purchased",
    "tracking_number": "TN123456789",
    "admin_notes": "Found better price at different retailer",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T14:20:00Z"
  }
}
```

### Update Buy For Me Request Status (Admin Only)
**PUT** `/api/admin/buy-for-me-requests/{id}/status`

Updates the status of a buy for me request. Admin only endpoint.

**Headers:**
- `Authorization: Bearer {admin_token}`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "status": "purchased",
  "actual_price": 189.99,
  "tracking_number": "TN123456789",
  "admin_notes": "Found better price at different retailer"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "status": "purchased",
    "actual_price": 189.99,
    "tracking_number": "TN123456789",
    "admin_notes": "Found better price at different retailer",
    "updated_at": "2024-01-16T14:20:00Z"
  },
  "message": "Buy for me request status updated successfully"
}
```

### Request Status Values:
- `pending`: Request submitted, waiting for review
- `processing`: Request approved, searching for product
- `purchased`: Product purchased successfully
- `shipped`: Product shipped to customer
- `delivered`: Product delivered to customer
- `cancelled`: Request cancelled (by customer or admin)

### Error Responses for Buy For Me Service:

**Validation Error (422):**
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": {
    "product_name": ["The product name field is required."],
    "description": ["The description must be at least 10 characters."],
    "estimated_price": ["The estimated price must be 0 or greater."]
  }
}
```

**File Upload Error (422):**
```json
{
  "success": false,
  "message": "Invalid file upload",
  "errors": {
    "product_image": ["The product image must be an image file.", "The product image may not be greater than 10MB."]
  }
}
```

**Request Not Found (404):**
```json
{
  "success": false,
  "message": "Buy for me request not found"
}
```

### Implementation Notes for Laravel Backend:

#### Database Schema:
Create a `buy_for_me_requests` table with the following columns:
- `id` (primary key)
- `user_id` (foreign key to users table)
- `product_name` (string, required)
- `product_url` (text, nullable)
- `description` (text, required)
- `estimated_price` (decimal, required)
- `actual_price` (decimal, nullable)
- `currency` (string, required, default 'USD')
- `quantity` (integer, required, default 1)
- `shipping_address` (text, required)
- `special_instructions` (text, nullable)
- `product_image_path` (string, nullable)
- `status` (enum: pending, processing, purchased, shipped, delivered, cancelled)
- `tracking_number` (string, nullable)
- `admin_notes` (text, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

#### File Storage:
- Store uploaded images in a secure, publicly accessible storage (e.g., AWS S3, local storage with proper permissions)
- Generate unique filenames to prevent conflicts
- Validate file types (JPG, PNG, GIF) and size (max 10MB)
- Return full URL in API responses for image access

#### Security & Validation:
- Ensure only authenticated users can create requests
- Verify user owns the request when retrieving/updating
- Implement proper file upload validation and security
- Sanitize all text inputs
- Rate limit the creation endpoint to prevent abuse

#### Status Workflow:
1. Customer creates request (status: pending)
2. Admin reviews and approves (status: processing)
3. Admin finds and purchases product (status: purchased)
4. Product is shipped (status: shipped)
5. Product is delivered (status: delivered)

Customers can only create requests and view their own requests. Admins can view all requests and update status/details.
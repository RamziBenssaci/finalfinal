# Obour Express API Documentation

This document outlines all the API endpoints that the frontend expects from the Laravel backend. All endpoints should return JSON responses with the specified structure.

## Base URL
```
http://localhost:8000/api
```

## Authentication
The API uses Bearer token authentication. Include the token in the Authorization header:
```
Authorization: Bearer {token}
```

## Response Format
All API responses should follow this structure:

### Success Response
```json
{
  "success": true,
  "data": {}, // or []
  "message": "Optional success message"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field_name": ["Validation error message"]
  }
}
```

## Authentication Endpoints

### 1. Admin Auth Verification
- **URL**: `GET /admin/auth/verify`
- **Description**: Verify admin authentication token
- **Headers**: `Authorization: Bearer {admin_token}`
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@obourexpress.com",
      "role": "admin"
    }
  }
}
```
- **Error Response**:
```json
{
  "success": false,
  "message": "Unauthorized"
}
```

### 2. User Registration
- **URL**: `POST /auth/register`
- **Description**: Register a new user account
- **Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "location": "New York, USA",
  "password": "password123",
  "confirm_password": "password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, USA",
      "avatar": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  },
  "message": "Registration successful"
}
```

### 3. User Login
- **URL**: `POST /auth/login`
- **Description**: Authenticate user and return token
- **Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "location": "New York, USA",
      "avatar": null,
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    },
    "token": "jwt_token_here"
  }
}
```

### 4. User Logout
- **URL**: `POST /auth/logout`
- **Description**: Logout user and invalidate token
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": null,
  "message": "Logged out successfully"
}
```

### 5. Client Authentication Verification
- **URL**: `GET /auth/verify`
- **Description**: Verifies if the client is authenticated and returns user information
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "authenticated": true,
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "+964 750 123 4567",
      "location": "Baghdad, Iraq",
      "created_at": "2024-01-01T00:00:00Z",
      "updated_at": "2024-01-01T00:00:00Z"
    }
  }
}
```

## User Profile Endpoints

### 5. Get User Profile
- **URL**: `GET /user`
- **Description**: Get current user's profile information
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "avatar": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T00:00:00Z"
  }
}
```

### 6. Update User Profile
- **URL**: `PUT /user`
- **Description**: Update user profile information
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "name": "John Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567890",
  "location": "Boston, USA"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567890",
    "location": "Boston, USA",
    "avatar": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-01T12:00:00Z"
  },
  "message": "Profile updated successfully"
}
```

### 7. Update User Location
- **URL**: `PUT /user/location`
- **Description**: Update only user location
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "location": "New York, USA"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "location": "New York, USA",
    "avatar": null,
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-02T00:00:00Z"
  },
  "message": "Location updated successfully"
}
```

### 8. Change Password
- **URL**: `PUT /user/password`
- **Description**: Change user password
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "new_password": "newpassword123",
  "confirm_password": "newpassword123"
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": null,
  "message": "Password changed successfully"
}
```

## Address Management Endpoints

### 9. Get User Addresses
- **URL**: `GET /addresses`
- **Description**: Get all addresses for the authenticated user
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Home",
      "street": "123 Main Street",
      "city": "New York",
      "state": "NY",
      "country": "USA",
      "postal_code": "10001",
      "phone": "+1234567890",
      "is_default": true,
      "type": "home"
    }
  ]
}
```

### 10. Create Address
- **URL**: `POST /addresses`
- **Description**: Create a new address for the user
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "name": "Office",
  "street": "456 Business Ave",
  "city": "New York",
  "state": "NY",
  "country": "USA",
  "postal_code": "10002",
  "phone": "+1234567890",
  "type": "work",
  "is_default": false
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Office",
    "street": "456 Business Ave",
    "city": "New York",
    "state": "NY",
    "country": "USA",
    "postal_code": "10002",
    "phone": "+1234567890",
    "is_default": false,
    "type": "work"
  },
  "message": "Address created successfully"
}
```

### 11. Update Address
- **URL**: `PUT /addresses/{id}`
- **Description**: Update an existing address
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**: Same as create address
- **Success Response**: Same as create address with updated data

### 12. Delete Address
- **URL**: `DELETE /addresses/{id}`
- **Description**: Delete an address
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": null,
  "message": "Address deleted successfully"
}
```

## Package Management Endpoints

### 13. Get User Packages (My Suite)
- **URL**: `GET /packages`
- **Description**: Get all active packages for the user, filtered by shipping method
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `shipping_method` (optional): Filter packages by selected shipping method
- **Example**: `GET /packages?shipping_method=china-air`
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tracking_number": "UM1ZZ649",
      "description": "Electronics package",
      "country": "Belgium",
      "origin_country": "USA",
      "destination_country": "Belgium",
      "weight": 2.5,
      "status": "in_transit",
      "estimated_delivery": "2024-01-20",
      "created_at": "2024-01-15T00:00:00Z",
      "shipping_method": "Express",
      "price": 45.99,
      "insurance": false,
      "discount_applied": null
    }
  ]
}
```

### 13b. Get All User Packages (For Selection)
- **URL**: `GET /packages/all`
- **Description**: Get all user's packages without filtering for use in insurance/discount selection
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tracking_number": "UM1ZZ649",
      "description": "Electronics package",
      "weight": 2.5,
      "status": "in_transit",
      "created_at": "2024-01-15T00:00:00Z"
    },
    {
      "id": 2,
      "tracking_number": "UM1ZZ650",
      "description": "Documents package",
      "weight": 0.5,
      "status": "pending",
      "created_at": "2024-01-16T00:00:00Z"
    }
  ]
}
```

### 14. Get User Shipments
- **URL**: `GET /shipments`
- **Description**: Get all shipments for the user, filtered by shipping method
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `shipping_method` (optional): Filter shipments by selected shipping method
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tracking_number": "UM1ZZ649",
      "description": "Electronics package",
      "country": "Belgium",
      "origin": "USA",
      "destination": "Belgium",
      "status": "in_transit",
      "weight": 2.5,
      "price": 45.99,
      "created_at": "2024-01-15T00:00:00Z",
      "estimated_delivery": "2024-01-20"
    }
  ]
}
```

### 15. Get Archived Packages
- **URL**: `GET /archive`
- **Description**: Get all delivered/archived packages for the user
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `shipping_method` (optional): Filter archives by selected shipping method
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "tracking_number": "UM1ZZ640",
      "description": "Books package",
      "country": "Belgium",
      "status": "delivered",
      "delivered_at": "2024-01-10T00:00:00Z",
      "weight": 1.2,
      "price": 25.50
    }
  ]
}
```

### 16. Apply Insurance to Package
- **URL**: `POST /packages/{package_id}/insurance`
- **Description**: Add insurance to a package
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "insurance_value": 100.00
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "package_id": 1,
    "insurance_applied": true,
    "insurance_value": 100.00,
    "insurance_cost": 3.50,
    "total_cost": 53.50
  },
  "message": "Insurance applied successfully"
}
```
- **Error Response**:
```json
{
  "success": false,
  "message": "Package not found or already has insurance"
}
```

### 17. Apply Discount Code to Package
- **URL**: `POST /discounts/apply`
- **Description**: Apply a discount code to a package
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "discount_code": "WELCOME10",
  "package_id": 1
}
```
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "discount_applied": true,
    "original_price": 50.00,
    "discount_amount": 5.00,
    "final_price": 45.00,
    "discount_code": "WELCOME10",
    "discount_type": "percentage"
  },
  "message": "Discount code applied successfully"
}
```
- **Error Response**:
```json
{
  "success": false,
  "message": "Invalid discount code or discount has expired"
}
```

## Delivery Request Endpoints

### 18. Get Delivery Requests
- **URL**: `GET /delivery-requests`
- **Description**: Get all delivery requests for the user
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `country` (optional): Filter by country
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "pickup_address": {
        "id": 1,
        "name": "Home",
        "street": "123 Main Street",
        "city": "New York",
        "state": "NY",
        "country": "USA",
        "postal_code": "10001",
        "phone": "+1234567890",
        "is_default": true,
        "type": "home"
      },
      "delivery_address": {
        "id": 2,
        "name": "Office",
        "street": "456 Business Ave",
        "city": "Boston",
        "state": "MA",
        "country": "USA",
        "postal_code": "02101",
        "phone": "+1234567891",
        "is_default": false,
        "type": "work"
      },
      "package_details": {
        "weight": 2.5,
        "dimensions": {
          "length": 30,
          "width": 20,
          "height": 10
        },
        "value": 100.00,
        "description": "Electronics"
      },
      "delivery_date": "2024-01-25",
      "delivery_time": "14:00",
      "special_instructions": "Handle with care",
      "status": "pending",
      "tracking_number": "DR123456",
      "cost": 25.00,
      "created_at": "2024-01-15T00:00:00Z"
    }
  ]
}
```

### 19. Create Delivery Request
- **URL**: `POST /delivery-requests`
- **Description**: Create a new delivery request
- **Headers**: `Authorization: Bearer {token}`
- **Request Body**:
```json
{
  "pickup_address_id": 1,
  "delivery_address_id": 2,
  "package_weight": 2.5,
  "package_length": 30,
  "package_width": 20,
  "package_height": 10,
  "package_value": 100.00,
  "package_description": "Electronics",
  "delivery_date": "2024-01-25",
  "delivery_time": "14:00",
  "special_instructions": "Handle with care"
}
```
- **Success Response**: Same structure as get delivery requests

## Wallet & Membership Endpoints

### 20. Get Wallet Information
- **URL**: `GET /wallet`
- **Description**: Get user's wallet balance and transactions
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "balance": 150.75,
    "currency": "USD",
    "transactions": [
      {
        "id": 1,
        "type": "deposit",
        "amount": 100.00,
        "currency": "USD",
        "description": "Wallet top-up",
        "status": "completed",
        "created_at": "2024-01-15T00:00:00Z"
      }
    ]
  }
}
```

### 21. Get Available Memberships
- **URL**: `GET /memberships`
- **Description**: Get all available membership plans
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Basic Plan",
      "type": "basic",
      "price": 0,
      "currency": "USD",
      "features": ["Up to 5 shipments per month", "Basic tracking", "Email support"],
      "expires_at": "2024-12-31T23:59:59Z",
      "is_active": true
    }
  ]
}
```

### 22. Update Membership
- **URL**: `PUT /memberships/{id}`
- **Description**: Activate a membership plan
- **Headers**: `Authorization: Bearer {token}`
- **Success Response**:
```json
{
  "success": true,
  "data": {
    "id": 2,
    "name": "Premium Plan",
    "type": "premium",
    "price": 50.00,
    "currency": "USD",
    "features": ["Unlimited shipments", "Real-time tracking", "Priority support"],
    "expires_at": "2025-01-31T23:59:59Z",
    "is_active": true
  },
  "message": "Membership updated successfully"
}
```

## Search Endpoints

### 23. Search Shipments
- **URL**: `GET /search/shipments`
- **Description**: Search user's shipments
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `q`: Search query
- **Example**: `GET /search/shipments?q=UM1ZZ649`
- **Success Response**: Same structure as get shipments

### 24. Search Addresses
- **URL**: `GET /search/addresses`
- **Description**: Search user's addresses
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `q`: Search query
- **Success Response**: Same structure as get addresses

### 25. Search Transactions
- **URL**: `GET /search/transactions`
- **Description**: Search user's wallet transactions
- **Headers**: `Authorization: Bearer {token}`
- **Query Parameters**: 
  - `q`: Search query
- **Success Response**: Same structure as wallet transactions

## Error Responses

### Validation Error (422)
```json
{
  "success": false,
  "message": "The given data was invalid.",
  "errors": {
    "email": ["The email field is required."],
    "password": ["The password must be at least 8 characters."]
  }
}
```

### Authentication Error (401)
```json
{
  "success": false,
  "message": "Unauthenticated."
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "This action is unauthorized."
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Resource not found."
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error."
}
```

## Notes for Backend Implementation

1. **Country Filtering**: Most endpoints should support filtering by the selected country parameter. This is crucial for the multi-country functionality.

2. **Package Status Flow**: 
   - New packages start as "processing"
   - Move to "in_transit" when shipped
   - Become "arrived" when marked by admin
   - "arrived" packages should appear in archive, not in active packages

3. **Admin vs User Separation**: 
   - Admin endpoints are prefixed with `/admin/`
   - Admin authentication is separate from user authentication
   - Admin has access to all client data, users only see their own data

4. **Token Management**: 
   - Store admin tokens separately from user tokens
   - Implement proper token validation and expiration

5. **Search Functionality**: 
   - Implement full-text search across relevant fields
   - Support partial matches and case-insensitive search

6. **Validation**: 
   - Implement proper Laravel validation rules
   - Return structured error responses for form validation

7. **Insurance and Discounts**: 
   - Insurance cost should be calculated as 3.5% of the declared value
   - Discount codes should have usage limits and expiration dates
   - Prevent applying multiple discounts or insurance to the same package

8. **Pagination**: 
   - Consider implementing pagination for large datasets (clients, shipments, etc.)
   - Frontend can be updated to handle paginated responses if needed

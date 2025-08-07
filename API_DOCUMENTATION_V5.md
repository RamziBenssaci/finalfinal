# API Documentation Version 5 - Insurance Package Management

This document contains the API endpoints for the insurance package management functionality.

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

## Customer Endpoints

### Apply Insurance to Package
**POST** `/packages/{package_id}/insurance`

Apply insurance coverage to a specific package.

**Headers:**
```
Authorization: Bearer <user_token>
Content-Type: application/json
```

**Path Parameters:**
- `package_id`: Package ID (integer)

**Request Body:**
```json
{
  "insurance_value": 1500.00
}
```

**Response:**
```json
{
  "success": true,
  "message": "Insurance applied successfully",
  "data": {
    "id": 123,
    "package_id": 456,
    "insurance_value": 1500.00,
    "insurance_fee": 52.50,
    "fee_percentage": 3.5,
    "status": "active",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Package not found or already insured",
  "error_code": "PACKAGE_NOT_FOUND"
}
```

**Validation Rules:**
- `insurance_value`: Required, numeric, minimum: 1, maximum: 100000
- Package must exist and belong to the authenticated user
- Package cannot already have active insurance

---

## Admin Endpoints

### Get All Packages
**GET** `/admin/insured-packages`

Retrieve all packages for admin management (no specific insurance requirement).

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Packages retrieved successfully",
  "data": [
    {
      "user_id": 789,
      "tracking_number": "PKG-2024-001",
      "description": "Electronics - Laptop",
      "country": "Iraq",
      "origin_country": "USA",
      "destination_country": "Iraq", 
      "weight": 2.5,
      "status": "in_transit",
      "estimated_delivery": "2024-01-20T00:00:00Z",
      "shipping_method": "Express",
      "price": 1500.00,
      "client_name": "Ahmed Hassan"
    },
    {
      "user_id": 790,
      "tracking_number": "PKG-2024-002",
      "description": "Fashion Items",
      "country": "Iraq",
      "origin_country": "Turkey",
      "destination_country": "Iraq",
      "weight": 1.8,
      "status": "delivered",
      "estimated_delivery": "2024-01-18T00:00:00Z",
      "shipping_method": "Standard",
      "price": 800.00,
      "client_name": "Fatima Ali"
    }
  ]
}
```

### Process Insurance Claim
**PUT** `/admin/insured-packages/{id}/claim`

Process an insurance claim for a package.

**Headers:**
```
Authorization: Bearer <admin_token>
Content-Type: application/json
```

**Path Parameters:**
- `id`: Insurance record ID (integer)

**Request Body:**
```json
{
  "status": "approved",
  "claim_amount": 1500.00,
  "admin_notes": "Package was damaged during transit. Claim approved for full coverage amount."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Insurance claim processed successfully",
  "data": {
    "id": 123,
    "package_id": 456,
    "status": "approved",
    "claim_amount": 1500.00,
    "claim_approved_at": "2024-01-22T10:30:00Z",
    "admin_notes": "Package was damaged during transit. Claim approved for full coverage amount.",
    "updated_at": "2024-01-22T10:30:00Z"
  }
}
```

**Validation Rules:**
- `status`: Required, must be one of: `approved`, `rejected`, `pending`
- `claim_amount`: Required if status is `approved`, must not exceed insurance_value
- `admin_notes`: Optional, string, max 1000 characters

### Get Insurance Statistics
**GET** `/admin/insurance/statistics`

Get comprehensive insurance statistics for reporting.

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Query Parameters:**
- `date_from` (optional): Start date for statistics (YYYY-MM-DD)
- `date_to` (optional): End date for statistics (YYYY-MM-DD)
- `group_by` (optional): Group statistics by (`day`, `week`, `month`) (default: month)

**Response:**
```json
{
  "success": true,
  "message": "Insurance statistics retrieved successfully",
  "data": {
    "overview": {
      "total_insured_packages": 87,
      "total_insured_value": 125000.00,
      "total_fees_collected": 4375.00,
      "average_insurance_value": 1436.78,
      "claim_rate_percentage": 11.49
    },
    "by_status": {
      "active": 75,
      "claimed": 10,
      "expired": 2
    },
    "by_shipping_method": {
      "Express": {
        "count": 45,
        "total_value": 78000.00,
        "total_fees": 2730.00
      },
      "Standard": {
        "count": 42,
        "total_value": 47000.00,
        "total_fees": 1645.00
      }
    },
    "timeline": [
      {
        "period": "2024-01",
        "packages_insured": 25,
        "total_value": 35000.00,
        "fees_collected": 1225.00,
        "claims_processed": 2
      },
      {
        "period": "2024-02",
        "packages_insured": 30,
        "total_value": 42000.00,
        "fees_collected": 1470.00,
        "claims_processed": 3
      }
    ]
  }
}
```

---

## Database Schema

### Insurance Table
```sql
CREATE TABLE package_insurance (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    package_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    insurance_value DECIMAL(10,2) NOT NULL,
    insurance_fee DECIMAL(10,2) NOT NULL,
    fee_percentage DECIMAL(5,2) NOT NULL DEFAULT 3.50,
    status ENUM('active', 'claimed', 'expired') DEFAULT 'active',
    claim_submitted_at TIMESTAMP NULL,
    claim_approved_at TIMESTAMP NULL,
    claim_rejected_at TIMESTAMP NULL,
    claim_amount DECIMAL(10,2) NULL,
    admin_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_package_insurance (package_id)
);
```

### Insurance Claims Table
```sql
CREATE TABLE insurance_claims (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    insurance_id BIGINT NOT NULL,
    claim_reason TEXT NOT NULL,
    evidence_urls JSON NULL,
    submitted_by BIGINT NOT NULL,
    status ENUM('pending', 'under_review', 'approved', 'rejected') DEFAULT 'pending',
    reviewed_by BIGINT NULL,
    reviewed_at TIMESTAMP NULL,
    claim_amount DECIMAL(10,2) NULL,
    admin_notes TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (insurance_id) REFERENCES package_insurance(id) ON DELETE CASCADE,
    FOREIGN KEY (submitted_by) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reviewed_by) REFERENCES admin_users(id) ON DELETE SET NULL
);
```

---

## Error Codes

| Code | Description |
|------|-------------|
| `UNAUTHORIZED` | Invalid or missing authentication token |
| `FORBIDDEN` | Insufficient permissions |
| `PACKAGE_NOT_FOUND` | The specified package does not exist |
| `PACKAGE_ALREADY_INSURED` | Package already has active insurance |
| `INSURANCE_NOT_FOUND` | The specified insurance record does not exist |
| `INVALID_CLAIM_STATUS` | Invalid claim status provided |
| `CLAIM_AMOUNT_EXCEEDS_COVERAGE` | Claim amount exceeds insurance coverage |
| `VALIDATION_ERROR` | Invalid request data |
| `SERVER_ERROR` | Internal server error |

---

## Business Rules

1. **Insurance Fee Calculation**: Insurance fee is calculated as 3.5% of the declared insurance value
2. **Maximum Coverage**: Maximum insurance value per package is $100,000
3. **Minimum Coverage**: Minimum insurance value per package is $1
4. **One Insurance Per Package**: Each package can only have one active insurance policy
5. **Claim Processing**: Claims can only be processed by admin users
6. **Automatic Expiry**: Insurance automatically expires 90 days after package delivery
7. **Refund Policy**: Insurance fees are non-refundable once applied

---

## Rate Limiting

- Customer insurance applications: 10 requests per minute per user
- Admin insurance management: 100 requests per minute per admin
- Statistics endpoints: 20 requests per minute per admin

---

## Integration Notes

### Frontend Integration
```javascript
// Apply insurance to package
const applyInsurance = async (packageId, insuranceValue) => {
  const response = await fetch(`/api/packages/${packageId}/insurance`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      insurance_value: insuranceValue
    })
  });
  return response.json();
};

// Get insured packages (Admin)
const getInsuredPackages = async (filters = {}) => {
  const params = new URLSearchParams(filters);
  const response = await fetch(`/api/admin/insured-packages?${params}`, {
    headers: {
      'Authorization': `Bearer ${adminToken}`
    }
  });
  return response.json();
};
```

### Webhook Integration
Consider implementing webhooks for insurance-related events:
- Insurance application confirmation
- Claim submission notification
- Claim approval/rejection notification
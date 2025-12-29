# API Documentation Summary

## Base URL
- **Development**: `http://localhost:8000/api/v1`
- **Production**: `https://your-domain.com/api/v1`

## Authentication
All authenticated endpoints require a JWT token in either:
1. Authorization header: `Bearer <token>`
2. Cookie: `token=<token>`

## Error Response Format
```json
{
  "success": false,
  "status": 400,
  "message": "Error description"
}
```

## Success Response Format
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... }
}
```

---

## Authentication & User Management

### POST /auth/signup
Register a new user (client or vendor).

**Body**:
```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phoneNumber": "+2348012345678",
  "schoolName": "Example University",
  "password": "SecurePass123!",
  "role": "client|vendor",
  "businessName": "My Business" // Required if role is "vendor"
}
```

### POST /auth/login
Authenticate a user.

**Body**:
```json
{
  "email": "john@example.com", // OR username OR schoolId
  "password": "SecurePass123!"
}
```

### POST /auth/google
Google OAuth authentication.

**Body**:
```json
{
  "token": "google_oauth_token"
}
```

### POST /auth/complete-registration
Complete profile after Google auth (protected route).

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "role": "client|vendor",
  "username": "johndoe",
  "phoneNumber": "+2348012345678",
  "schoolName": "Example University",
  "whatsAppNumber": "+2348012345678",
  "businessName": "My Business", // If vendor
  "password": "SecurePass123!",
  "state": "Lagos",
  "country": "Nigeria",
  "area": "Yaba"
}
```

### GET /auth/check
Check authentication status (protected route).

**Headers**: `Authorization: Bearer <token>`

### POST /auth/logout
Logout user.

### PUT /auth/update
Update user profile (protected route).

**Headers**: `Authorization: Bearer <token>`

**Body** (any fields to update):
```json
{
  "fullName": "Updated Name",
  "phoneNumber": "+2348012345678",
  "schoolName": "New School",
  "state": "Lagos",
  "area": "Ikeja"
}
```

---

## Vendor Operations

### POST /post/create
Create a new product post (protected, vendor only).

**Headers**: `Authorization: Bearer <token>`

**Body**:
```json
{
  "caption": "Check out my products!",
  "products": [
    {
      "title": "Product Name",
      "description": "Product description",
      "price": 5000,
      "category": "Electronics",
      "image": "https://...",
      "condition": "New"
    }
  ],
  "school": "Example University",
  "location": "Under G",
  "state": "Lagos",
  "area": "Yaba"
}
```

### GET /post/my-posts
Get vendor's own posts (protected).

### GET /post/feed
Get product feed with filters.

**Query Parameters**:
- `school` - Filter by school
- `area` - Filter by area
- `search` - Search products
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10, max: 50)

### GET /post/:postId
Get a specific post.

### PUT /post/:postId
Update a post (protected, vendor only).

### DELETE /post/:postId
Delete a post (protected, vendor only).

### GET /post/search
Search products with boosted results.

**Query Parameters**:
- `search` - Search term
- `school` - Filter by school
- `area` - Filter by area
- `page` - Page number
- `limit` - Items per page (max: 50)

### GET /post/fresh
Get fresh products from unique vendors.

**Query Parameters**:
- `limit` - Number of products (max: 20)

### GET /post/trending
Get trending products based on ratings and likes.

**Query Parameters**:
- `limit` - Number of products (max: 20)

---

## Cart Operations

### GET /cart
Get user's cart (protected).

### POST /cart/add
Add item to cart (protected).

**Body**:
```json
{
  "productId": "product_object_id",
  "vendorPostId": "post_object_id",
  "quantity": 2
}
```

### PUT /cart/update
Update item quantity (protected).

**Body**:
```json
{
  "productId": "product_object_id",
  "quantity": 5
}
```

### DELETE /cart/remove
Remove item from cart (protected).

**Body**:
```json
{
  "productId": "product_object_id"
}
```

### DELETE /cart/clear
Clear entire cart (protected).

---

## Payment & Orders

### POST /payment/initialize
Initialize subscription payment (protected).

**Body**:
```json
{
  "planSlug": "boost|pro|max"
}
```

### POST /payment/initialize-order
Initialize order payment (protected).

**Body**:
```json
{
  "cartItems": [
    {
      "productId": "...",
      "quantity": 2
    }
  ],
  "deliveryAddress": {
    "address": "123 Main St",
    "city": "Lagos",
    "state": "Lagos",
    "phone": "+2348012345678"
  }
}
```

### GET /payment/verify
Verify payment status.

**Query Parameters**:
- `reference` - Transaction reference

### POST /payment/webhook
Paystack webhook endpoint (public, signature verified).

### POST /payment/subaccount
Create vendor subaccount (protected, vendor only).

**Body**:
```json
{
  "business_name": "My Business",
  "settlement_bank": "058", // Bank code
  "account_number": "0123456789",
  "percentage_charge": 5
}
```

### GET /payment/banks
Get list of Nigerian banks.

### GET /payment/resolve-account
Resolve account number to get account name.

**Query Parameters**:
- `account_number` - Account number
- `bank_code` - Bank code

---

## Orders

### GET /orders/my-orders
Get user's orders (protected).

**Query Parameters**:
- `role` - "vendor" or "client" (determines buyer vs vendor perspective)

### PUT /orders/:orderId/delivered
Mark order as delivered (protected, buyer only).

---

## Reviews

### POST /reviews
Create a review (protected).

**Body**:
```json
{
  "orderId": "order_object_id",
  "vendorId": "vendor_profile_id",
  "rating": 5,
  "comment": "Great service!"
}
```

### GET /reviews/vendor/:vendorId
Get all reviews for a vendor.

---

## Location Services

### GET /locations/schools
Get list of schools.

### GET /locations/areas
Get areas by state.

**Query Parameters**:
- `state` - State name

---

## Rate Limits

- **Default**: 100 requests per 15 minutes
- **Development**: 1000 requests per 15 minutes

Exceeding limits returns:
```json
{
  "statusCode": 429,
  "message": "Too many requests, please try again later"
}
```

---

## Common Status Codes

- `200` - Success
- `201` - Created
- `204` - No Content
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

---

## Security Notes

1. **CSRF Protection**: Include `X-Requested-With: XMLHttpRequest` header or use `Content-Type: application/json`
2. **CORS**: Only configured origins can make requests
3. **Input Sanitization**: All inputs are automatically sanitized
4. **Rate Limiting**: Applies to all endpoints
5. **Authentication**: Most endpoints require valid JWT token

---

## Testing

### Health Check (Not Documented in Routes)
You can verify the server is running by checking if it responds to any valid route.

### Example cURL Commands

**Login**:
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"Password123!"}'
```

**Get Products**:
```bash
curl -X GET http://localhost:8000/api/v1/post/feed?school=Example%20University
```

**Create Post** (requires auth):
```bash
curl -X POST http://localhost:8000/api/v1/post/create \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"caption":"New products!","products":[...],"school":"Example Uni","location":"Under G"}'
```

---

## Support

For API issues or questions, please contact the development team.

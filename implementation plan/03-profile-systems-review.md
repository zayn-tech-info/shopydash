# Profile Systems - Implementation Review

## Overview

Review of client and vendor profile management systems including models, controllers, and routes.

---

## Client Profile System

### Model (clientProfile.model.js)

**Location**: `backend/models/clientProfile.model.js`

#### Purpose

Extended profile information for client users, separate from core auth data.

#### Schema Fields

**User Reference**:

- **userId**: ObjectId (ref to User, required, unique)

**Personal Information**:

- **fullName**: String (2-100 chars)
- **username**: String (unique, lowercase)
- **phoneNumber**: String (validated, 7-24 chars)

**Location Information**:

- **address**: String (max 300 chars)
- **city**: String (max 100 chars)
- **state**: String (max 100 chars)
- **country**: String (max 100 chars, default: "Nigeria")
- **schoolName**: String

**Profile & Preferences**:

- **profileImage**: String (URL)
- **preferredCategory**: String

**Wishlist System**:

- **wishlist**: Array of objects
  - `itemId`: ObjectId (ref to Product)
  - `addedAt`: Date (default: now)

**Timestamps**:

- **lastLogin**: Date
- **createdAt**: Date (default: now)

#### Validations

- Phone number regex: `/^[0-9+()-\s]{7,24}$/`
- Length constraints on all string fields

**Status**: ✅ **Production-ready**

---

### Controller (clientProfile.controller.js)

**Location**: `backend/controllers/clientProfile.controller.js`

#### Endpoints

##### 1. `createClientProfile` - POST /clientProfile/create

**Purpose**: Create new client profile (one per user)

**Authentication**: Required (client role)

**Flow**:

1. Extract userId from `req.user._id`
2. Check for existing profile
3. If exists → 400 Error "Profile already exist"
4. Merge request body with userId
5. Create ClientProfile document
6. Return 201 Created

**Request Body**:

```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "phoneNumber": "+234XXXXXXXXXX",
  "address": "123 Main St",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "schoolName": "University of Lagos",
  "profileImage": "https://example.com/profile.jpg",
  "preferredCategory": "Electronics"
}
```

**Response**: 201 Created with clientProfile data

---

##### 2. `getClientProfile` - GET /clientProfile/

**Purpose**: Get authenticated client's profile

**Authentication**: Required (client role)

**Flow**:

1. Extract userId from `req.user._id`
2. Find ClientProfile by userId
3. If not found → 404 Error "Profile not found"
4. Return profile data

**Response**: 200 OK with clientProfile data

---

##### 3. `updateClientProfile` - PATCH /clientProfile/

**Purpose**: Update client profile

**Authentication**: Required (client role)

**Flow**:

1. Extract userId from `req.user._id`
2. Find existing profile
3. If not found → 404 Error "Profile not found"
4. Update profile with `$set` and request body
5. Run validators on update
6. Return updated profile

**Request Body** (partial update allowed):

```json
{
  "phoneNumber": "+234XXXXXXXXXX",
  "address": "New address",
  "preferredCategory": "Fashion"
}
```

**Response**: 200 OK with updatedClientProfile data

**Status**: ✅ **Production-ready**

---

### Routes (clientProfile.route.js)

**Location**: `backend/routes/clientProfile.route.js`

```javascript
POST   /api/v1/clientProfile/create    → createClientProfile (protected, client only)
GET    /api/v1/clientProfile/           → getClientProfile (protected, client only)
PATCH  /api/v1/clientProfile/           → updateClientProfile (protected, client only)
```

**Middleware Chain**:

1. `protectRoute` - Verify JWT and attach user
2. `verifyRole("client")` - Ensure user is a client
3. Controller function

**Status**: ✅ **All routes properly protected**

---

## Vendor Profile System

### Model (vendorProfile.model.js)

**Location**: `backend/models/vendorProfile.model.js`

#### Purpose

Extended profile information for vendor users with business details, store management, and metrics.

#### Schema Fields

**User Reference**:

- **userId**: ObjectId (ref to User, required)

**Business Identity**:

- **businessName**: String (unique, sparse)
- **storeUsername**: String (unique, lowercase, sparse) - for public storefront URL
- **storeDescription**: String
- **businessCategory**: String

**Contact Information**:

- **phoneNumber**: String (unique)
- **whatsAppNumber**: String (unique, sparse)
- **email**: String (unique, sparse, validated)

**Branding**:

- **profileImage**: String (URL)
- **coverImage**: String (URL)

**Location Information**:

- **address**: String
- **city**: String
- **state**: String
- **country**: String
- **schoolName**: String

**Online Presence**:

- **website**: String (lowercase)
- **socialLinks**: Object
  - `instagram`: String
  - `facebook`: String
  - `twitter`: String

**Verification & Status**:

- **isVerified**: Boolean (default: false) - admin verification
- **status**: String (default: "active")

**Business Metrics**:

- **rating**: Number (default: 0)
- **totalSales**: Number (default: 0)

**References**:

- **reviews**: ObjectId (ref to Review)
- **products**: Array of ObjectIds (ref to Product)

**Payment Information**:

- **accountNumber**: String
- **paymentMethods**: Array of Strings (validated enum)
  - Allowed: "bank_transfer", "paystack", "credit_card"

**Timestamps**:

- **createdAt**: Date (auto)
- **updatedAt**: Date (auto)

#### Validations

- Email validation using validator.js
- Payment methods enum validation
- Unique constraints on businessName, storeUsername, phoneNumber, whatsAppNumber, email

**Note**: There's duplicate field definitions (address, city, state, country appear twice) - should be cleaned up.

**Status**: ✅ **Production-ready** (minor cleanup needed)

---

### Controller (vendorProfile.controller.js)

**Location**: `backend/controllers/vendorProfile.controller.js`

#### Endpoints

##### 1. `createVendorProfile` - POST /vendorProfile/create

**Purpose**: Create new vendor profile (one per user)

**Authentication**: Required (vendor role)

**Flow**:

1. Extract userId from `req.user._id`
2. Check for existing profile
3. If exists → 409 Error "Vendor profile already exists"
4. Merge request body with userId
5. Create VendorProfile document
6. Return 201 Created

**Request Body**:

```json
{
  "businessName": "Tech Store",
  "storeUsername": "techstore_unilag",
  "storeDescription": "Your one-stop tech shop",
  "businessCategory": "Electronics",
  "phoneNumber": "+234XXXXXXXXXX",
  "whatsAppNumber": "+234XXXXXXXXXX",
  "email": "store@example.com",
  "profileImage": "https://example.com/logo.jpg",
  "coverImage": "https://example.com/cover.jpg",
  "address": "123 Business St",
  "city": "Lagos",
  "state": "Lagos",
  "country": "Nigeria",
  "schoolName": "University of Lagos",
  "website": "https://techstore.com",
  "accountNumber": "1234567890",
  "paymentMethods": ["bank_transfer", "paystack"],
  "socialLinks": {
    "instagram": "@techstore",
    "facebook": "TechStore",
    "twitter": "@techstore"
  }
}
```

**Response**: 201 Created with vendorProfile data

---

##### 2. `getVendorProfile` - GET /vendorProfile/

**Purpose**: Get authenticated vendor's profile

**Authentication**: Required (vendor role)

**Flow**:

1. Extract userId from `req.user._id`
2. Find VendorProfile by userId
3. If not found → 404 Error "Vendor profile not found"
4. Return profile data

**Response**: 200 OK with vendorProfile data

---

##### 3. `getPublicVendorProfile` - GET /vendorProfile/public/:storeUsername

**Purpose**: Get vendor profile by storeUsername (public access for storefront)

**Authentication**: None (public endpoint)

**Parameters**:

- `storeUsername`: Vendor's unique store username

**Flow**:

1. Extract storeUsername from route params
2. Validate storeUsername presence
3. Find VendorProfile by storeUsername
4. If not found → 404 Error "Vendor profile not found"
5. Return profile data (publicly accessible fields)

**Use Case**: Display vendor storefront to any user (clients browsing the marketplace)

**Response**: 200 OK with vendorProfile data

---

##### 4. `updateVendorProfile` - PATCH /vendorProfile/update

**Purpose**: Update vendor profile

**Authentication**: Required (vendor role)

**Flow**:

1. Extract userId from `req.user._id`
2. Remove userId and \_id from update payload (prevent modification)
3. Find and update profile with `$set`
4. Run validators
5. If not found → 404 Error "Profile not found"
6. Return updated profile

**Request Body** (partial update allowed):

```json
{
  "storeDescription": "Updated description",
  "phoneNumber": "+234XXXXXXXXXX",
  "paymentMethods": ["bank_transfer", "credit_card"]
}
```

**Response**: 200 OK with updated vendorProfile data

**Status**: ✅ **Production-ready**

---

### Routes (vendorProfle.route.js)

**Location**: `backend/routes/vendorProfle.route.js`

**Note**: Filename has typo ("Profle" instead of "Profile")

```javascript
POST   /api/v1/vendorProfile/create              → createVendorProfile (protected, vendor only)
GET    /api/v1/vendorProfile/                    → getVendorProfile (protected, vendor only)
PATCH  /api/v1/vendorProfile/update              → updateVendorProfile (protected, vendor only)
GET    /api/v1/vendorProfile/public/:storeUsername → getPublicVendorProfile (public)
```

**Middleware Chain** (Protected Routes):

1. `protectRoute` - Verify JWT and attach user
2. `verifyRole("vendor")` - Ensure user is a vendor
3. Controller function

**Status**: ✅ **All routes properly configured**

---

## Profile Data Flow

### Client Profile Creation Flow

```
1. User signs up as client
2. User logs in
3. Frontend checks hasProfile flag → false
4. Frontend redirects to /create-profile
5. User fills profile form
6. POST /api/v1/clientProfile/create
7. ClientProfile created
8. hasProfile becomes true
9. User can now access full application
```

### Vendor Profile Creation Flow

```
1. User signs up as vendor (provides businessName)
2. User logs in
3. Frontend checks hasProfile flag → false
4. Frontend redirects to /create-vendor-profile
5. User fills extended vendor profile form
6. POST /api/v1/vendorProfile/create
7. VendorProfile created with storeUsername
8. hasProfile becomes true
9. Vendor can now manage products and storefront
```

### Public Vendor Storefront Access

```
1. Any user (client/guest) browses marketplace
2. Clicks on a vendor's store
3. Frontend fetches GET /api/v1/vendorProfile/public/:storeUsername
4. Display vendor info (name, description, contact, etc.)
5. Fetch vendor's products (from products API - not yet implemented)
6. Display vendor storefront with products
```

---

## Key Differences: Client vs Vendor Profiles

| Feature                | Client Profile            | Vendor Profile                       |
| ---------------------- | ------------------------- | ------------------------------------ |
| **Purpose**            | Personal shopping profile | Business storefront                  |
| **Unique Identifier**  | username                  | storeUsername                        |
| **Public Access**      | No                        | Yes (public storefront)              |
| **Business Fields**    | No                        | Yes (businessName, businessCategory) |
| **Payment Info**       | No                        | Yes (accountNumber, paymentMethods)  |
| **Metrics**            | No                        | Yes (rating, totalSales)             |
| **Product Management** | Wishlist only             | Products array (references)          |
| **Social Links**       | No                        | Yes (Instagram, Facebook, Twitter)   |
| **Verification**       | No                        | Yes (isVerified by admin)            |

---

## Potential Enhancements

### Client Profile

- [ ] Order history tracking
- [ ] Saved addresses (multiple)
- [ ] Preferred payment methods
- [ ] Email notification preferences
- [ ] Browse history
- [ ] Product reviews written

### Vendor Profile

- [ ] Business hours
- [ ] Delivery options
- [ ] Return policy
- [ ] Multiple contact persons
- [ ] Bank account verification
- [ ] Tax/business registration info
- [ ] Analytics dashboard data
- [ ] Average response time metric
- [ ] Product categories sold
- [ ] Payout schedule

---

## Data Consistency

### Profile-User Relationship

**One-to-One Relationship**:

- Each User can have ONE ClientProfile OR ONE VendorProfile (never both)
- Profile type determined by User.role field
- userId field ensures uniqueness

### Synchronization Points

**Fields duplicated between User and Profile**:

- fullName (Client)
- username (Client)
- businessName (Vendor)
- phoneNumber (Both)
- schoolName (Both)

**Recommendation**: Consider using User model as single source of truth and reference it from profiles, or implement sync mechanism on updates.

---

## Testing Checklist

### Client Profile

- [x] Create client profile (authenticated client)
- [x] Create duplicate profile → 400 Error
- [x] Get own profile (authenticated client)
- [x] Update profile (authenticated client)
- [x] Try to create as vendor → 403 Error
- [x] Try to access without auth → 401 Error

### Vendor Profile

- [x] Create vendor profile (authenticated vendor)
- [x] Create duplicate profile → 409 Error
- [x] Get own profile (authenticated vendor)
- [x] Update profile (authenticated vendor)
- [x] Get public profile by storeUsername (no auth)
- [x] Try to create as client → 403 Error
- [x] Try to access private routes without auth → 401 Error
- [x] Try to get public profile with invalid storeUsername → 404 Error

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26

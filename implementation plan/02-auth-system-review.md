# Authentication System - Implementation Review

## Overview

Comprehensive review of the authentication system including the User model, auth controller, routes, and middleware.

---

## User Model (auth.model.js)

**Location**: `backend/models/auth.model.js`

### Purpose

Core user authentication and account management for all user types (clients, vendors, admins).

### Schema Fields

#### Required Fields

- **fullName**: String (2-100 chars, letters/spaces/hyphens/apostrophes only)
- **email**: String (unique, validated with validator.isEmail)
- **password**: String (8+ chars, must contain uppercase, lowercase, number, special char)
  - **Conditional**: Not required for Google auth users

#### User Identification

- **username**: String (unique, 3-30 chars, lowercase, letters/numbers/underscores)
- **schoolId**: String (unique, 4-20 chars, conditionally required for non-Google users)

#### Contact Information

- **phoneNumber**: String (validated format, unique)
- **whatsAppNumber**: String (validated format)
- **schoolEmail**: String (validated email format)

#### Profile Information

- **schoolName**: String
- **profilePic**: String (URL)
- **bio**: String

#### Role & Business

- **role**: Enum ["client", "vendor", "admin"] (default: "client")
- **businessName**: String (unique, sparse, 2-100 chars) - for vendors only

#### Authentication Flags

- **isGoogleAuth**: Boolean (default: false)
- **profileComplete**: Boolean (default: false)
- **passwordChangedAt**: Date

#### Branding (Vendors)

- **logo**: String (URL)

### Pre-Save Middleware

```javascript
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});
```

**Purpose**: Automatically hash password before saving if password field is modified.

### Instance Methods

#### 1. `comparePassword(userPassword)`

- Compare plain text password with hashed password
- Returns: Boolean
- Used during login

#### 2. `generateToken()`

- Creates JWT with user ID and role
- Expiration: 7 days
- Returns: JWT string

#### 3. `comparePasswordInDb(password)`

- Alternative password comparison method
- Throws error if no password is set (Google auth users)
- Returns: Boolean

#### 4. `isPasswordChanged(jwtTimeStamp)`

- Check if password was changed after JWT was issued
- Returns: Boolean
- Used for token invalidation after password change

### Validation Features

1. **Email Validation**: Using validator.js library
2. **Phone Number Regex**: Flexible international format
3. **Password Strength**: Multi-factor validation
4. **School ID Format**: Alphanumeric with hyphens/slashes
5. **Username Format**: Lowercase alphanumeric with underscores
6. **Unique Constraints**: email, username, schoolId, phoneNumber, businessName

**Status**: ✅ **Production-ready**

---

## Auth Controller (auth.controller.js)

**Location**: `backend/controllers/auth.controller.js`

### Endpoints

#### 1. `googleAuth` - POST /auth/google

**Purpose**: OAuth login/signup via Google

**Flow**:

1. Receive Google OAuth token from frontend
2. Fetch user info from Google API
3. Check if user exists by email
4. **If exists**:
   - Check for existing profile (ClientProfile or VendorProfile)
   - Return user with `hasProfile` flag
5. **If new user**:
   - Generate unique username (email prefix + 4-digit random number)
   - Create user with `isGoogleAuth: true, profileComplete: false`
   - Return user with `hasProfile: false`
6. Send JWT token via `sendToken` utility

**Request Body**:

```json
{
  "token": "google_oauth_token"
}
```

**Response**: 200/201 with user data and JWT cookie

---

#### 2. `signup` - POST /auth/signup

**Purpose**: Register new user (client or vendor)

**Validation**:

- **Client**: fullName, username, email, phoneNumber, schoolName, password required
- **Vendor**: All client fields + businessName required
- Check for existing user by email
- All password and field validations from User schema

**Request Body**:

```json
{
  "fullName": "John Doe",
  "username": "johndoe",
  "email": "john@example.com",
  "phoneNumber": "+234XXXXXXXXXX",
  "schoolName": "University of Lagos",
  "password": "SecurePass123!",
  "role": "client",
  "businessName": "Only for vendors"
}
```

**Logic**:

- Set `profileComplete: true` on creation
- Hash password via pre-save middleware
- Generate JWT and send response

**Response**: 201 Created with user data and JWT cookie

---

#### 3. `login` - POST /auth/login

**Purpose**: Login with email/username/schoolId + password

**Multi-Identifier Support**:

- Accepts email, username, or schoolId as identifier
- Auto-detects identifier type:
  - Pure numeric → schoolId
  - Contains @ → email
  - Otherwise → username

**Request Body**:

```json
{
  "email": "john@example.com", // OR username OR schoolId
  "password": "SecurePass123!"
}
```

**Flow**:

1. Validate identifier and password presence
2. Detect identifier type
3. Find user in database
4. Compare password
5. Check for existing profile (ClientProfile or VendorProfile)
6. Return user with `hasProfile` flag
7. Send JWT token

**Response**: 200 OK with user data and JWT cookie

---

#### 4. `logout` - POST /auth/logout

**Purpose**: Clear authentication cookie

**Logic**:

- Set cookie "token" to empty string
- Set maxAge to 0 (immediate expiration)
- Adjust secure/sameSite based on environment

**Response**: 200 OK with success message

---

#### 5. `checkAuth` - GET /auth/check (Protected)

**Purpose**: Verify current authentication status

**Middleware**: `protectRoute` (attaches `req.user`)

**Flow**:

1. Verify user is authenticated
2. Check for existing profile based on role
3. Return user object with `hasProfile` flag

**Response**: 200 OK with user data

---

#### 6. `completeRegistration` - POST /auth/complete-registration (Protected)

**Purpose**: Complete Google user profile setup

**Use Case**: Google auth users must complete registration by providing additional required fields

**Request Body**:

```json
{
  "role": "client",
  "phoneNumber": "+234XXXXXXXXXX",
  "schoolName": "University of Lagos",
  "whatsAppNumber": "+234XXXXXXXXXX",
  "password": "SecurePass123!",
  "schoolId": "12345",
  "businessName": "Only for vendors"
}
```

**Validation**:

- role, phoneNumber, schoolName, whatsAppNumber, password required
- businessName required if role is "vendor"

**Logic**:

1. Find authenticated user
2. Update user fields
3. Hash password (via pre-save middleware)
4. Set `profileComplete: true`
5. Return updated user with `hasProfile: false`

**Response**: 200 OK with updated user data

---

## Auth Routes (auth.route.js)

**Location**: `backend/routes/auth.route.js`

### Route Registration

```javascript
POST   /api/v1/auth/signup                    → signup
POST   /api/v1/auth/login                     → login
POST   /api/v1/auth/logout                    → logout
GET    /api/v1/auth/check                     → checkAuth (protected)
POST   /api/v1/auth/google                    → googleAuth
POST   /api/v1/auth/complete-registration     → completeRegistration (protected)
```

**Status**: ✅ **All routes properly configured**

---

## Auth Middleware (auth.middleware.js)

**Location**: `backend/middleware/auth.middleware.js`

### 1. `protectRoute`

**Purpose**: Verify JWT and attach user to request

**Flow**:

1. Extract token from:
   - `Authorization: Bearer <token>` header, OR
   - `req.cookies.token`
2. If no token → 401 Unauthorized
3. Verify token signature and expiration
4. Load user from database by decoded ID
5. If user not found → 404 Not Found
6. Check if password changed after token issued → 401 if changed
7. Attach user to `req.user`
8. Call `next()`

**Usage**: Apply to any protected route

---

### 2. `verifyRole(...allowedRoles)`

**Purpose**: Restrict access by user role

**Parameters**: Variable number of allowed roles (e.g., "vendor", "admin")

**Flow**:

1. Check if `req.user` exists
2. Check if `req.user.role` is in allowedRoles array
3. If not allowed → 403 Access Denied
4. Call `next()`

**Usage Example**:

```javascript
router.post("/create", protectRoute, verifyRole("vendor"), createVendorProfile);
```

**Status**: ✅ **Production-ready**

---

## Token Utility (sendToken.js)

**Location**: `backend/utils/sendToken.js`

### Function Signature

```javascript
sendToken(user, message, res, statusCode, (hasProfile = undefined));
```

### Parameters

- **user**: User object (Mongoose document)
- **message**: Success message string
- **res**: Express response object
- **statusCode**: HTTP status code (200, 201, etc.)
- **hasProfile**: Optional boolean flag for profile existence

### Features

1. **JWT Generation**: Calls `user.generateToken()`
2. **Cookie Settings**:
   - Name: "token"
   - HttpOnly: true (prevents JavaScript access)
   - Secure: true in production (HTTPS only)
   - MaxAge: 7 days
   - SameSite: "none" in production, "lax" in development
3. **Response Format**:
   ```json
   {
     "success": true,
     "token": "jwt_string",
     "message": "Success message",
     "data": {
       "user": {
         // user object with hasProfile if provided
       }
     }
   }
   ```

**Status**: ✅ **Production-ready**

---

## Security Features

### Implemented Protections

1. ✅ **Password Hashing**: bcrypt with 10 salt rounds
2. ✅ **JWT Expiration**: 7-day token lifetime
3. ✅ **HTTP-Only Cookies**: Token not accessible via JavaScript
4. ✅ **Secure Cookies**: HTTPS-only in production
5. ✅ **Password Change Invalidation**: Tokens invalidated after password change
6. ✅ **Role-Based Access Control**: Middleware for role verification
7. ✅ **Input Validation**: Comprehensive schema validation
8. ✅ **Unique Constraints**: Prevent duplicate accounts

### Potential Enhancements

- [ ] Rate limiting for login attempts
- [ ] Email verification flow
- [ ] Refresh token system
- [ ] Two-factor authentication (2FA)
- [ ] Password reset flow
- [ ] Account lockout after failed attempts

---

## Key Workflows

### Workflow 1: Standard Signup & Login

```
User →  Signup with credentials
     →  User created with profileComplete: true
     →  JWT cookie set
     →  Redirect to create profile page
     →  Create ClientProfile or VendorProfile
     →  Login shows hasProfile: true
```

### Workflow 2: Google OAuth

```
User →  Click "Sign in with Google"
     →  Frontend gets Google OAuth token
     →  Send to /auth/google
     →  Check if email exists

     IF NEW USER:
        →  Create user (isGoogleAuth: true, profileComplete: false)
        →  Return hasProfile: false
        →  Redirect to /complete-registration
        →  Complete registration with required fields
        →  Redirect to create profile

     IF EXISTING USER:
        →  Check for profile
        →  Return hasProfile: true/false
        →  Redirect accordingly
```

### Workflow 3: Protected Route Access

```
Request →  Include JWT in cookie or Authorization header
        →  protectRoute middleware
        →  Verify JWT signature
        →  Load user from DB
        →  Check password change timestamp
        →  Attach req.user
        →  verifyRole middleware (if applicable)
        →  Route handler executes
```

---

## Testing Checklist

### Manual Testing

- [x] Signup as client with valid data
- [x] Signup as vendor with valid data
- [x] Login with email
- [x] Login with username
- [x] Login with schoolId
- [x] Google OAuth signup (new user)
- [x] Google OAuth login (existing user)
- [x] Complete registration after Google signup
- [x] Logout
- [x] Check auth (authenticated)
- [x] Check auth (unauthenticated) → 401
- [x] Access protected route without token → 401
- [x] Access vendor route as client → 403

### Error Cases

- [x] Signup with duplicate email → 400
- [x] Signup with duplicate username → 400
- [x] Signup with weak password → 400
- [x] Login with wrong password → 401
- [x] Login with non-existent email → 401
- [x] Access route with expired token → 401
- [x] Access route with invalid token → 401

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26

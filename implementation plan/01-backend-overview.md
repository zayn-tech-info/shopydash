# Backend Overview & Project Structure

## Overview

This document provides a high-level overview of the Vendora backend application architecture.

---

## Project Structure

```
backend/
├── config/          # Database configuration
├── controllers/     # Business logic (3 controllers)
├── errors/          # Custom error handling
├── middleware/      # Authentication & authorization
├── models/          # Database schemas (4 models)
├── routes/          # API endpoints (3 route files)
├── utils/           # Helper utilities
├── app.js           # Express app setup
└── server.js        # Server entry point
```

---

## Technology Stack

- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcrypt.js
- **Validation**: Mongoose validators + validator.js
- **Error Handling**: Custom error classes + global error handler
- **Cookie Management**: cookie-parser

---

## Application Setup

### [app.js](file:///c:/projects/Vendora/backend/app.js)

**Configuration**:

- **CORS**: Configured for frontend origin
  - Development: `http://localhost:5173`
  - Production: `https://vendora-app-rho.vercel.app`
- **Middleware Stack**:
  - `cors()` - with credentials support
  - `cookieParser()` - for JWT cookie handling
  - `express.json()` - for JSON request parsing
- **Registered Routes**:
  - `/api/v1/auth` - Authentication endpoints
  - `/api/v1/vendorProfile` - Vendor profile management
  - `/api/v1/clientProfile` - Client profile management
- **Error Handling**:
  - 404 handler for undefined routes
  - Global error handler middleware

**Status**: ✅ **Production-ready**

---

## API Structure

### Current Endpoints

```
/api/v1/auth
  POST   /signup
  POST   /login
  POST   /logout
  GET    /check (protected)
  POST   /google
  POST   /complete-registration (protected)

/api/v1/vendorProfile
  POST   /create (protected, vendor only)
  GET    / (protected, vendor only)
  PATCH  /update (protected, vendor only)
  GET    /public/:storeUsername (public)

/api/v1/clientProfile
  POST   /create (protected, client only)
  GET    / (protected, client only)
  PATCH  / (protected, client only)
```

---

## Environment Variables

Required environment variables:

- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET_KEY` - Secret for JWT signing
- `NODE_ENV` - Environment mode (development/production)
- `PORT` - Server port (default: 3000)

---

## Security Features

1. **HTTP-Only Cookies**: JWT stored in HTTP-only cookies
2. **CORS Protection**: Restricted to known frontend origins
3. **Password Hashing**: bcrypt with 10 salt rounds
4. **JWT Expiration**: 7-day token expiration
5. **Role-Based Access**: Middleware for role verification
6. **Input Validation**: Schema-level validation for all user inputs

---

## Database Connection

- Connection managed through `config/db.js`
- Mongoose ODM for schema modeling
- Auto-reconnect on connection loss
- Connection pooling enabled

---

## Next Steps

1. ✅ Authentication system
2. ✅ Profile management (client & vendor)
3. ⏳ Product management system (vendor products)
4. ⏳ Order/transaction system
5. ⏳ Review/rating system
6. ⏳ Messaging system
7. ⏳ Admin dashboard

---

**Document Version**: 1.0  
**Last Updated**: 2025-11-26

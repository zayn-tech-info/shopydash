# Shopydash - Project Overview for Code Review

## Project Summary

**Shopydash** is an e-commerce marketplace platform connecting vendors and clients, with real-time chat capabilities. It's a **monorepo** with separate frontend and backend applications.

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│           Frontend (2 React Apps)                   │
│  ├── app/    → Main dashboard (vendors/clients)     │
│  └── web/    → Landing page/marketing               │
└───────────────────────┬─────────────────────────────┘
                        │ Axios + Socket.IO
                        ↓
┌─────────────────────────────────────────────────────┐
│           Backend (Express.js + Socket.IO)          │
│  11 Routes → 11 Controllers → 13 MongoDB Models     │
└───────────────────────┬─────────────────────────────┘
                        │ Mongoose ODM
                        ↓
┌─────────────────────────────────────────────────────┐
│                    MongoDB                          │
└─────────────────────────────────────────────────────┘
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend Framework** | React 19.1.1 + Vite 7.1.7 |
| **State Management** | Zustand (10 stores) |
| **UI/Styling** | Tailwind CSS + Material-UI + Framer Motion |
| **Backend** | Node.js + Express 5.1.0 |
| **Database** | MongoDB + Mongoose 8.19.2 |
| **Real-time** | Socket.IO 4.8.3 |
| **Auth** | JWT + Google OAuth |
| **Payments** | Paystack |
| **File Storage** | Cloudinary |
| **Deployment** | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
shopydash/
├── backend/
│   ├── config/          # DB configuration
│   ├── controllers/     # 11 controller modules
│   │   ├── auth/        # Authentication
│   │   ├── cart/        # Shopping cart
│   │   ├── client/      # Client profiles
│   │   ├── vendor/      # Vendor products/profiles
│   │   └── *.js         # Orders, payments, messages, reviews
│   ├── models/          # 13 Mongoose schemas
│   ├── routes/          # 11 API route files
│   ├── middleware/      # 7 middleware modules
│   │   ├── auth, csrf, rateLimiter, sanitize
│   │   ├── security, socketAuth, subscription
│   ├── errors/          # Error handling
│   ├── utils/           # Utilities
│   ├── app.js           # Express setup (85 lines)
│   └── server.js        # Entry point + Socket.IO (219 lines)
│
├── frontend/
│   ├── app/             # Main application
│   │   ├── src/
│   │   │   ├── components/   # 56 React components
│   │   │   ├── pages/        # 22 page components
│   │   │   ├── store/        # 10 Zustand stores
│   │   │   ├── lib/          # Axios + Socket.IO config
│   │   │   └── App.jsx       # Router (162 lines)
│   │   └── vite.config.js
│   │
│   └── web/             # Landing page (simpler)
│       └── src/
│
├── vercel.json          # Deployment config
└── implementation plan/ # Documentation
```

---

## Key Features

| Feature | Implementation |
|---------|----------------|
| **User Roles** | Client (buyer) + Vendor (seller) |
| **Authentication** | JWT (7-day exp) + Google OAuth |
| **Products** | Vendor product catalog with images (Cloudinary) |
| **Cart & Checkout** | Persistent cart + Paystack payments |
| **Orders** | Order lifecycle management |
| **Messaging** | Real-time chat via Socket.IO |
| **Reviews** | Product ratings & reviews |
| **Subscriptions** | Vendor subscription tiers |

---

## API Routes (`/api/v1`)

| Route | Purpose |
|-------|---------|
| `/auth` | Login, signup, logout, token refresh |
| `/vendorProfile` | Vendor business profiles |
| `/clientProfile` | Client profiles |
| `/profile` | General profile ops |
| `/post` | Vendor products |
| `/cart` | Cart CRUD |
| `/locations` | Areas/locations |
| `/payment` | Paystack integration |
| `/orders` | Order management |
| `/reviews` | Product reviews |
| `/messages` | Chat messages |

---

## Security Measures Implemented

1. **CSRF Protection** - Custom middleware validating origin/referer
2. **XSS Prevention** - `isomorphic-dompurify` + security headers
3. **NoSQL Injection** - Sanitization of `$` operators
4. **Rate Limiting** - 100 req/15min (API), 30 msg/60s (Socket)
5. **JWT Auth** - HttpOnly cookies, password change invalidation
6. **Payment Security** - Paystack webhook HMAC validation
7. **Socket Auth** - Token-based authentication

---

## Database Models (13)

- `auth` - User accounts
- `clientProfile` / `vendorProfile` - Role-specific profiles
- `vendorProduct` - Products
- `cart` - Shopping cart
- `order` - Orders
- `transaction` - Payments
- `message` / `conversation` - Chat
- `review` - Product reviews
- `subscription` - Vendor plans
- `school` / `schoolArea` - Location data

---

## Entry Points

| File | Purpose |
|------|---------|
| `backend/server.js` | HTTP + Socket.IO server (port 8000) |
| `frontend/app/src/main.jsx` | Main React app |
| `frontend/web/src/main.jsx` | Landing page |

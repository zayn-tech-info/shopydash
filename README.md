# Shopydash Platform Documentation

## Overview
Shopydash is a campus-focused e-commerce platform enabling students to buy and sell products, manage shops, and interact securely. The platform supports both client (buyer) and vendor (seller) roles, with advanced features unlocked via subscription plans.

---

## Core Features

### 1. Authentication & User Management
- **Sign Up / Login**: Email, username, or Google OAuth.
- **Role Selection**: Users can register as clients (buyers) or vendors (sellers).
- **Profile Management**: Update personal and business details.
- **JWT Authentication**: Secure access to protected endpoints.
- **Role Switching**: Switch between client and vendor roles (if eligible).

### 2. Vendor Operations
- **Create Product Posts**: Vendors can create posts with multiple products.
- **Manage Posts**: Edit, delete, and view own posts.
- **Product Feed**: All users can browse a feed of products, filterable by school, area, and search terms.
- **Boosted & Trending Products**: Special endpoints for trending and fresh products.

### 3. Cart & Orders
- **Cart Management**: Add, update, remove, and clear items in cart.
- **Order Placement**: Place orders for products in cart.
- **Order Tracking**: Vendors and clients can view their orders.
- **Order Delivery**: Mark orders as delivered.

### 4. Payment Integration
- **Subscription Payments**: Paystack integration for plan purchases.
- **Order Payments**: Secure checkout for product orders.
- **Bank Account Resolution**: Vendors can link and verify bank accounts.
- **Subaccount Creation**: Vendors can create Paystack subaccounts for payouts.

### 5. Messaging & Notifications
- **In-App Messaging**: Secure, rate-limited chat between buyers and vendors.
- **Conversation Management**: Start, view, and manage conversations.
- **Notifications**: Receive and mark notifications as read.

### 6. Reviews & Ratings
- **Vendor Reviews**: Clients can review vendors after purchase.
- **Review Management**: Vendors can view all received reviews.

### 7. Location Services
- **School & Area Directory**: Browse schools and areas for targeted shopping.
- **Add New Areas**: Admins can add new school areas.

### 8. Admin Dashboard
- **Vendor Management**: View, update, and verify vendors; manage KYC and subscriptions.
- **Order & User Management**: View and manage all orders and users.
- **Subscription Management**: Activate, cancel, and view subscription stats.
- **Analytics**: Access signups, orders, top vendors, and revenue analytics.
- **Activity Logs**: Track admin and user activities.

### 9. Security & Compliance
- **CSRF Protection**: All endpoints protected.
- **CORS**: Configured for allowed origins.
- **Input Sanitization**: All user input sanitized.
- **Rate Limiting**: Prevents abuse of endpoints.
- **Role-Based Access**: Middleware for route protection.

---

## Subscription Plans & Features

### Plan Comparison (from backend logic)

| Plan            | Price (₦/mo) | Products/Post | Posts/12h | Priority Feed | Badge                | Analytics                        | Messaging | Featured Products | Homepage Spotlight | Custom Branding | Pin Post | Advanced Analytics | Priority Support | Post Scheduling | Profile Suggestion |
|-----------------|--------------|--------------|-----------|---------------|----------------------|-----------------------------------|-----------|-------------------|-------------------|-----------------|----------|--------------------|------------------|-----------------|-------------------|
| Free            | 0            | 4            | 3         | No            | None                 | Views                            | No        | No                | No                | No              | No       | No                 | No               | No              | No                |
| Shopydash Boost | 750          | 50           | 100       | Yes           | Boosted Vendor       | Views, Messages Initiated         | No        | No                | No                | No              | No       | No                 | No               | No              | No                |
| Shopydash Pro   | 1500         | 50           | 150       | Yes           | Orange               | Views, Saves, Clicks              | Yes       | Yes               | No                | Yes             | Yes      | No                 | No               | No              | No                |
| Shopydash Max   | 3000         | 50           | 200       | Yes           | Verification Badge   | Views, Saves, Messages, Conversion| Yes       | Yes               | Yes               | Yes             | Yes      | Yes                | Yes              | Yes             | Yes               |

#### Feature Details by Plan
- **Free**: Basic posting, limited analytics (views only), no messaging or premium features.
- **Boost**: Higher limits, priority in feeds/search, "Boosted Vendor" badge, more analytics.
- **Pro**: All Boost features plus messaging, featured products, custom branding, pin post, richer analytics.
- **Max**: All Pro features plus homepage spotlight, advanced analytics, priority support, post scheduling, profile suggestion, verification badge.

---

## How Subscription Features Are Enforced
- **Backend Enforcement**: All vendor post and feature limits are enforced by backend middleware (`subscription.middleware.js`) using the plan config in `config/subscriptionPlans.js`.
- **Feature Flags**: Each plan has a `features` object controlling access to premium features in the app.
- **Admin Controls**: Admins can activate/cancel plans and view stats via dashboard endpoints.

---

## Planned Improvements & Suggestions
- [ ] Add more granular analytics for all plans.
- [ ] Allow custom post limits per school or vendor.
- [ ] Add new plan tiers (e.g., "Enterprise").
- [ ] Enable limited-time promotional features.
- [ ] Expand messaging to Boost plan.
- [ ] Add more homepage and search visibility options.

---

## API Reference
See `backend/API.md` for full API endpoint documentation.

---

## Contact & Support
For questions or support, contact the Shopydash development team.

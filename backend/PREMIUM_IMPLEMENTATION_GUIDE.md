# Premium Feature Implementation Guide

This document provides a professional, step-by-step technical plan for implementing the "Vendora Boost", "Vendora Pro", and "Vendora Max" premium plans into your existing backend architecture.

## 1. System Overview & Requirements

We will introduce a subscription-based model using **Paystack** for payments. The system needs to:

1.  **Track Subscriptions**: valid plans per user.
2.  **Process Payments**: secure initialization and verification via Paystack.
3.  **Enforce Limits**: restrict features (product uploads, badges, search rankings) based on the active plan.

### Prerequisites

- **Paystack Account**: You need your Secret Key (`PAYSTACK_SECRET_KEY`) in your `.env` file.
- **Webhook Setup**: Configure your Paystack dashboard to send webhooks to `POST /api/payment/webhook`.

---

## 2. Database Schema Updates

You need to create new models to handle subscriptions and transactions.

### A. Subscription Model (`models/subscription.model.js`)

This model tracks the current status of a user's plan.

| Field              | Type                 | Description                              |
| :----------------- | :------------------- | :--------------------------------------- |
| `user`             | ObjectId (Ref: User) | The user who owns the subscription.      |
| `plan`             | String (Enum)        | `BOOST`, `PRO`, `MAX`.                   |
| `status`           | String (Enum)        | `active`, `expired`, `cancelled`.        |
| `startDate`        | Date                 | When the plan started.                   |
| `endDate`          | Date                 | When the plan expires.                   |
| `paystackAuthCode` | String               | For recurring charges (if needed later). |

### B. Transaction Model (`models/transaction.model.js`)

This model keeps a history of all payments for audit purposes.

| Field       | Type                 | Description                       |
| :---------- | :------------------- | :-------------------------------- |
| `user`      | ObjectId (Ref: User) | The payer.                        |
| `amount`    | Number               | Amount paid (in Kobo).            |
| `reference` | String               | Unique Paystack reference.        |
| `status`    | String               | `success`, `failed`, `pending`.   |
| `metadata`  | Object               | Any extra info (plan type, etc.). |

---

## 3. Configuration & Plans Logic

Create a configuration file to store your plan details centrally. This avoids hardcoding limits in multiple controllers.

**File:** `config/plans.js`

```javascript
/* structure example */
module.exports = {
  BOOST: {
    name: "Vendora Boost",
    limits: { products: 5 },
    features: { prioritySearch: true, boostedBadge: true },
  },
  PRO: {
    name: "Vendora Pro",
    limits: { products: 10 },
    features: { customBanner: true, analytics: true },
  },
  MAX: {
    name: "Vendora Max",
    limits: { products: 20 },
    features: { prioritySupport: true, verifiedBadge: true },
  },
};
```

---

## 4. Controller Logic & Routes

### A. Payment Controller (`controllers/payment.controller.js`)

**1. Initialize Payment (`POST /api/payment/initialize`)**

- **Input**: `planType` (e.g., 'PRO').
- **Logic**:
  1.  Validate the user.
  2.  Get the price for `planType` from `config/plans.js`.
  3.  Call Paystack API to initialize transaction.
  4.  Create a `Transaction` record with status `pending`.
- **Output**: Return the Paystack authorization URL to the frontend.

**2. Webhook / Verify Payment (`POST /api/payment/webhook`)**
_It is recommended to use Webhooks not just a simple verify route, to handle dropped connections._

- **Logic**:
  1.  Validate Paystack Signature (using HMACC and Secret Key).
  2.  If `event === 'charge.success'`:
      - Find the `Transaction` by reference.
      - Update Transaction status to `success`.
      - **Upsert Subscription**: Create or update the user's `Subscription` document. Set `status: active` and `endDate: now + 30 days`.

### B. Enforcing Features (The "Middleware" Strategy)

Instead of checking the DB in every function, create a helper to get the user's active plan.

**1. Product Upload Limit (`controllers/vendor/vendorProduct.controller.js`)**
Inside your `createProduct` method:

- Fetch the user's active subscription.
- Determine the limit (e.g., `Max = 20`, `Default = 5`).
- Count existing products for this vendor.
- **Check**: `if (currentCount >= limit) return Error("Limit reached. Upgrade to Pro.")`

**2. Search Priority (`controllers/vendorPost.controller.js`)**
"Vendora Boost" users appear higher.

- Update your search query (using Mongoose Aggregation).
- **Logic**: Perform a `$lookup` on the `Subscription` collection to join the plan status.
- **Sort**: Add a sort stage that prioritizes `BOOST`, `PRO`, `MAX` plans over standard users.

**3. Badges & Profile (`controllers/vendor/vendorProfile.controller.js`)**

- When fetching a profile (`getVendorProfile`), populate the subscription status.
- In the frontend response, include flags like `isBoosted: true` or `verifiedBadge: true` based on the active plan.

---

## 5. Security & Best Practices

1.  **Secret Management**: NEVER commit your Paystack Secret Key. Use `process.env.PAYSTACK_SECRET_KEY`.
2.  **Idempotency**: Ensure your webhook logic handles duplicate events gracefully (check if transaction is already processed).
3.  **Grace Period**: Decide if you want to give a small grace period after `endDate` before locking features.

## 6. Summary of Work Required

1.  Create `Subscription` and `Transaction` Mongoose schemas.
2.  Create `config/plans.js`.
3.  Implement `PaymentController` with `initialize` and `webhook` methods.
4.  Add routes: `/api/payment/initialize` and `/api/payment/webhook`.
5.  Modify `VendorProductController` to check limits before creation.
6.  Modify `VendorPostController` (Search) to prioritize premium users.

This plan covers the backend architecture required to robustly support your Premium Plans.

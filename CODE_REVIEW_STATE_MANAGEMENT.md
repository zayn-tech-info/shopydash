# Shopydash - State Management (Frontend) Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** Zustand stores, data flow, state synchronization

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 1 |
| Medium | 5 |
| Low | 5 |

**Overall State Management Score: 7.0/10**

---

## Store Overview

### Stores (10 total)

| Store | Purpose | State Items | Actions |
|-------|---------|-------------|---------|
| authStore | Authentication, user data | 13 | 10 |
| cartStore | Shopping cart | 3 | 6 |
| chatStore | Real-time messaging | 7 | 10 |
| productStore | Product listings | 7 | 8 |
| orderStore | Order management | 3 | 2 |
| reviewStore | Product reviews | - | - |
| signupStore | Registration form | 20 | 4 |
| subscriptionStore | Vendor subscriptions | - | - |
| clientProfileStore | Client profiles | - | - |
| vendorProfileStore | Vendor profiles | 9 | 6 |

---

## High Priority Issues

### 1. Password Stored in Auth Store State

**File:** `authStore.js:9`
**Severity:** HIGH

```javascript
export const useAuthStore = create((set) => ({
  role: "client",
  email: "",
  password: "",  // Password in global state!
  showPassword: false,
  // ...
}));
```

**Issues:**
- Plain text password stored in global state
- Persists in memory after login
- Accessible via React DevTools
- Can be captured by malicious browser extensions
- Never explicitly cleared after use

**Recommendation:** Never store passwords in global state. Use local component state and clear immediately after API call:
```javascript
// In component
const [password, setPassword] = useState('');
const handleSubmit = async () => {
  await login({ email, password });
  setPassword(''); // Clear immediately
};
```

---

## Medium Priority Issues

### 2. Duplicate Socket Implementation

**Files:** `chatStore.js` vs `lib/socket.js`
**Severity:** MEDIUM

Two separate Socket.IO implementations:

```javascript
// chatStore.js - Creates its own socket
const socket = io(ENDPOINT, {
  withCredentials: true,
  auth: { token: token },
  // ...
});

// lib/socket.js - SocketService class
class SocketService {
  connect(token) {
    this.socket = io(serverUrl, {
      auth: { token: token },
      // ...
    });
  }
}
```

**Issues:**
- Code duplication
- Could create multiple socket connections
- Inconsistent configuration

**Recommendation:** Use single socket service, import into store.

---

### 3. Cross-Store Dependencies Not Managed

**File:** `chatStore.js:203`
**Severity:** MEDIUM

```javascript
const userId = useAuthStore.getState().authUser?._id;
```

**Issues:**
- Direct store-to-store access without subscription
- Won't react to auth changes
- If user logs out, chatStore won't know

**Recommendation:** Use Zustand's `subscribe` or pass userId as parameter:
```javascript
// Option 1: Subscribe to auth changes
useAuthStore.subscribe((state) => {
  if (!state.authUser) {
    useChatStore.getState().disconnectSocket();
  }
});
```

---

### 4. No Loading State Reset on Error

**Files:** Multiple stores
**Severity:** MEDIUM

```javascript
// authStore.js
login: async (data) => {
  set({ isLogginIn: true, error: null });
  try {
    // ...
    set({ authUser: payload, isLogginIn: false, error: null });
  } catch (err) {
    set({ error: serverMessage, isLogginIn: false });
    throw serverMessage;  // Throws string, not Error
  }
}
```

**Issues:**
- Loading states correctly reset (good)
- But throws string instead of Error object
- Inconsistent error handling

---

### 5. Form State in Global Store

**File:** `signupStore.js`
**Severity:** MEDIUM

```javascript
export const useSignupStore = create((set) => ({
  fullName: "",
  email: "",
  password: "",  // Password in global state!
  phoneNumber: "",
  schoolName: "",
  username: "",
  businessName: "",
  whatsAppNumber: "",
  // ... 20+ form fields
}));
```

**Issues:**
- Form state should be local to component
- Global state persists even after leaving form
- Sensitive data (password) in global state
- Unnecessary re-renders across app

**Recommendation:** Use React Hook Form or local state for forms.

---

### 6. Optimistic Updates Without Proper Rollback

**File:** `cartStore.js:41-53`
**Severity:** MEDIUM

```javascript
removeFromCart: async (productId) => {
  const previousCart = get().cart;
  set({
    cart: previousCart.filter((item) => item.productId !== productId),
  });

  try {
    await api.delete("/api/v1/cart/", { data: { productId } });
    // No success confirmation, no state update on success
  } catch (error) {
    set({ cart: previousCart });  // Rollback on error
    toast.error(...);
  }
},
```

**Issues:**
- Good: Optimistic update with rollback
- Bad: No success state update (server response ignored)
- If server modifies data, client won't know

---

## Low Priority Issues

### 7. Console.log Left in Production Code

**Files:** Multiple stores
**Severity:** LOW

```javascript
// cartStore.js:28
console.log(res);

// orderStore.js:15
console.log(res);
```

---

### 8. Inconsistent Error Message Extraction

**Files:** Multiple stores
**Severity:** LOW

Different patterns used:

```javascript
// Pattern 1 (authStore)
err?.response?.data?.message ||
(typeof err?.response?.data === "string" ? err.response.data : null) ||
err?.message

// Pattern 2 (cartStore)
error.response?.data?.message || "Error adding to cart"

// Pattern 3 (vendorProfileStore)
err?.response?.data?.message ??
err?.response?.data ??
err?.message
```

**Recommendation:** Create utility function:
```javascript
const extractErrorMessage = (err, fallback = "An error occurred") => {
  return err?.response?.data?.message || err?.message || fallback;
};
```

---

### 9. Missing TypeScript Types

**Files:** All stores
**Severity:** LOW

No type definitions for:
- Store state shape
- Action parameters
- Return types

---

### 10. No State Persistence

**Files:** All stores
**Severity:** LOW

```javascript
// No persist middleware used
export const useAuthStore = create((set) => ({...}));
```

**Issue:** User loses all state on page refresh (must re-authenticate).

**Note:** This is intentional for auth (token in cookie), but cart could benefit from localStorage persistence.

---

### 11. Mixed Axios Usage

**File:** `chatStore.js`
**Severity:** LOW

```javascript
// Uses raw axios instead of configured api instance
import axios from "axios";

const res = await axios.get(`${ENDPOINT}/api/v1/messages`, {
  withCredentials: true,
});
```

**Issue:** Bypasses configured axios instance with interceptors.

---

## Store Pattern Analysis

### Strengths ✅

| Pattern | Implementation |
|---------|----------------|
| Separation of concerns | ✅ Each store handles one domain |
| Loading states | ✅ Consistent isLoading patterns |
| Error handling | ✅ Errors captured and stored |
| Optimistic updates | ✅ Cart uses optimistic updates |
| XSS prevention | ✅ DOMPurify in chatStore |

### Weaknesses ⚠️

| Pattern | Issue |
|---------|-------|
| Sensitive data | ❌ Password in global state |
| Form state | ⚠️ Should be local, not global |
| Cross-store deps | ⚠️ Direct getState() calls |
| Error extraction | ⚠️ Inconsistent patterns |
| Socket management | ⚠️ Duplicated implementation |

---

## Data Flow Diagram

```
                    ┌─────────────────┐
                    │   Components    │
                    └────────┬────────┘
                             │ useStore()
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
        ┌──────────┐  ┌──────────┐  ┌──────────┐
        │ authStore│  │cartStore │  │chatStore │
        └────┬─────┘  └────┬─────┘  └────┬─────┘
             │             │             │
             ▼             ▼             ▼
        ┌─────────────────────────────────────┐
        │           Axios API (api)           │
        └─────────────────────────────────────┘
                             │
                             ▼
        ┌─────────────────────────────────────┐
        │          Backend Server             │
        └─────────────────────────────────────┘
```

---

## Recommendations Summary

### Immediate
1. Remove password from global state (authStore & signupStore)
2. Remove console.log statements

### Short-term
3. Consolidate socket implementation
4. Create error extraction utility
5. Add cross-store subscription for auth state

### Medium-term
6. Move form state to local component state or React Hook Form
7. Add TypeScript types for stores
8. Use configured axios instance consistently

### Long-term
9. Consider state persistence for cart
10. Add store unit tests
11. Consider middleware for logging/debugging

---

## Store Checklist

| Store | Loading State | Error Handling | No Sensitive Data | Clean |
|-------|---------------|----------------|-------------------|-------|
| authStore | ✅ | ✅ | ❌ Password | ✅ |
| cartStore | ✅ | ✅ | ✅ | ⚠️ console.log |
| chatStore | ✅ | ✅ | ✅ | ⚠️ Duplicate socket |
| productStore | ✅ | ✅ | ✅ | ✅ |
| orderStore | ✅ | ✅ | ✅ | ⚠️ console.log |
| signupStore | ✅ | ✅ | ❌ Password | ✅ |
| vendorProfileStore | ✅ | ✅ | ✅ | ✅ |

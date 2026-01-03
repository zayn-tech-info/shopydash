# Shopydash - Performance Concerns Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** N+1 queries, re-renders, memory leaks, bundle size, caching

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 2 |
| Medium | 5 |
| Low | 4 |

**Overall Performance Score: 6.5/10**

---

## High Priority Issues

### 1. N+1 Query Pattern in Payment Controller

**File:** `backend/controllers/payment.controller.js:196-231`
**Severity:** HIGH

```javascript
for (const item of cartItems) {
  const post = await VendorPost.findOne({ "products._id": item.productId });
  // Process each item...
}

for (const [vId, items] of Object.entries(itemsByVendor)) {
  const vendorProfile = await VendorProfile.findOne({ userId: vId });
  // Create order for each vendor...
}
```

**Impact:**
- 10 cart items = minimum 10 database queries
- Additional query per unique vendor
- Linear time complexity O(n) queries
- Significant latency at checkout

**Recommendation:** Batch queries:
```javascript
const productIds = cartItems.map(i => i.productId);
const posts = await VendorPost.find({
  "products._id": { $in: productIds }
});

const vendorIds = [...new Set(cartItems.map(i => i.vendorId))];
const vendors = await VendorProfile.find({
  userId: { $in: vendorIds }
});
```

---

### 2. N+1 in Location Controller

**File:** `backend/controllers/location/location.controller.js:199-200`
**Severity:** HIGH

```javascript
for (const area of areas) {
  await SchoolArea.create({ name: area, schoolName: schoolName });
}
```

**Impact:** Creating 20 areas = 20 insert queries.

**Recommendation:** Use `insertMany`:
```javascript
const areaDocuments = areas.map(area => ({ name: area, schoolName }));
await SchoolArea.insertMany(areaDocuments);
```

---

## Medium Priority Issues

### 3. Missing .lean() on Read-Only Queries

**Files:** Multiple controllers
**Severity:** MEDIUM

```javascript
// Without .lean() - returns Mongoose documents with overhead
const cart = await Cart.findOne({ userId }).populate({...});

// With .lean() - returns plain JS objects, 2-5x faster
const cart = await Cart.findOne({ userId }).populate({...}).lean();
```

**Locations missing .lean():**
- `cart.controller.js:16` - getCart
- `message.controller.js:195` - getConversations (has .lean())
- `order.controller.js:60` - getOrders

**Recommendation:** Add `.lean()` to all read-only queries.

---

### 4. Excessive useEffect Calls

**Files:** Multiple frontend pages
**Severity:** MEDIUM

**Feeds.jsx has 5 useEffect hooks:**
```javascript
useEffect(() => {...}, []);                           // Line 49
useEffect(() => {...}, [selectedSchool]);             // Line 68
useEffect(() => {...}, [selectedSchool, selectedArea]); // Line 98
useEffect(() => {...}, [selectedSchool, ...]);        // Line 137
useEffect(() => {...}, [feedPosts]);                  // Line 146
```

**Issues:**
- Multiple data fetches on mount
- Cascading updates cause re-renders
- Complex dependency chains

**Recommendation:** Consider consolidating effects or using React Query/SWR for data fetching.

---

### 5. Large Bundle Dependencies

**File:** `frontend/app/package.json`
**Severity:** MEDIUM

| Package | Approximate Size | Usage |
|---------|-----------------|-------|
| @mui/material | ~300KB gzipped | UI components |
| framer-motion | ~100KB gzipped | Animations |
| date-fns | ~75KB (full) | Date formatting |
| swiper | ~50KB gzipped | Carousel |

**Total estimated bundle impact:** ~500KB+ (gzipped)

**Recommendations:**
1. Import only needed MUI components
2. Consider lighter animation alternatives
3. Use date-fns tree-shaking:
   ```javascript
   import { format } from 'date-fns/format'; // Not 'date-fns'
   ```

---

### 6. No API Response Caching

**Files:** All stores
**Severity:** MEDIUM

```javascript
// Every call hits the server
getCart: async () => {
  const res = await api.get("/api/v1/cart/");
  set({ cart: res.data.cart.items });
}
```

**Impact:**
- Same data fetched multiple times
- No cache invalidation strategy
- Unnecessary server load

**Recommendation:** Consider:
- React Query or SWR for caching
- ETags/Last-Modified headers
- Service Worker caching for static assets

---

### 7. Deep Populate Chains

**File:** `backend/controllers/order.controller.js:61-69`
**Severity:** MEDIUM

```javascript
const orders = await Order.find(query)
  .populate("items.product", "title image price")
  .populate({
    path: "vendor",
    select: "storeUsername userId",
    populate: {
      path: "userId",
      select: "businessName fullName email",
    },
  })
  .sort({ createdAt: -1 });
```

**Impact:**
- Nested populate = multiple DB lookups
- Can be slow with large datasets

**Recommendation:** Consider denormalizing frequently-accessed data or using aggregation pipeline.

---

## Low Priority Issues

### 8. Store Selectors Not Optimized

**File:** `frontend/app/src/App.jsx:33-36`
**Severity:** LOW

```javascript
const authUser = useAuthStore((state) => state.authUser);
const isCheckingAuth = useAuthStore((state) => state.isCheckingAuth);
const checkAuth = useAuthStore((state) => state.checkAuth);
const { getCart } = useCartStore();
```

**Issue:** Last line destructures the entire store, causing re-renders on any change.

**Recommendation:**
```javascript
const getCart = useCartStore((state) => state.getCart);
```

---

### 9. Scroll Event Without Throttle

**File:** `frontend/app/src/components/VendorFloatingButton.jsx`
**Severity:** LOW

```javascript
useEffect(() => {
  // Scroll listener without throttle
}, []);
```

**Recommendation:** Add throttle/debounce for scroll events.

---

### 10. Large Aggregate Pipelines

**File:** `backend/controllers/vendor/vendorPost.controller.js`
**Severity:** LOW

The `searchPosts` function has a complex 15+ stage aggregation pipeline that:
- Unwinds products
- Looks up subscriptions
- Calculates priority scores
- Looks up users
- Projects fields

**Recommendation:** Consider:
- Creating materialized views for search
- Adding appropriate indexes
- Caching common search results

---

### 11. No Pagination on Some Endpoints

**Files:** Some controllers
**Severity:** LOW

```javascript
// getAllVendorsProfile - returns ALL vendors
const vendors = await User.aggregate([
  { $match: { role: "vendor" } },
  // No pagination!
]);
```

**Recommendation:** Add pagination to all list endpoints.

---

## Database Query Analysis

### Query Patterns Found

| Pattern | Count | Impact |
|---------|-------|--------|
| N+1 in loops | 2 | HIGH |
| Deep populates | 4 | MEDIUM |
| Missing .lean() | 5+ | MEDIUM |
| Missing indexes used | 2 | MEDIUM |
| Unbounded queries | 2 | LOW |

### Index Usage

Based on queries analyzed:

| Query | Index Used? | Notes |
|-------|-------------|-------|
| `Cart.findOne({ userId })` | ✅ | userId is unique |
| `VendorProfile.findOne({ userId })` | ❌ | Missing index! |
| `Order.find({ buyer })` | ✅ | Compound index exists |
| `Message.find({ conversationId })` | ✅ | Indexed |
| `VendorPost.find({ school })` | ✅ | Indexed |

---

## Frontend Re-render Analysis

### Components with Potential Issues

| Component | Issue | Impact |
|-----------|-------|--------|
| Feeds.jsx | 5 useEffects, cascading updates | HIGH |
| App.jsx | Store destructuring pattern | LOW |
| HomeContent.jsx | 3 useEffects | MEDIUM |
| VendorDashboard.jsx | 2 useEffects | LOW |

### Store Subscription Patterns

```javascript
// Suboptimal - re-renders on any store change
const { getCart } = useCartStore();

// Optimal - only re-renders when getCart changes (it won't)
const getCart = useCartStore((state) => state.getCart);
```

---

## Memory Leak Potential

### Socket Connections

**File:** `frontend/app/src/store/chatStore.js`

```javascript
connectSocket: (userId) => {
  const existingSocket = get().socket;
  if (existingSocket) return;  // Prevents duplicate connections ✅

  const socket = io(ENDPOINT, {...});
  // Event listeners set up
  set({ socket });
}

disconnectSocket: () => {
  const socket = get().socket;
  if (socket) socket.disconnect();
  set({ socket: null });
}
```

**Assessment:** Socket cleanup looks reasonable, but ensure `disconnectSocket` is called on logout/unmount.

### Rate Limiter Maps

**File:** `backend/server.js`

```javascript
class SocketRateLimiter {
  constructor() {
    this.limits = new Map();  // Grows unbounded
  }

  cleanup() {
    // Runs every 5 minutes
  }
}

setInterval(() => messageRateLimiter.cleanup(), 5 * 60 * 1000);
```

**Assessment:** Cleanup exists but interval is long. Under attack, Map could grow large.

---

## Recommendations Summary

### Immediate
1. Fix N+1 in payment controller (batch queries)
2. Fix N+1 in location controller (use insertMany)
3. Add .lean() to read-only queries

### Short-term
4. Optimize store selectors
5. Add pagination to getAllVendorsProfile
6. Consider React Query/SWR for data caching

### Medium-term
7. Bundle optimization (tree-shaking, code splitting)
8. Consolidate useEffect calls in complex pages
9. Add API response caching headers

### Long-term
10. Add Redis for query caching
11. Implement search result caching
12. Consider materialized views for complex aggregations

---

## Performance Monitoring Recommendations

1. **Add monitoring tools:**
   - MongoDB Profiler for slow queries
   - React DevTools Profiler
   - Lighthouse CI for bundle analysis

2. **Set performance budgets:**
   - Bundle size < 500KB gzipped
   - Time to Interactive < 3s
   - API response < 200ms

3. **Add indexes based on explain():**
   ```javascript
   db.vendorprofiles.explain("executionStats").findOne({ userId: ObjectId("...") })
   ```

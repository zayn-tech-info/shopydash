# Shopydash - Real-time (Socket.IO) Review

**Review Date:** 2026-01-03
**Reviewer:** Igor Makowski
**Scope:** Socket.IO implementation, message handling, connection security

---

## Executive Summary

| Severity | Count |
|----------|-------|
| High | 2 |
| Medium | 4 |
| Low | 4 |

**Overall Socket.IO Score: 7.2/10**

---

## Architecture Overview

### Components

| Component | File | Purpose |
|-----------|------|---------|
| Socket Server | `backend/server.js` | Socket.IO server setup, event handlers |
| Socket Auth | `backend/middleware/socketAuth.js` | JWT authentication for sockets |
| Rate Limiter | `backend/server.js` (class) | Per-user message rate limiting |
| Client Service | `frontend/app/src/lib/socket.js` | Socket.IO client wrapper |

### Event Flow

```
Client                          Server
  │                               │
  ├──── connect (token) ─────────►│ socketAuthMiddleware
  │                               │     ↓
  │◄──── connected ───────────────│ socket.userId set
  │                               │
  ├──── join_chat (convId) ──────►│ verify participant
  │                               │     ↓
  │◄──── joined room ─────────────│ socket.join(convId)
  │                               │
  ├──── send_message ────────────►│ rate limit → validate → sanitize
  │                               │     ↓
  │◄──── receive_message ─────────│ io.to(convId).emit()
```

---

## High Priority Issues

### 1. CORS Origin Mismatch with Express

**File:** `server.js:23-27` vs `app.js:31-34`
**Severity:** HIGH

```javascript
// server.js (Socket.IO)
cors: {
  origin: ["http://localhost:5173", "https://shopydash-v1.vercel.app"],
}

// app.js (Express)
const allowedOrigins = [
  "http://localhost:5173",
  "https://shopydash.com",  // Different!
];
```

**Impact:**
- `shopydash.com` can make REST API calls but NOT connect to Socket.IO
- `shopydash-v1.vercel.app` can connect to Socket.IO but NOT make REST calls
- Breaks real-time features in production

**Recommendation:** Centralize CORS configuration:
```javascript
// config/cors.js
module.exports = [
  "http://localhost:5173",
  "https://shopydash.com",
  "https://shopydash-v1.vercel.app"
];
```

---

### 2. Typing Events Not Validated

**File:** `server.js:185-191`
**Severity:** HIGH

```javascript
socket.on("typing", ({ conversationId, userId, userName }) => {
  socket.to(conversationId).emit("typing", { userId, userName });
});

socket.on("stop_typing", ({ conversationId, userId }) => {
  socket.to(conversationId).emit("stop_typing", { userId });
});
```

**Issues:**
- No validation that user is participant of conversation
- No rate limiting on typing events
- Client can spam typing events to any room
- `userId` and `userName` from client not validated against `socket.userId`

**Impact:**
- Users can send typing indicators to conversations they're not part of
- Potential for spam/DoS via typing events
- Client can spoof typing as another user

**Recommendation:**
```javascript
socket.on("typing", async ({ conversationId }) => {
  // Verify membership and use socket.userId, not client-provided
  const isParticipant = await verifyParticipant(conversationId, socket.userId);
  if (isParticipant) {
    socket.to(conversationId).emit("typing", {
      userId: socket.userId,  // Server-side user ID
      userName: socket.user.fullName
    });
  }
});
```

---

## Medium Priority Issues

### 3. JWT Secret Mismatch (from Auth Review)

**File:** `middleware/socketAuth.js:18`
**Severity:** MEDIUM (already reported as HIGH in Security)

```javascript
const decoded = jwt.verify(token, process.env.JWT_SECRET);  // Wrong env var
```

Uses `JWT_SECRET` while auth middleware uses `JWT_SECRET_KEY`.

---

### 4. No Room Leave on Disconnect

**File:** `server.js:193-195`
**Severity:** MEDIUM

```javascript
socket.on("disconnect", () => {
  logInfo("Socket", `User disconnected: ${socket.userId}`);
  // No cleanup!
});
```

**Issues:**
- No explicit room leave (Socket.IO handles this automatically, but...)
- No notification to other participants that user went offline
- No cleanup of user's online status
- Rate limiter data not cleared immediately

**Recommendation:**
```javascript
socket.on("disconnect", () => {
  // Notify rooms user was in
  socket.rooms.forEach(room => {
    if (room !== socket.id) {
      io.to(room).emit("user_offline", { userId: socket.userId });
    }
  });
  logInfo("Socket", `User disconnected: ${socket.userId}`);
});
```

---

### 5. Client-Server Event Name Mismatch

**Files:** `server.js` vs `frontend/app/src/lib/socket.js`
**Severity:** MEDIUM

```javascript
// Server expects:
socket.on("join_chat", ...)

// Client sends:
this.socket.emit('join_conversation', { conversationId });  // Different name!

// Server emits:
io.to(conversationId).emit("receive_message", message);

// Client listens:
this.socket.on('new_message', callback);  // Different name!
```

**Impact:** Client won't receive messages or join rooms correctly.

**Recommendation:** Align event names between client and server.

---

### 6. Rate Limiter Not Persistent

**File:** `server.js:34-68`
**Severity:** MEDIUM

```javascript
class SocketRateLimiter {
  constructor() {
    this.limits = new Map();  // In-memory only
  }
}
```

**Issues:**
- Rate limits not shared across server instances
- Lost on server restart
- In horizontal scaling, user can bypass by hitting different servers

---

## Low Priority Issues

### 7. No Message Delivery Confirmation

**File:** `server.js:176`
**Severity:** LOW

```javascript
io.to(conversationId).emit("receive_message", message);
// No acknowledgment
```

**Issue:** No confirmation that message was delivered to recipients.

**Recommendation:** Use Socket.IO acknowledgments:
```javascript
socket.emit("send_message", data, (ack) => {
  // Confirmation callback
});
```

---

### 8. Conversation Fetched Twice in send_message

**File:** `server.js:133, 171`
**Severity:** LOW

```javascript
const conversation = await Conversation.findById(conversationId);  // First fetch
// ...
await Conversation.findByIdAndUpdate(conversationId, {...});  // Second query
```

**Issue:** Two database calls when one `findByIdAndUpdate` could suffice.

---

### 9. No Online Status Tracking

**Files:** `server.js`
**Severity:** LOW

No implementation for:
- Tracking online/offline status
- "Last seen" functionality
- Presence indicators

---

### 10. Client Doesn't Handle Reconnection State

**File:** `frontend/app/src/lib/socket.js:22-27`
**Severity:** LOW

```javascript
reconnection: true,
reconnectionAttempts: 5,
```

**Issue:** After 5 failed reconnection attempts, socket gives up silently. No UI feedback or retry mechanism.

---

## Security Assessment

### Strengths ✅

| Feature | Implementation |
|---------|----------------|
| JWT Authentication | ✅ Token verified on connection |
| Conversation Membership | ✅ Verified before joining/sending |
| Message Sanitization | ✅ DOMPurify strips HTML |
| Message Length Limit | ✅ 2000 char max |
| Rate Limiting | ✅ 30 msgs/60s per user |
| Empty Message Check | ✅ Rejects empty content |

### Weaknesses ⚠️

| Feature | Issue |
|---------|-------|
| Typing Events | ❌ No validation |
| CORS | ❌ Mismatch with Express |
| JWT Secret | ❌ Wrong env variable |
| Persistence | ❌ In-memory rate limiting |

---

## Event Reference

### Server Events (Listening)

| Event | Validation | Rate Limited | Notes |
|-------|------------|--------------|-------|
| `join_user_room` | ✅ userId match | ❌ | Only own room |
| `join_chat` | ✅ Participant check | ❌ | DB lookup |
| `send_message` | ✅ Full validation | ✅ 30/60s | Sanitized |
| `typing` | ❌ None | ❌ | **Security issue** |
| `stop_typing` | ❌ None | ❌ | **Security issue** |

### Server Events (Emitting)

| Event | Target | Payload |
|-------|--------|---------|
| `receive_message` | Room | Full message object |
| `typing` | Room (broadcast) | userId, userName |
| `stop_typing` | Room (broadcast) | userId |
| `error` | Sender only | { message } |

---

## Recommendations Summary

### Immediate
1. Fix CORS origin mismatch
2. Add validation to typing events
3. Fix JWT secret environment variable

### Short-term
4. Align client-server event names
5. Add user offline notifications on disconnect
6. Verify userId in typing events comes from socket, not client

### Medium-term
7. Move rate limiting to Redis for horizontal scaling
8. Add message delivery acknowledgments
9. Implement online status tracking

### Long-term
10. Add message read receipts
11. Implement message editing/deletion via socket
12. Add typing debounce on client side

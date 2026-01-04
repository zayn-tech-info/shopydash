# Authentication Cookie Fix for Production Domain

## Problem Description

Users were experiencing an authentication bug where:
- They were logged in and could perform all authenticated actions
- However, the browser console showed "You are not logged in" errors
- The issue only occurred on the production domain (shopydash.com) and not on localhost

## Root Cause

The authentication cookies were being set without a `domain` attribute. This caused cookies to be scoped only to the exact subdomain where they were set:

- Cookie set on `app.shopydash.com` → Only available on `app.shopydash.com`
- Cookie set on `www.shopydash.com` → Only available on `www.shopydash.com`

This prevented proper cookie sharing across subdomains, causing authentication to fail when the frontend and backend were on different subdomains or when navigating between subdomains.

## Solution

Added the `domain` attribute to cookies in production mode to enable sharing across all subdomains:

### Changes Made

1. **backend/utils/sendToken.js**
   - Added configurable `domain` attribute to cookie options in production
   - Reads from `COOKIE_DOMAIN` environment variable
   - The leading dot (.) ensures the cookie is shared across all subdomains

2. **backend/controllers/auth/auth.controller.js**
   - Updated logout function with matching domain settings
   - Removed inconsistent `RENDER` environment variable check
   - Now uses only `NODE_ENV === "production"` for consistency
   - Uses `COOKIE_DOMAIN` environment variable for flexibility

### Cookie Configuration

**Production Mode** (`NODE_ENV=production` with `COOKIE_DOMAIN=.shopydash.com`):
```javascript
{
  httpOnly: true,
  secure: true,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  sameSite: "none",
  domain: process.env.COOKIE_DOMAIN  // ".shopydash.com" - Allows sharing across subdomains
}
```

**Development Mode** (localhost):
```javascript
{
  httpOnly: true,
  secure: false,
  maxAge: 7 * 24 * 60 * 60 * 1000,
  sameSite: "lax"
  // No domain attribute - keeps cookies local
}
```

## Deployment Requirements

### Critical: Environment Variables

Ensure these environment variables are set in your production environment:

1. **NODE_ENV=production** - Required to enable production mode
2. **COOKIE_DOMAIN=.shopydash.com** - Required for cross-subdomain cookie sharing

#### Setting Environment Variables:

**Render.com**:
- Go to your service → Environment
- Add: `NODE_ENV` = `production`
- Add: `COOKIE_DOMAIN` = `.shopydash.com`

**Vercel**:
- Go to Project Settings → Environment Variables
- Add: `NODE_ENV` = `production`
- Add: `COOKIE_DOMAIN` = `.shopydash.com`

**Other platforms**:
- Add to your deployment configuration or `.env` file:
  ```
  NODE_ENV=production
  COOKIE_DOMAIN=.shopydash.com
  ```

⚠️ **Important**: The leading dot (`.`) in `.shopydash.com` is critical for subdomain sharing!

### Testing the Fix

After deployment, verify the fix works:

1. **Open browser DevTools** (F12) → Application/Storage → Cookies
2. **Login to your app** at `app.shopydash.com`
3. **Check the cookie**:
   - Name: `token`
   - Domain: `.shopydash.com` (with leading dot)
   - Secure: ✓ (checked)
   - HttpOnly: ✓ (checked)
   - SameSite: `None`

4. **Verify cross-subdomain access**:
   - Navigate to `www.shopydash.com` or `shopydash.com`
   - The cookie should still be present and valid
   - API calls should succeed without re-authentication

### Browser Console Verification

After login, check the console:
- Should NOT see "You are not logged in" errors
- Should NOT see 401 Unauthorized errors for authenticated endpoints
- API calls should include the authentication cookie

## Technical Details

### How Cookie Domains Work

- `domain: "app.shopydash.com"` → Only on app.shopydash.com
- `domain: ".shopydash.com"` → On all *.shopydash.com AND shopydash.com
- No domain attribute → Only on the exact domain that set it

### Why `sameSite: "none"` and `secure: true`

- Modern browsers require `secure: true` when `sameSite: "none"`
- `sameSite: "none"` allows cross-site requests (needed for CORS)
- Cookies are sent over HTTPS only (secure connection)

### CORS Configuration

The existing CORS configuration in `backend/app.js` is correct:
```javascript
cors({
  origin: [/* allowed origins */],
  credentials: true  // Required for cookies
})
```

Frontend axios is also correctly configured:
```javascript
axios.create({
  withCredentials: true  // Required to send cookies
})
```

## Troubleshooting

### If cookies still don't work:

1. **Check NODE_ENV**: Must be `"production"` (exact string)
2. **Check COOKIE_DOMAIN**: Must be set to `.shopydash.com` (with leading dot)
3. **Check HTTPS**: Domain must use HTTPS for secure cookies
4. **Check CORS**: Origin must be in allowedOrigins list
5. **Check Browser**: Clear cookies and cache, try incognito mode
6. **Check Domain**: Verify you're using shopydash.com or its subdomains

### Common Issues

- **Cookies blocked by browser**: Check third-party cookie settings
- **Mixed content**: Ensure all requests use HTTPS
- **Cookie not sent**: Verify `withCredentials: true` in frontend
- **401 errors persist**: Clear all cookies and login again

## Files Modified

- `backend/utils/sendToken.js`
- `backend/controllers/auth/auth.controller.js`

## Related Files (No Changes Needed)

- `backend/app.js` - CORS configuration (already correct)
- `backend/server.js` - Socket.IO CORS (already correct)
- `backend/middleware/csrf.middleware.js` - CSRF protection (already correct)
- `frontend/app/src/lib/axios.js` - Axios config (already correct)

## Security Considerations

✅ **Secure**: Cookies are `httpOnly` (protected from XSS)
✅ **Encrypted**: Cookies are `secure` (HTTPS only)
✅ **Validated**: CSRF protection in place
✅ **Scoped**: Domain limited to .shopydash.com only
✅ **Time-limited**: 7-day expiration

---

**Last Updated**: 2026-01-04
**Status**: ✅ Fixed and Ready for Deployment

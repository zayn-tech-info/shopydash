# Quick Deployment Guide - Authentication Cookie Fix

## 🚀 Immediate Action Required

To fix the authentication bug on shopydash.com, you need to set **TWO** environment variables in your production environment:

### Environment Variables to Add

```bash
NODE_ENV=production
COOKIE_DOMAIN=.shopydash.com
```

⚠️ **CRITICAL**: The dot (`.`) at the beginning of `.shopydash.com` is required!

---

## Platform-Specific Instructions

### If deployed on Render.com:

1. Go to https://dashboard.render.com
2. Select your backend service
3. Click **Environment** in the left sidebar
4. Click **Add Environment Variable**
5. Add:
   - **Key**: `NODE_ENV` → **Value**: `production`
   - **Key**: `COOKIE_DOMAIN` → **Value**: `.shopydash.com`
6. Click **Save Changes**
7. Your service will automatically redeploy

### If deployed on Vercel:

1. Go to https://vercel.com/dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add:
   - **Key**: `NODE_ENV` → **Value**: `production`
   - **Key**: `COOKIE_DOMAIN` → **Value**: `.shopydash.com`
5. Select **Production** environment
6. Click **Save**
7. Redeploy your project

### If using Heroku:

```bash
heroku config:set NODE_ENV=production
heroku config:set COOKIE_DOMAIN=.shopydash.com
```

### If using other platforms:

Add these to your `.env` file or environment configuration:
```
NODE_ENV=production
COOKIE_DOMAIN=.shopydash.com
```

---

## ✅ Verification Steps

After deploying with the environment variables:

1. **Clear your browser cookies** for shopydash.com
2. **Login** to your app at https://app.shopydash.com
3. **Open DevTools** (F12)
4. **Go to**: Application → Cookies → https://app.shopydash.com
5. **Check the `token` cookie** has:
   - ✅ Domain: `.shopydash.com` (with the dot!)
   - ✅ Secure: checked
   - ✅ HttpOnly: checked
   - ✅ SameSite: None

6. **Check browser console**:
   - ✅ Should NOT see "You are not logged in" errors
   - ✅ Should NOT see 401 Unauthorized errors

7. **Test navigation**:
   - Navigate to https://www.shopydash.com
   - Navigate to https://shopydash.com
   - You should remain authenticated on all domains

---

## 🔧 Troubleshooting

### Problem: Still seeing "not logged in" in console

**Check:**
1. Environment variables are set correctly (especially the dot in `.shopydash.com`)
2. Service has been redeployed after setting variables
3. Cleared cookies and logged in again
4. Using HTTPS (not HTTP)

### Problem: Cookie domain doesn't show `.shopydash.com`

**Solution:**
- Verify `COOKIE_DOMAIN=.shopydash.com` is set (with the dot!)
- Redeploy the service
- Clear cookies and login again

### Problem: Cookies not being sent with requests

**Check:**
1. Frontend has `withCredentials: true` in axios config (already set ✅)
2. Backend has `credentials: true` in CORS config (already set ✅)
3. Using HTTPS for all requests

---

## 📝 What Was Fixed

The authentication system was setting cookies without a `domain` attribute. This meant:
- Cookie set on `app.shopydash.com` → only worked on `app.shopydash.com`
- Cookie couldn't be shared with other subdomains

**Now with the fix:**
- Cookie set with `domain: .shopydash.com` → works on ALL subdomains
- Consistent authentication across the entire domain

---

## ⏱️ Estimated Time

- **Setting env vars**: 2 minutes
- **Redeployment**: 5-10 minutes (automatic)
- **Verification**: 2 minutes

**Total**: ~15 minutes to fix the bug! 🎉

---

## 📞 Need Help?

If you encounter issues after following these steps:
1. Check the detailed documentation in `AUTHENTICATION_FIX.md`
2. Verify server logs show: "Environment variables validated successfully"
3. Look for any warnings about COOKIE_DOMAIN in server logs
4. Ensure you're using the latest deployment (check git commit hash)

---

**Last Updated**: 2026-01-04
**Priority**: 🔴 HIGH - Required for production authentication

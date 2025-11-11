# Infinite Redirect Loop - FIXED

## Problem Identified
Browser was reloading between `/auth` and `/supplier` repeatedly, causing infinite redirects.

## Root Causes Found

1. **SupplierDashboardContainer** was redirecting to `/auth` when `!user`, even during user state transitions
2. **useUserFetch** was making repeated API calls to `/api/v1/users/me` getting 401 errors
3. **API Interceptor** was redirecting on 401 errors from `/users/me` endpoint
4. **ProtectedRoute** wasn't waiting long enough for user state to be set after signup
5. **useAuthRedirect** was running even when not on `/auth` page

## Fixes Applied

### 1. SupplierDashboardContainer (`src/components/supplier/dashboard/SupplierDashboardContainer.tsx`)
**Problem**: Redirected to `/auth` immediately when `!user`, even if user was being set after signup.

**Fix**: Added check for `isUserBeingSet` to wait for user state before redirecting:
```typescript
const hasLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
const isUserBeingSet = hasLoggedIn && !user && !isLoadingUser;

if (isUserBeingSet) {
  return <LoadingSpinner />; // Wait instead of redirecting
}
```

### 2. useUserFetch Hook (`src/hooks/useUserFetch.ts`)
**Problem**: Was attempting to fetch multiple times, getting 401 errors.

**Fix**: 
- Changed safety check from `> 1` to `>= 1` to prevent any retries
- Only clear session flag on actual 401 responses (not network errors)
- Mark as fetched even on error to prevent retries

### 3. API Interceptor (`src/services/api/base.ts`)
**Problem**: Was redirecting to `/auth` on 401 errors from `/users/me` endpoint.

**Fix**: Added exception for `/users/me` endpoint - don't redirect on 401:
```typescript
const isAuthCheckAPI = requestUrl.includes('/users/me');
if (!isPublicPage && !isPublicAPI && !isAuthCheckAPI) {
  this.handleAuthError();
}
```

### 4. UserContext (`src/contexts/UserContext.tsx`)
**Problem**: After signup/login, user was set but hook might still try to fetch.

**Fix**: Added effect to mark as fetched when user is already set:
```typescript
React.useEffect(() => {
  if (user && !hasFetchedRef.current) {
    hasFetchedRef.current = true;
    setIsLoading(false);
  }
}, [user]);
```

### 5. useAuthRedirect Hook (`src/hooks/useAuthRedirect.ts`)
**Problem**: Was running redirect logic even when not on `/auth` page.

**Fix**: Early return if not on `/auth`:
```typescript
if (location.pathname !== '/auth') {
  return; // Don't run redirect logic
}
```

### 6. ProtectedRoute (`src/components/ProtectedRoute.tsx`)
**Problem**: Wasn't waiting long enough for user state after signup.

**Fix**: 
- Increased wait time from 500ms to 1000ms
- Added `isUserBeingSet` check before redirecting
- Combined all loading/waiting checks into single condition

### 7. RootRoute (`src/components/RootRoute.tsx`)
**Problem**: Could redirect suppliers multiple times.

**Fix**: Added `hasRedirectedRef` to ensure redirect only happens once.

## Testing

After these fixes, the flow should be:

1. ✅ User signs up
2. ✅ User state is set in UserContext
3. ✅ Session flag is set
4. ✅ Auth redirects to `/supplier` (ONCE)
5. ✅ SupplierDashboardContainer waits for user state if needed
6. ✅ No repeated API calls
7. ✅ No redirect loops

## Backend Logs to Monitor

Check for:
- **Single** `/api/v1/users/me` call after signup (not repeated)
- **No** repeated 401 errors
- **Single** redirect after signup

## Console Logs to Watch

In development mode, you should see:
```
[useUserFetch] Fetching user... { attempt: 1 }
[useUserFetch] User fetched successfully: user@example.com
[UserContext] User already set, marking as fetched to prevent re-fetch
[useAuthRedirect] Redirecting to: /supplier { attempt: 1 }
[Auth] Component render: { hasUser: true, ... }
```

**Should NOT see:**
- ❌ Multiple `[useUserFetch] Fetching user...` logs
- ❌ `[useAuthRedirect] Too many redirect attempts`
- ❌ `[useUserFetch] Too many fetch attempts`
- ❌ Repeated redirect logs

## Files Changed

1. ✅ `src/components/supplier/dashboard/SupplierDashboardContainer.tsx`
2. ✅ `src/hooks/useUserFetch.ts`
3. ✅ `src/services/api/base.ts`
4. ✅ `src/contexts/UserContext.tsx`
5. ✅ `src/hooks/useAuthRedirect.ts`
6. ✅ `src/components/ProtectedRoute.tsx`
7. ✅ `src/components/RootRoute.tsx`
8. ✅ `src/pages/Auth.tsx`

All fixes are in place. The infinite redirect loop should now be resolved.



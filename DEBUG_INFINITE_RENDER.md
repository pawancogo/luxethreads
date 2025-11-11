# Infinite Render Loop - Debugging Guide

## Problem
After signup, the application was experiencing infinite re-renders, causing constant API calls to the backend.

## Root Causes Identified

1. **Auth Component Redirect Logic**: The redirect useEffect was triggering repeatedly due to:
   - Missing guards to prevent multiple redirects
   - Pathname changes triggering re-renders
   - No debouncing mechanism

2. **UserContext Fetch Logic**: Potential race conditions in async user fetching:
   - Multiple simultaneous fetch attempts
   - Missing abort checks after async operations
   - Context value recreation causing re-renders

3. **Tight Coupling**: All logic was in large components, making it hard to debug and isolate issues.

## Solution: Code Restructuring

### 1. Created Isolated Hooks

#### `useAuthRedirect` Hook (`src/hooks/useAuthRedirect.ts`)
- **Purpose**: Isolated redirect logic with safety guards
- **Features**:
  - Maximum redirect attempt limit (3 attempts)
  - Debounced redirect with 100ms timeout
  - Comprehensive debug logging
  - Only redirects when on `/auth` page
  - Resets only when user logs out

#### `useUserFetch` Hook (`src/hooks/useUserFetch.ts`)
- **Purpose**: Isolated user fetching logic
- **Features**:
  - Maximum fetch attempt limit (1 attempt)
  - Abort mechanism for cleanup
  - Session flag checking
  - Callback-based user setting
  - Comprehensive debug logging

### 2. Refactored Components

#### `UserContext` (`src/contexts/UserContext.tsx`)
- **Changes**:
  - Uses `useUserFetch` hook instead of inline fetch logic
  - Cleaner separation of concerns
  - Better error handling
  - Debug logging for re-renders

#### `Auth` Component (`src/pages/Auth.tsx`)
- **Changes**:
  - Uses `useAuthRedirect` hook
  - Broken into smaller sub-components:
    - `AuthLoadingSpinner`
    - `AuthFormContainer`
  - Single debug useEffect
  - Render counter for debugging

### 3. Debug Tools

#### `RenderCounter` Component (`src/components/debug/RenderCounter.tsx`)
- **Purpose**: Track component re-renders
- **Features**:
  - Visual render count display (dev mode only)
  - Console logging with prop changes
  - Warning when render count > 10

## How to Debug

### 1. Check Console Logs

In development mode, you'll see detailed logs:

```
[useUserFetch] Fetching user... { attempt: 1 }
[useUserFetch] User fetched successfully: user@example.com
[UserContext] User fetched from hook: user@example.com
[useAuthRedirect] Effect triggered: { isLoading: false, hasUser: true, ... }
[useAuthRedirect] Redirecting to: /
[Auth] Component render: { isLogin: true, hasUser: true, ... }
```

### 2. Watch for Warning Signs

- **Too many fetch attempts**: `[useUserFetch] Too many fetch attempts, stopping`
- **Too many redirects**: `[useAuthRedirect] Too many redirect attempts, stopping`
- **High render count**: `[RenderCounter] Component has rendered X times!`

### 3. Check Render Counter

In development mode, you'll see a small counter in the top-right corner showing render counts for components.

### 4. Network Tab

Check the Network tab in DevTools:
- Should see only **ONE** `/api/v1/users/me` call after signup
- Should see only **ONE** redirect after signup
- No repeated API calls

## Testing the Fix

1. **Signup Flow**:
   - Go to `/auth`
   - Fill signup form
   - Submit
   - Should redirect **once** to `/` or `/supplier`
   - Check console - should see single fetch and redirect logs

2. **Backend Logs**:
   - Should see only one `GET /api/v1/users/me` call after signup
   - No repeated calls

3. **Browser Console**:
   - No infinite loop warnings
   - Render counts should be reasonable (< 10 for Auth component)

## Key Improvements

1. **Isolation**: Each piece of logic is in its own hook/component
2. **Safety Guards**: Maximum attempt limits prevent infinite loops
3. **Debugging**: Comprehensive logging makes it easy to track issues
4. **Maintainability**: Smaller, focused components are easier to understand and modify

## Files Changed

- ✅ `src/hooks/useAuthRedirect.ts` (NEW)
- ✅ `src/hooks/useUserFetch.ts` (NEW)
- ✅ `src/contexts/UserContext.tsx` (REFACTORED)
- ✅ `src/pages/Auth.tsx` (REFACTORED)
- ✅ `src/components/debug/RenderCounter.tsx` (NEW)
- 📦 `src/contexts/UserContext.old.tsx` (BACKUP)
- 📦 `src/pages/Auth.old.tsx` (BACKUP)

## Next Steps

If infinite rendering still occurs:

1. Check console logs to identify which hook/component is causing the loop
2. Look at the render counter to see which component is re-rendering excessively
3. Check Network tab to see which API calls are being made repeatedly
4. Use React DevTools Profiler to identify the render source

## Rollback

If needed, you can rollback:
```bash
cd src/contexts && mv UserContext.old.tsx UserContext.tsx
cd ../pages && mv Auth.old.tsx Auth.tsx
```



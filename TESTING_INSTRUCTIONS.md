# Testing Instructions - Infinite Render Fix

## What Was Fixed

1. **Callback Stability**: Fixed `useUserFetch` hook to use a ref for the callback to prevent re-renders
2. **Code Restructuring**: Broke down large components into smaller, isolated hooks
3. **Safety Guards**: Added maximum attempt limits to prevent infinite loops
4. **Debug Logging**: Added comprehensive logging to track render cycles

## How to Test

### 1. Start the Frontend Server
```bash
cd luxethreads
npm run dev
```

The server should start on `http://localhost:5173`

### 2. Open Browser DevTools
- Open Chrome/Firefox DevTools (F12)
- Go to **Console** tab
- Go to **Network** tab

### 3. Test Signup Flow

1. Navigate to `http://localhost:5173/auth`
2. Click "Sign Up" if not already on signup form
3. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test-$(date +%s)@example.com (use a unique email)
   - Phone: 1234567890
   - Password: password123
   - Role: Customer
4. Click "Sign Up"

### 4. What to Check

#### Console Logs (Should See):
```
[useUserFetch] Fetching user... { attempt: 1 }
[useUserFetch] User fetched successfully: test@example.com
[UserContext] User fetched from hook: test@example.com
[useAuthRedirect] Effect triggered: { isLoading: false, hasUser: true, ... }
[useAuthRedirect] Redirecting to: /
[Auth] Component render: { isLogin: true, hasUser: true, ... }
```

#### Network Tab (Should See):
- **ONE** `POST /api/v1/signup` call
- **ONE** `GET /api/v1/users/me` call (if user fetch happens)
- **NO** repeated calls

#### Render Counter (Top Right):
- Should show reasonable render counts (< 10)
- Should NOT keep increasing

### 5. Red Flags (Infinite Loop Indicators)

❌ **BAD Signs:**
- Console shows repeated `[useAuthRedirect] Effect triggered` logs
- Console shows `[useUserFetch] Too many fetch attempts`
- Console shows `[useAuthRedirect] Too many redirect attempts`
- Network tab shows repeated API calls
- Render counter keeps increasing
- Browser becomes unresponsive

✅ **GOOD Signs:**
- Single redirect after signup
- Single API call per action
- Render count stabilizes
- Smooth navigation to home page

### 6. Backend Logs Check

Check your Rails server logs:
```bash
# Should see only ONE request like:
Started GET "/api/v1/users/me" for ::1 at 2025-11-11 15:19:52
Processing by Api::V1::UsersController#me as JSON
```

If you see **repeated** `/api/v1/users/me` calls, the infinite loop is still happening.

## Debugging Steps if Issue Persists

1. **Check Console for Errors**
   - Look for any error messages
   - Check which hook/component is logging repeatedly

2. **Check Render Counter**
   - Which component has high render count?
   - Is it Auth, UserContext, or another component?

3. **Check Network Tab**
   - Which API endpoint is being called repeatedly?
   - Is it `/users/me`, `/signup`, or another?

4. **Check React DevTools**
   - Install React DevTools extension
   - Check component tree
   - Look for components re-rendering excessively

5. **Check Session Storage**
   ```javascript
   // In browser console:
   console.log(sessionStorage.getItem('user_logged_in'));
   // Should be 'true' after signup, 'null' when logged out
   ```

## Expected Behavior

After signup:
1. ✅ User is created in backend
2. ✅ Cookie is set with auth token
3. ✅ Session flag is set to 'true'
4. ✅ User state is set in UserContext
5. ✅ **ONE** redirect to home page (`/`)
6. ✅ No further API calls
7. ✅ No re-renders

## Files to Monitor

- `src/contexts/UserContext.tsx` - User state management
- `src/hooks/useUserFetch.ts` - User fetching logic
- `src/hooks/useAuthRedirect.ts` - Redirect logic
- `src/pages/Auth.tsx` - Auth page component

## Rollback if Needed

If the fix doesn't work, you can rollback:
```bash
cd src/contexts
mv UserContext.old.tsx UserContext.tsx
cd ../pages
mv Auth.old.tsx Auth.tsx
```

Then restart the dev server.



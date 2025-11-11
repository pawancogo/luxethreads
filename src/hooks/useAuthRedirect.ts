/**
 * useAuthRedirect Hook - Clean Architecture Implementation
 * Simplified per KISS and YAGNI principles
 * Removed unnecessary useMemo and simplified refs
 */

import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { User } from '@/stores/userStore';

interface UseAuthRedirectOptions {
  user: User | null;
  isLoading: boolean;
  enabled?: boolean; // Allow disabling redirect
}

export const useAuthRedirect = ({ user, isLoading, enabled = true }: UseAuthRedirectOptions) => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirectedRef = useRef(false);
  const redirectAttemptsRef = useRef(0);

  // Calculate redirect path directly (no need for useMemo for simple calculation)
  const redirectPath = user && enabled ? (user.role === 'supplier' ? '/supplier' : '/') : null;

  // Main redirect effect - ONLY run when on /auth page
  useEffect(() => {
    // CRITICAL: Only run redirect logic when actually on /auth page
    if (location.pathname !== '/auth') {
      return;
    }

    // Debug logging
    if (process.env.NODE_ENV === 'development') {
      console.log('[useAuthRedirect] Effect triggered:', {
        isLoading,
        hasUser: !!user,
        redirectPath,
        currentPath: location.pathname,
        hasRedirected: hasRedirectedRef.current,
        attempts: redirectAttemptsRef.current,
      });
    }

    // Safety check: prevent infinite redirects
    if (redirectAttemptsRef.current > 2) {
      console.error('[useAuthRedirect] Too many redirect attempts, stopping');
      hasRedirectedRef.current = true; // Lock it
      return;
    }

    // Conditions for redirect:
    // 1. Not loading
    // 2. User exists
    // 3. Redirect path is available
    // 4. Currently on auth page (already checked above)
    // 5. Haven't redirected yet
    // 6. Redirect is enabled
    const shouldRedirect =
      !isLoading &&
      !!user &&
      !!redirectPath &&
      !hasRedirectedRef.current &&
      enabled;

    if (shouldRedirect) {
      redirectAttemptsRef.current += 1;
      hasRedirectedRef.current = true;

      if (process.env.NODE_ENV === 'development') {
        console.log('[useAuthRedirect] Redirecting to:', redirectPath, {
          attempt: redirectAttemptsRef.current,
        });
      }

      // Use immediate navigation with replace to prevent loops
      navigate(redirectPath, { replace: true });
    }
  }, [isLoading, user, redirectPath, location.pathname, navigate, enabled]);

  // Reset redirect flag when user logs out
  useEffect(() => {
    if (!user) {
      if (process.env.NODE_ENV === 'development') {
        console.log('[useAuthRedirect] User logged out, resetting redirect flag');
      }
      hasRedirectedRef.current = false;
      redirectAttemptsRef.current = 0;
    }
  }, [user]);

  return {
    redirectPath,
    hasRedirected: hasRedirectedRef.current,
  };
};


/**
 * Refactored Auth component with isolated redirect logic
 * Uses useAuthRedirect hook to prevent infinite loops
 */

import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useUser, useUserLoading } from '@/stores/userStore';
import { useAuthRedirect } from '@/hooks/useAuthRedirect';
import { RenderCounter } from '@/components/debug/RenderCounter';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';

const AuthLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
  </div>
);

const AuthFormContainer: React.FC<{
  isLogin: boolean;
  onSwitchToLogin: () => void;
  onSwitchToSignup: () => void;
}> = ({ isLogin, onSwitchToLogin, onSwitchToSignup }) => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
    <div className="w-full max-w-md">
      {isLogin ? (
        <LoginForm onSwitchToSignup={onSwitchToSignup} />
      ) : (
        <SignupForm onSwitchToLogin={onSwitchToLogin} />
      )}
    </div>
  </div>
);

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const user = useUser();
  const isLoading = useUserLoading();

  // Debug logging - single useEffect
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] Component render:', {
        isLogin,
        hasUser: !!user,
        isLoading,
        userEmail: user?.email,
      });
    }
  }, [isLogin, user, isLoading]);

  // Use the isolated redirect hook
  // CRITICAL: Only enable redirect when actually on /auth page
  const location = useLocation();
  useAuthRedirect({
    user,
    isLoading,
    enabled: location.pathname === '/auth', // Only redirect when on auth page
  });

  // Show loading state while checking user
  // CRITICAL: Also check if user is being set (session exists but state not ready)
  const hasLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
  const isUserBeingSet = hasLoggedIn && !user && !isLoading;

  // Debug: Log state to understand why it's stuck
  React.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('[Auth] State check:', {
        isLoading,
        hasUser: !!user,
        hasLoggedIn,
        isUserBeingSet,
        userEmail: user?.email,
        userRole: user?.role,
        currentPath: location.pathname,
      });
    }
  }, [isLoading, user, hasLoggedIn, isUserBeingSet, location.pathname]);

  if (isLoading || isUserBeingSet) {
    return (
      <>
        {process.env.NODE_ENV === 'development' && <RenderCounter name="AuthLoading" />}
        <AuthLoadingSpinner />
      </>
    );
  }

  return (
    <>
      {process.env.NODE_ENV === 'development' && (
        <RenderCounter name="Auth" props={{ isLogin, hasUser: !!user }} />
      )}
      <AuthFormContainer
        isLogin={isLogin}
        onSwitchToLogin={() => setIsLogin(true)}
        onSwitchToSignup={() => setIsLogin(false)}
      />
    </>
  );
};

export default Auth;


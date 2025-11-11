/**
 * ProtectedRoute - Simplified
 * Removed unnecessary useRef per YAGNI principle
 */

import { Navigate } from 'react-router-dom';
import { useUser, useUserLoading, useHasRole, UserRole } from '@/stores/userStore';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldX } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole | UserRole[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  allowedRoles, 
  redirectTo = '/auth' 
}) => {
  const user = useUser();
  const isLoading = useUserLoading();
  const hasRole = useHasRole();
  
  // Check if user is being set (session exists but user state not ready)
  const hasLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
  const isUserBeingSet = hasLoggedIn && !user && !isLoading;

  // Show loading while checking authentication
  if (isLoading || isUserBeingSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  if (!user) {
    // Clear cookies
    document.cookie = 'authtoken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    document.cookie = 'auth_token=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRoles && !hasRole(allowedRoles)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <ShieldX className="mx-auto h-12 w-12 text-red-500 mb-4" />
            <CardTitle className="text-red-600">Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to access this page.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-gray-600">
              Contact your administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;

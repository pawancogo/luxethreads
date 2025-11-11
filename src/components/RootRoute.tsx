/**
 * RootRoute - Simplified
 * Removed unnecessary useRef per YAGNI principle
 */

import { Navigate } from 'react-router-dom';
import { useUser, useUserLoading } from '@/stores/userStore';
import Home from '@/pages/Home';

/**
 * RootRoute component handles the default route (/) based on user role:
 * - Suppliers → redirect to /supplier
 * - Regular users → show Home page
 * - No user → show Home page (public access)
 */
const RootRoute: React.FC = () => {
  const user = useUser();
  const isLoading = useUserLoading();

  // Show loading state while checking user
  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // Check if user is being set (session exists but user state not ready)
  const hasLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
  const isUserBeingSet = hasLoggedIn && !user && !isLoading;

  // Wait for user state to be set
  if (isUserBeingSet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-600"></div>
      </div>
    );
  }

  // If user is supplier, redirect to supplier dashboard
  if (user && user.role === 'supplier') {
    return <Navigate to="/supplier" replace />;
  }

  // For regular users or no user, show Home page
  return <Home />;
};

export default RootRoute;

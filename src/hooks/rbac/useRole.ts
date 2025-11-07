import { useRbac } from '@/contexts/RbacContext';

/**
 * Hook to check if user has a specific role
 * 
 * @example
 * const isSuperAdmin = useRole('super_admin');
 * if (isSuperAdmin) {
 *   // Show admin panel
 * }
 */
export const useRole = (roleSlug: string | string[]): boolean => {
  const { hasRole } = useRbac();
  return hasRole(roleSlug);
};

/**
 * Hook to get user's primary role
 */
export const usePrimaryRole = () => {
  const { primaryRole } = useRbac();
  return primaryRole;
};

/**
 * Hook to get all user roles
 */
export const useRoles = () => {
  const { roles } = useRbac();
  return roles;
};


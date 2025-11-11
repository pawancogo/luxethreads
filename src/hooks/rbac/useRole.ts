import { useRbac, useRbacPrimaryRole, useRbacRoles } from '@/stores/rbacStore';

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
  return useRbacPrimaryRole();
};

/**
 * Hook to get all user roles
 */
export const useRoles = () => {
  return useRbacRoles();
};


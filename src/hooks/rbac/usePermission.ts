import { useRbac } from '@/stores/rbacStore';

/**
 * Hook to check if user has a specific permission
 * 
 * @example
 * const canEditProducts = usePermission('products:update');
 * if (canEditProducts) {
 *   // Show edit button
 * }
 */
export const usePermission = (permission: string | string[]): boolean => {
  const { hasPermission } = useRbac();
  return hasPermission(permission);
};

/**
 * Hook to check if user has any of the given permissions
 */
export const useAnyPermission = (permissions: string[]): boolean => {
  const { hasAnyPermission } = useRbac();
  return hasAnyPermission(permissions);
};

/**
 * Hook to check if user has all of the given permissions
 */
export const useAllPermissions = (permissions: string[]): boolean => {
  const { hasAllPermissions } = useRbac();
  return hasAllPermissions(permissions);
};

/**
 * Hook to check CRUD permissions for a resource type
 */
export const useResourcePermissions = (resourceType: string) => {
  const { canCreate, canRead, canUpdate, canDelete, canManage } = useRbac();
  
  return {
    canCreate: canCreate(resourceType),
    canRead: canRead(resourceType),
    canUpdate: canUpdate(resourceType),
    canDelete: canDelete(resourceType),
    canManage: canManage(resourceType),
  };
};


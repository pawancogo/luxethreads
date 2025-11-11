/**
 * RBAC Store - Zustand implementation
 * Performance optimized with selectors
 * Replaces RbacContext
 */

import { create } from 'zustand';
import { useEffect } from 'react';
import { useUser } from './userStore';

// RBAC Types
export type Permission = string;
export type Role = string;

export interface RbacRole {
  id: number;
  name: string;
  slug: string;
  role_type: 'supplier' | 'system';
  description?: string;
}

export interface RbacPermission {
  id: number;
  name: string;
  slug: string;
  resource_type: string;
  action: string;
  category: string;
}

interface RbacState {
  roles: RbacRole[];
  permissions: Permission[];
  isLoading: boolean;
  // Actions
  setRoles: (roles: RbacRole[]) => void;
  setPermissions: (permissions: Permission[]) => void;
  setLoading: (loading: boolean) => void;
  loadRbacData: (userType: 'supplier' | 'user') => Promise<void>;
  // Computed functions
  getPrimaryRole: () => RbacRole | null;
  hasRole: (roleSlug: string | string[]) => boolean;
  hasPermission: (permission: string | string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  canCreate: (resourceType: string) => boolean;
  canRead: (resourceType: string) => boolean;
  canUpdate: (resourceType: string) => boolean;
  canDelete: (resourceType: string) => boolean;
  canManage: (resourceType: string) => boolean;
}

export const useRbacStore = create<RbacState>((set, get) => ({
  roles: [],
  permissions: [],
  isLoading: true,

  setRoles: (roles: RbacRole[]) => set({ roles }),
  setPermissions: (permissions: Permission[]) => set({ permissions }),
  setLoading: (isLoading: boolean) => set({ isLoading }),

  loadRbacData: async (userType: 'supplier' | 'user') => {
    set({ isLoading: true });
    try {
      if (userType === 'supplier') {
        const supplierRoles: RbacRole[] = [];
        const supplierPermissions: Permission[] = [];
        
        set({ roles: supplierRoles, permissions: supplierPermissions });
      } else {
        set({ roles: [], permissions: [] });
      }
    } catch (error) {
      console.error('Error loading RBAC data:', error);
      set({ roles: [], permissions: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // Computed functions
  getPrimaryRole: (): RbacRole | null => {
    const { roles } = get();
    return roles.length === 0 ? null : roles[0];
  },

  hasRole: (roleSlug: string | string[]): boolean => {
    const { roles } = get();
    if (roles.length === 0) {
      return false;
    }
    
    const roleArray = Array.isArray(roleSlug) ? roleSlug : [roleSlug];
    return roles.some(role => roleArray.includes(role.slug));
  },

  hasPermission: (permission: string | string[]): boolean => {
    const { permissions } = get();
    if (permissions.length === 0) {
      return false;
    }

    const permArray = Array.isArray(permission) ? permission : [permission];
    return permArray.some(perm => permissions.includes(perm));
  },

  hasAnyPermission: (perms: string[]): boolean => {
    return perms.some(perm => get().hasPermission(perm));
  },

  hasAllPermissions: (perms: string[]): boolean => {
    return perms.every(perm => get().hasPermission(perm));
  },

  canCreate: (resourceType: string): boolean => {
    return get().hasPermission(`${resourceType}:create`) || get().hasPermission(`${resourceType}:manage`);
  },

  canRead: (resourceType: string): boolean => {
    return get().hasPermission(`${resourceType}:view`) || get().hasPermission(`${resourceType}:manage`);
  },

  canUpdate: (resourceType: string): boolean => {
    return get().hasPermission(`${resourceType}:update`) || get().hasPermission(`${resourceType}:manage`);
  },

  canDelete: (resourceType: string): boolean => {
    return get().hasPermission(`${resourceType}:delete`) || get().hasPermission(`${resourceType}:manage`);
  },

  canManage: (resourceType: string): boolean => {
    return get().hasPermission(`${resourceType}:manage`);
  },
}));

/**
 * Initialize RBAC data based on user role
 * This hook should be called once at app root or when user changes
 */
export const useRbacInit = () => {
  const user = useUser();
  const { loadRbacData } = useRbacStore();

  useEffect(() => {
    if (user) {
      const userType = user.role === 'supplier' ? 'supplier' : 'user';
      loadRbacData(userType);
    } else {
      // Clear RBAC data when user logs out
      useRbacStore.setState({ roles: [], permissions: [], isLoading: false });
    }
  }, [user?.id, user?.role, loadRbacData]);
};

/**
 * RBAC Hook - Provides same API as RbacContext
 */
export const useRbac = () => {
  const store = useRbacStore();
  return {
    roles: store.roles,
    primaryRole: store.getPrimaryRole(),
    hasRole: store.hasRole,
    permissions: store.permissions,
    hasPermission: store.hasPermission,
    hasAnyPermission: store.hasAnyPermission,
    hasAllPermissions: store.hasAllPermissions,
    canCreate: store.canCreate,
    canRead: store.canRead,
    canUpdate: store.canUpdate,
    canDelete: store.canDelete,
    canManage: store.canManage,
    isLoading: store.isLoading,
  };
};

/**
 * Performance-optimized selectors
 */
export const useRbacRoles = () => useRbacStore((state) => state.roles);
export const useRbacPermissions = () => useRbacStore((state) => state.permissions);
export const useRbacLoading = () => useRbacStore((state) => state.isLoading);
export const useRbacPrimaryRole = () => useRbacStore((state) => state.getPrimaryRole());


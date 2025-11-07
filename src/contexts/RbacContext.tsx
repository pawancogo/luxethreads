import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// RBAC Types
export type Permission = string;
export type Role = string;

export interface RbacRole {
  id: number;
  name: string;
  slug: string;
  role_type: 'admin' | 'supplier' | 'system';
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

interface RbacContextType {
  // Roles
  roles: RbacRole[];
  primaryRole: RbacRole | null;
  hasRole: (roleSlug: string | string[]) => boolean;
  
  // Permissions
  permissions: Permission[];
  hasPermission: (permission: string | string[]) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  
  // Helper methods
  canCreate: (resourceType: string) => boolean;
  canRead: (resourceType: string) => boolean;
  canUpdate: (resourceType: string) => boolean;
  canDelete: (resourceType: string) => boolean;
  canManage: (resourceType: string) => boolean;
  
  // Loading state
  isLoading: boolean;
}

const RbacContext = createContext<RbacContextType | null>(null);

interface RbacProviderProps {
  children: React.ReactNode;
  userType: 'admin' | 'supplier' | 'user';
}

export const RbacProvider: React.FC<RbacProviderProps> = ({ children, userType }) => {
  const [roles, setRoles] = useState<RbacRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load RBAC data from API
  useEffect(() => {
    const loadRbacData = async () => {
      setIsLoading(true);
      try {
        if (userType === 'admin') {
          // Try to get admin from localStorage
          const savedAdmin = localStorage.getItem('admin');
          if (savedAdmin) {
            try {
              const admin = JSON.parse(savedAdmin);
              // Backend should return roles and permissions in admin object
              const adminRoles: RbacRole[] = admin.roles || [];
              const adminPermissions: Permission[] = Object.keys(admin.permissions || {}).filter(
                key => admin.permissions[key] === true
              );
              
              setRoles(adminRoles);
              setPermissions(adminPermissions);
            } catch (e) {
              console.error('Error parsing admin data:', e);
            }
          }
        } else if (userType === 'supplier') {
          // Load supplier RBAC data
          // This would come from supplier_account_user data
          // For now, use default permissions based on role
          const supplierRoles: RbacRole[] = [];
          const supplierPermissions: Permission[] = [];
          
          setRoles(supplierRoles);
          setPermissions(supplierPermissions);
        }
      } catch (error) {
        console.error('Error loading RBAC data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRbacData();
  }, [userType]);

  // Computed values
  const primaryRole = useMemo(() => {
    if (roles.length === 0) return null;
    // Return role with highest priority (if available) or first role
    return roles[0];
  }, [roles]);

  const hasRole = (roleSlug: string | string[]): boolean => {
    if (roles.length === 0) {
      // Fallback to legacy role check for backward compatibility
      if (userType === 'admin') {
        const savedAdmin = localStorage.getItem('admin');
        if (savedAdmin) {
          try {
            const admin = JSON.parse(savedAdmin);
            const roleArray = Array.isArray(roleSlug) ? roleSlug : [roleSlug];
            return roleArray.includes(admin.role) || admin.role === 'super_admin';
          } catch {}
        }
      }
      return false;
    }
    
    const roleArray = Array.isArray(roleSlug) ? roleSlug : [roleSlug];
    return roles.some(role => roleArray.includes(role.slug));
  };

  const hasPermission = (permission: string | string[]): boolean => {
    // Super admin has all permissions (backward compatibility)
    if (userType === 'admin') {
      const savedAdmin = localStorage.getItem('admin');
      if (savedAdmin) {
        try {
          const admin = JSON.parse(savedAdmin);
          if (admin.role === 'super_admin') {
            return true;
          }
        } catch {}
      }
    }

    if (permissions.length === 0) {
      // Fallback to legacy permission check
      if (userType === 'admin') {
        const savedAdmin = localStorage.getItem('admin');
        if (savedAdmin) {
          try {
            const admin = JSON.parse(savedAdmin);
            const permArray = Array.isArray(permission) ? permission : [permission];
            return permArray.some(perm => admin.permissions?.[perm] === true);
          } catch {}
        }
      }
      return false;
    }

    const permArray = Array.isArray(permission) ? permission : [permission];
    return permArray.some(perm => permissions.includes(perm));
  };

  const hasAnyPermission = (perms: string[]): boolean => {
    return perms.some(perm => hasPermission(perm));
  };

  const hasAllPermissions = (perms: string[]): boolean => {
    return perms.every(perm => hasPermission(perm));
  };

  // CRUD helpers
  const canCreate = (resourceType: string): boolean => {
    return hasPermission(`${resourceType}:create`) || hasPermission(`${resourceType}:manage`);
  };

  const canRead = (resourceType: string): boolean => {
    return hasPermission(`${resourceType}:view`) || hasPermission(`${resourceType}:manage`);
  };

  const canUpdate = (resourceType: string): boolean => {
    return hasPermission(`${resourceType}:update`) || hasPermission(`${resourceType}:manage`);
  };

  const canDelete = (resourceType: string): boolean => {
    return hasPermission(`${resourceType}:delete`) || hasPermission(`${resourceType}:manage`);
  };

  const canManage = (resourceType: string): boolean => {
    return hasPermission(`${resourceType}:manage`);
  };

  const value: RbacContextType = {
    roles,
    primaryRole,
    hasRole,
    permissions,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    canCreate,
    canRead,
    canUpdate,
    canDelete,
    canManage,
    isLoading,
  };

  return <RbacContext.Provider value={value}>{children}</RbacContext.Provider>;
};

export const useRbac = () => {
  const context = useContext(RbacContext);
  if (!context) {
    throw new Error('useRbac must be used within an RbacProvider');
  }
  return context;
};


import React, { createContext, useContext, useState, useEffect } from 'react';

export type AdminRole = 'super_admin' | 'product_admin' | 'order_admin' | 'user_admin' | 'supplier_admin';

interface Admin {
  id: string;
  email: string;
  role: AdminRole;
  first_name: string;
  last_name: string;
  full_name: string;
  permissions: Record<string, boolean>;
  roles?: Array<{ id: number; name: string; slug: string; role_type: string }>; // RBAC roles
}

interface AdminContextType {
  admin: Admin | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roles: AdminRole | AdminRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
}

const AdminContext = createContext<AdminContextType | null>(null);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedAdmin = localStorage.getItem('admin');
    const savedToken = localStorage.getItem('admin_token');
    if (savedAdmin && savedToken) {
      try {
        setAdmin(JSON.parse(savedAdmin));
      } catch (e) {
        console.error('Error parsing saved admin:', e);
        localStorage.removeItem('admin');
        localStorage.removeItem('admin_token');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: Error }> => {
    setIsLoading(true);
    try {
      const { adminAuthAPI } = await import('../services/api');
      const response = await adminAuthAPI.login(email, password);
      
      // @ts-ignore - Response is transformed by interceptor
      const adminData = response?.admin;
      
      if (!adminData) {
        throw new Error('Invalid login response: admin data not found');
      }
      
      const newAdmin: Admin = {
        id: adminData.id?.toString() || Date.now().toString(),
        email: adminData.email || email,
        role: adminData.role || 'product_admin',
        first_name: adminData.first_name || '',
        last_name: adminData.last_name || '',
        full_name: adminData.full_name || `${adminData.first_name || ''} ${adminData.last_name || ''}`.trim(),
        permissions: adminData.permissions || {},
      };
      
      setAdmin(newAdmin);
      localStorage.setItem('admin', JSON.stringify(newAdmin));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Admin login error:', error);
      setIsLoading(false);
      return { success: false, error: error as Error };
    }
  };

  const logout = () => {
    setAdmin(null);
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    const { adminAuthAPI } = require('../services/api');
    adminAuthAPI.logout();
  };

  const hasRole = (roles: AdminRole | AdminRole[]): boolean => {
    if (!admin) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(admin.role) || admin.role === 'super_admin';
  };

  const hasPermission = (permission: string): boolean => {
    if (!admin) return false;
    // Super admin has all permissions
    if (admin.role === 'super_admin') return true;
    return admin.permissions[permission] === true;
  };

  return (
    <AdminContext.Provider value={{ admin, login, logout, isLoading, hasRole, hasPermission }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};


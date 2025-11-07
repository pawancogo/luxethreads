import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

export type UserRole = 'customer' | 'supplier';

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string; // For suppliers
  taxId?: string; // For suppliers
  phone?: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  signup: (name: string, email: string, password: string, role?: UserRole, companyName?: string, taxId?: string, phone?: string, firstName?: string, lastName?: string) => Promise<{ success: boolean; error?: Error }>;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: Error }> => {
    setIsLoading(true);
    try {
      const { authAPI } = await import('../services/api');
      const response = await authAPI.login(email, password);
      
      // The axios interceptor extracts response.data.data from the backend response
      // Backend returns: { success: true, message: "...", data: { token, user } }
      // After interceptor: response = { token, user }
      // @ts-ignore - Response is transformed by interceptor
      const userData = response?.user;
      
      if (!userData) {
        throw new Error('Invalid login response: user data not found');
      }
      
      const newUser: User = {
        id: userData.id?.toString() || Date.now().toString(),
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || email.split('@')[0],
        email: userData.email || email,
        role: userData.role === 'supplier' ? 'supplier' : 'customer',
        companyName: userData.company_name,
        taxId: userData.tax_id || userData.gst_number,
        phone: userData.phone_number || userData.phone,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return { success: false, error: error as Error };
    }
  }, []);

  const signup = useCallback(async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = 'customer',
    companyName?: string,
    taxId?: string,
    phone?: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ success: boolean; error?: Error }> => {
    setIsLoading(true);
    try {
      const { authAPI } = await import('../services/api');
      const nameParts = name.split(' ');
      const first_name = firstName || nameParts[0] || name;
      const last_name = lastName || nameParts.slice(1).join(' ') || '';
      
      const userData = {
        first_name,
        last_name,
        email,
        phone_number: phone || '',
        password,
        role: role === 'supplier' ? 'supplier' : 'customer',
      };
      
      const response = await authAPI.signup(userData);
      
      // The axios interceptor extracts response.data.data from the backend response
      // Backend returns: { success: true, message: "...", data: { token, user } }
      // After interceptor: response = { token, user }
      // @ts-ignore - Response is transformed by interceptor
      const userResponse = response?.user;
      
      if (!userResponse || !userResponse.id) {
        throw new Error('Invalid signup response: user data not found');
      }
      
      const newUser: User = {
        id: userResponse.id?.toString() || Date.now().toString(),
        name: userResponse.full_name || `${userResponse.first_name || ''} ${userResponse.last_name || ''}`.trim() || name,
        email: userResponse.email || email,
        role: userResponse.role === 'supplier' ? 'supplier' : 'customer',
        companyName: role === 'supplier' ? companyName : undefined,
        taxId: role === 'supplier' ? taxId : undefined,
        phone: userResponse.phone_number || phone,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      setIsLoading(false);
      return { success: false, error: error as Error };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    
    // Clear specific auth cookies
    document.cookie = 'authtoken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
    
    // Clear all other cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
    // Redirect to login page if not already there
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }, []);

  const hasRole = useCallback((roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }, [user]);

  const value = useMemo(() => ({
    user,
    login,
    signup,
    logout,
    isLoading,
    hasRole,
  }), [user, login, signup, logout, isLoading, hasRole]);

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

import React, { createContext, useContext, useState, useEffect } from 'react';

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

const UserContext = createContext<UserContextType | null>(null);

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

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: Error }> => {
    setIsLoading(true);
    try {
      const { authAPI } = await import('../services/api');
      const response = await authAPI.login(email, password);
      
      const userData = response.user || response.data?.user;
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
  };

  const signup = async (
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
      
      const userResponse = response.user || response.data?.user;
      const newUser: User = {
        id: userResponse.id?.toString() || Date.now().toString(),
        name,
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
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  };

  return (
    <UserContext.Provider value={{ user, login, signup, logout, isLoading, hasRole }}>
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

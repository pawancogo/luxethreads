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
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string, role?: UserRole, companyName?: string, taxId?: string, phone?: string) => Promise<boolean>;
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

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      // Mock different user types based on email
      let role: UserRole = 'customer';
      let companyName: string | undefined;
      let taxId: string | undefined;
      let phone: string | undefined;

      if (email.includes('supplier')) {
        role = 'supplier';
        companyName = 'Sample Company Ltd.';
        taxId = 'TAX123456';
        phone = '+1-555-0123';
      }

      const newUser: User = {
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role,
        companyName,
        taxId,
        phone,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (
    name: string, 
    email: string, 
    password: string, 
    role: UserRole = 'customer',
    companyName?: string,
    taxId?: string,
    phone?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      const newUser: User = {
        id: Date.now().toString(),
        name,
        email,
        role,
        companyName: role === 'supplier' ? companyName : undefined,
        taxId: role === 'supplier' ? taxId : undefined,
        phone: role === 'supplier' ? phone : undefined,
      };
      
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
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

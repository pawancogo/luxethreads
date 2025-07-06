import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
}

interface UserContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({id: '1', name: 'abc', email: 'abc@gmail.com'});
  // const [user, setUser] = useState<User | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock login - in real app, this would call your API
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email && password) {
      const newUser = {
        id: '1',
        name: email.split('@')[0],
        email,
      };
      setUser(newUser);
      localStorage.setItem('user', JSON.stringify(newUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    // Mock signup - in real app, this would call your API
    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (name && email && password) {
      const newUser = {
        id: Date.now().toString(),
        name,
        email,
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

  return (
    <UserContext.Provider value={{ user, login, signup, logout, isLoading }}>
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
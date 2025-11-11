/**
 * User Store - Zustand implementation
 * Performance optimized with selectors
 * Replaces UserContext
 */

import { create } from 'zustand';
import { useEffect } from 'react';
import { userService } from '@/services/user.service';

// User Types - Centralized here
export type UserRole = 'customer' | 'supplier' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  companyName?: string;
  taxId?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  is_active?: boolean;
  email_verified?: boolean;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  hasFetched: boolean;
  // Actions
  login: (email: string, password: string) => Promise<{ success: boolean; error?: Error }>;
  signup: (
    name: string,
    email: string,
    password: string,
    role?: UserRole,
    companyName?: string,
    taxId?: string,
    phone?: string,
    firstName?: string,
    lastName?: string
  ) => Promise<{ success: boolean; error?: Error; user?: User }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setHasFetched: (fetched: boolean) => void;
  // Computed
  hasRole: (roles: UserRole | UserRole[]) => boolean;
}

export const useUserStore = create<UserState>((set, get) => ({
  user: null,
  isLoading: true,
  hasFetched: false,

  login: async (email: string, password: string) => {
    set({ isLoading: true });
    const result = await userService.login(email, password);
    
    if (result.success && result.user) {
      set({ user: result.user, hasFetched: true });
    }
    
    set({ isLoading: false });
    return { success: result.success, error: result.error };
  },

  signup: async (
    name: string,
    email: string,
    password: string,
    role: UserRole = 'customer',
    companyName?: string,
    taxId?: string,
    phone?: string,
    firstName?: string,
    lastName?: string
  ) => {
    set({ isLoading: true });
    const result = await userService.signup(
      name,
      email,
      password,
      role,
      companyName,
      taxId,
      phone,
      firstName,
      lastName
    );
    
    if (result.success && result.user) {
      set({ user: result.user, hasFetched: true });
    }
    
    set({ isLoading: false });
    return result;
  },

  logout: async () => {
    await userService.logout();
    set({ user: null, hasFetched: false });
    
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  },

  refreshUser: async () => {
    const { user } = get();
    const updatedUser = await userService.refreshUser(user);
    set({ user: updatedUser });
  },

  setUser: (user: User | null) => set({ user }),
  setLoading: (isLoading: boolean) => set({ isLoading }),
  setHasFetched: (hasFetched: boolean) => set({ hasFetched }),

  hasRole: (roles: UserRole | UserRole[]) => {
    const { user } = get();
    return userService.hasRole(user, roles);
  },
}));

/**
 * Initialize user on mount
 * This hook should be called once at app root
 */
export const useUserInit = () => {
  const { hasFetched, isLoading, setUser, setLoading, setHasFetched } = useUserStore();

  useEffect(() => {
    if (hasFetched) return;

    const hasLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
    if (!hasLoggedIn) {
      setLoading(false);
      setHasFetched(true);
      return;
    }

    const fetchUser = async () => {
      setLoading(true);
      const fetchedUser = await userService.getCurrentUser();
      setUser(fetchedUser);
      setLoading(false);
      setHasFetched(true);
    };

    fetchUser();
  }, [hasFetched, setUser, setLoading, setHasFetched]);
};

/**
 * Performance-optimized selectors
 * Use these hooks to subscribe only to specific parts of the store
 */
export const useUser = () => useUserStore((state) => state.user);
export const useUserLoading = () => useUserStore((state) => state.isLoading);
export const useUserActions = () => useUserStore((state) => ({
  login: state.login,
  signup: state.signup,
  logout: state.logout,
  refreshUser: state.refreshUser,
}));
export const useUserRole = () => useUserStore((state) => state.user?.role);
export const useHasRole = () => useUserStore((state) => state.hasRole);


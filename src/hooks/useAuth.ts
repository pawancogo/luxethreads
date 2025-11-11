/**
 * useAuth Hook - Simplified
 * Uses UserService for business logic
 * Removed unnecessary hooks (useCallback, useMemo) per YAGNI principle
 */

import { useState, useEffect } from 'react';
import { userService } from '@/services/user.service';
import type { LoginResponse, SignupData } from '@/services/api/auth.service';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    error: null,
    user: null,
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await userService.getCurrentUser();
        setState({
          isAuthenticated: !!user,
          loading: false,
          error: null,
          user: user || null,
        });
      } catch (error) {
        setState({
          isAuthenticated: false,
          loading: false,
          error: null,
          user: null,
        });
      }
    };
    fetchUser();
  }, []);

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const result = await userService.login(email, password);
      if (result.success && result.user) {
        setState({
          isAuthenticated: true,
          loading: false,
          error: null,
          user: result.user,
        });
        return { user: result.user } as LoginResponse;
      }
      throw new Error('Login failed');
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e?.message || 'Login failed',
      }));
      throw e;
    }
  };

  const signup = async (data: SignupData): Promise<LoginResponse> => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const name = `${data.first_name} ${data.last_name}`.trim();
      const result = await userService.signup(
        name,
        data.email,
        data.password,
        data.role as any,
        undefined,
        undefined,
        data.phone_number
      );
      if (result.success && result.user) {
        setState({
          isAuthenticated: true,
          loading: false,
          error: null,
          user: result.user,
        });
        return { user: result.user } as LoginResponse;
      }
      throw new Error('Signup failed');
    } catch (e: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: e?.message || 'Signup failed',
      }));
      throw e;
    }
  };

  const logout = async () => {
    await userService.logout();
    setState({ isAuthenticated: false, loading: false, error: null, user: null });
  };

  return {
    ...state,
    login,
    signup,
    logout,
  };
}

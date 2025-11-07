// Reusable user authentication hook
// Wraps authService and stores tokens consistently
import { useCallback, useMemo, useState } from 'react';
import { authService, type LoginResponse, type SignupData } from '@/services/api';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  user: any | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    isAuthenticated: !!localStorage.getItem('auth_token'),
    loading: false,
    error: null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
  });

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authService.login(email, password);
      // Preserve existing behavior: token already stored by service; user may be returned
      if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));
      setState({ isAuthenticated: true, loading: false, error: null, user: res?.user || null });
      return res;
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e?.message || 'Login failed' }));
      throw e;
    }
  }, []);

  const signup = useCallback(async (data: SignupData): Promise<LoginResponse> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await authService.signup(data);
      if (res?.user) localStorage.setItem('user', JSON.stringify(res.user));
      setState({ isAuthenticated: true, loading: false, error: null, user: res?.user || null });
      return res;
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e?.message || 'Signup failed' }));
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setState({ isAuthenticated: false, loading: false, error: null, user: null });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    signup,
    logout,
  }), [state, login, signup, logout]);

  return value;
}

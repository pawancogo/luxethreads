// Reusable admin authentication hook
import { useCallback, useMemo, useState } from 'react';
import { adminAuthService, type LoginResponse } from '@/services/api';

interface AdminAuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  admin: any | null;
}

export function useAdminAuth() {
  const [state, setState] = useState<AdminAuthState>({
    isAuthenticated: !!localStorage.getItem('admin_token'),
    loading: false,
    error: null,
    admin: JSON.parse(localStorage.getItem('admin') || 'null'),
  });

  const login = useCallback(async (email: string, password: string): Promise<LoginResponse> => {
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const res = await adminAuthService.login(email, password);
      if (res?.admin) localStorage.setItem('admin', JSON.stringify(res.admin));
      setState({ isAuthenticated: true, loading: false, error: null, admin: res?.admin || null });
      return res;
    } catch (e: any) {
      setState((s) => ({ ...s, loading: false, error: e?.message || 'Login failed' }));
      throw e;
    }
  }, []);

  const logout = useCallback(() => {
    adminAuthService.logout();
    setState({ isAuthenticated: false, loading: false, error: null, admin: null });
  }, []);

  const value = useMemo(() => ({
    ...state,
    login,
    logout,
  }), [state, login, logout]);

  return value;
}

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/services/api', () => ({
  authService: {
    login: vi.fn(),
    signup: vi.fn(),
    logout: vi.fn(),
  },
}));

describe('useAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('returns initial state', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.loading).toBe(false);
  });

  it('logs in successfully', async () => {
    const mockResponse = {
      token: 'test-token',
      user: { id: 1, email: 'test@example.com' },
    };

    vi.mocked(require('@/services/api').authService.login).mockResolvedValue(mockResponse);

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.login('test@example.com', 'password');
    });

    await waitFor(() => {
      expect(result.current.isAuthenticated).toBe(true);
    });
  });

  it('handles login error', async () => {
    vi.mocked(require('@/services/api').authService.login).mockRejectedValue(new Error('Login failed'));

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      try {
        await result.current.login('test@example.com', 'wrong');
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.error).toBe('Login failed');
  });

  it('logs out successfully', () => {
    localStorage.setItem('auth_token', 'test-token');
    localStorage.setItem('user', JSON.stringify({ id: 1 }));

    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.logout();
    });

    expect(result.current.isAuthenticated).toBe(false);
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});





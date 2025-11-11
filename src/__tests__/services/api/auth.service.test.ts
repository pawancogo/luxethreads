import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/services/api/auth.service';

// Mock base API
vi.mock('@/services/api/base', () => ({
  api: {
    post: vi.fn(),
  },
}));

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('signs up user successfully', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1 } };
    vi.mocked(require('@/services/api/base').api.post).mockResolvedValue(mockResponse);

    const userData = {
      first_name: 'Test',
      last_name: 'User',
      email: 'test@example.com',
      phone_number: '1234567890',
      password: 'password123',
      role: 'customer',
    };

    const result = await authService.signup(userData);

    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('logs in user successfully', async () => {
    const mockResponse = { token: 'test-token', user: { id: 1 } };
    vi.mocked(require('@/services/api/base').api.post).mockResolvedValue(mockResponse);

    const result = await authService.login('test@example.com', 'password123');

    expect(result).toEqual(mockResponse);
    expect(localStorage.getItem('auth_token')).toBe('test-token');
  });

  it('logs out user', () => {
    localStorage.setItem('auth_token', 'test-token');
    authService.logout();
    expect(localStorage.getItem('auth_token')).toBeNull();
  });
});





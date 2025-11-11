import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { useContext } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { UserProvider, UserContext } from '@/contexts/UserContext';

vi.mock('@/services/api', () => ({
  authAPI: {
    login: vi.fn(),
    signup: vi.fn(),
  },
}));

describe('UserContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('provides user context', () => {
    const TestComponent = () => {
      const { user } = useContext(UserContext);
      return <div>{user ? user.email : 'No user'}</div>;
    };

    render(
      <BrowserRouter>
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('No user')).toBeInTheDocument();
  });

  it('loads user from localStorage', () => {
    const savedUser = { id: '1', email: 'test@example.com', name: 'Test', role: 'customer' };
    localStorage.setItem('user', JSON.stringify(savedUser));

    const TestComponent = () => {
      const { user } = useContext(UserContext);
      return <div>{user?.email || 'No user'}</div>;
    };

    render(
      <BrowserRouter>
        <UserProvider>
          <TestComponent />
        </UserProvider>
      </BrowserRouter>
    );

    expect(screen.getByText('test@example.com')).toBeInTheDocument();
  });
});


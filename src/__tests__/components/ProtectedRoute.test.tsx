import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import ProtectedRoute from '@/components/ProtectedRoute';
import { UserContext } from '@/contexts/UserContext';

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to {to}</div>,
  };
});

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders children when user is authenticated', () => {
    const mockUser = { id: 1, email: 'test@example.com', role: 'customer' };
    const mockValue = {
      user: mockUser,
      isLoading: false,
      hasRole: vi.fn(() => true),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects to auth when user is not authenticated', () => {
    const mockValue = {
      user: null,
      isLoading: false,
      hasRole: vi.fn(() => false),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByText(/navigate to \/auth/i)).toBeInTheDocument();
  });

  it('shows loading state when isLoading is true', () => {
    const mockValue = {
      user: null,
      isLoading: true,
      hasRole: vi.fn(() => false),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockValue}>
          <ProtectedRoute>
            <div>Protected Content</div>
          </ProtectedRoute>
        </UserContext.Provider>
      </BrowserRouter>
    );

    const spinner = document.querySelector('.animate-spin');
    expect(spinner).toBeInTheDocument();
  });

  it('shows access denied when user does not have required role', () => {
    const mockUser = { id: 1, email: 'test@example.com', role: 'customer' };
    const mockValue = {
      user: mockUser,
      isLoading: false,
      hasRole: vi.fn(() => false),
      login: vi.fn(),
      signup: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <UserContext.Provider value={mockValue}>
          <ProtectedRoute allowedRoles="supplier">
            <div>Protected Content</div>
          </ProtectedRoute>
        </UserContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});





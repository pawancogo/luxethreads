import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AdminProtectedRoute from '@/components/AdminProtectedRoute';
import { AdminContext, AdminProvider } from '@/contexts/AdminContext';

// Mock useNavigate
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    Navigate: ({ to }: { to: string }) => <div data-testid="navigate">Navigate to {to}</div>,
  };
});

describe('AdminProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('renders children when admin is authenticated', () => {
    const mockAdmin = { 
      id: '1', 
      email: 'admin@example.com', 
      role: 'super_admin' as const,
      first_name: 'Admin',
      last_name: 'User',
      full_name: 'Admin User',
      permissions: {},
    };
    const mockValue = {
      admin: mockAdmin,
      isLoading: false,
      hasRole: vi.fn(() => true),
      hasPermission: vi.fn(() => true),
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <AdminContext.Provider value={mockValue}>
          <AdminProtectedRoute>
            <div>Admin Content</div>
          </AdminProtectedRoute>
        </AdminContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });

  it('redirects to admin login when admin is not authenticated', () => {
    const mockValue = {
      admin: null,
      isLoading: false,
      hasRole: vi.fn(() => false),
      hasPermission: vi.fn(() => false),
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <AdminContext.Provider value={mockValue}>
          <AdminProtectedRoute>
            <div>Admin Content</div>
          </AdminProtectedRoute>
        </AdminContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByTestId('navigate')).toBeInTheDocument();
    expect(screen.getByText(/navigate to \/admin\/login/i)).toBeInTheDocument();
  });

  it('shows access denied when admin does not have required role', () => {
    const mockAdmin = { 
      id: '1', 
      email: 'admin@example.com', 
      role: 'product_admin' as const,
      first_name: 'Admin',
      last_name: 'User',
      full_name: 'Admin User',
      permissions: {},
    };
    const mockValue = {
      admin: mockAdmin,
      isLoading: false,
      hasRole: vi.fn(() => false),
      hasPermission: vi.fn(() => false),
      login: vi.fn(),
      logout: vi.fn(),
    };

    render(
      <BrowserRouter>
        <AdminContext.Provider value={mockValue}>
          <AdminProtectedRoute allowedRoles="super_admin">
            <div>Admin Content</div>
          </AdminProtectedRoute>
        </AdminContext.Provider>
      </BrowserRouter>
    );

    expect(screen.getByText(/access denied/i)).toBeInTheDocument();
  });
});


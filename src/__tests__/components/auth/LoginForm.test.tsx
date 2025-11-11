import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '@/components/auth/LoginForm';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    login: vi.fn(),
    isLoading: false,
  }),
}));

describe('LoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email and password inputs', () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits form with credentials', async () => {
    const mockLogin = vi.fn().mockResolvedValue({ success: true });
    vi.mocked(require('@/contexts/UserContext').useUser).mockReturnValue({
      login: mockLogin,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  it('validates required fields', async () => {
    render(
      <BrowserRouter>
        <LoginForm />
      </BrowserRouter>
    );

    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(screen.getByText(/required/i) || screen.getByText(/email/i)).toBeInTheDocument();
  });
});






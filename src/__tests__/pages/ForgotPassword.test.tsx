import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ForgotPassword from '@/pages/ForgotPassword';

vi.mock('@/services/api', () => ({
  authAPI: {
    forgotPassword: vi.fn(),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('ForgotPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders email input', () => {
    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  });

  it('submits form with email', async () => {
    vi.mocked(require('@/services/api').authAPI.forgotPassword).mockResolvedValue({});

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'test@example.com');

    const submitButton = screen.getByRole('button', { name: /send/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(require('@/services/api').authAPI.forgotPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success message after submission', async () => {
    vi.mocked(require('@/services/api').authAPI.forgotPassword).mockResolvedValue({});

    render(
      <BrowserRouter>
        <ForgotPassword />
      </BrowserRouter>
    );

    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, 'test@example.com');
    await userEvent.click(screen.getByRole('button', { name: /send/i }));

    await waitFor(() => {
      expect(screen.getByText(/email sent/i) || screen.getByText(/check your email/i)).toBeInTheDocument();
    });
  });
});





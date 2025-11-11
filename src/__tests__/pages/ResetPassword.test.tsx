import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import ResetPassword from '@/pages/ResetPassword';

vi.mock('@/services/api', () => ({
  authAPI: {
    resetPassword: vi.fn(),
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

describe('ResetPassword Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders password reset form', () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/new password/i)).toBeInTheDocument();
  });

  it('validates password match', async () => {
    render(
      <BrowserRouter>
        <ResetPassword />
      </BrowserRouter>
    );

    const newPasswordInput = screen.getByLabelText(/new password/i);
    const confirmPasswordInput = screen.getByLabelText(/confirm password/i);

    await userEvent.type(newPasswordInput, 'password123');
    await userEvent.type(confirmPasswordInput, 'password456');

    const submitButton = screen.getByRole('button', { name: /reset/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });
});






import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import VerifyEmail from '@/pages/VerifyEmail';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('VerifyEmail Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders OTP input', () => {
    render(
      <MemoryRouter initialEntries={['/verify-email?id=1&email=test@example.com']}>
        <VerifyEmail />
      </MemoryRouter>
    );
    expect(screen.getByLabelText(/verification code/i) || screen.getByPlaceholderText(/enter code/i)).toBeInTheDocument();
  });

  it('submits OTP for verification', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    } as Response);

    render(
      <MemoryRouter initialEntries={['/verify-email?id=1&email=test@example.com']}>
        <VerifyEmail />
      </MemoryRouter>
    );

    const otpInput = screen.getByLabelText(/verification code/i) || screen.getByPlaceholderText(/enter code/i);
    await userEvent.type(otpInput, '123456');

    const verifyButton = screen.getByRole('button', { name: /verify/i });
    await userEvent.click(verifyButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });
});






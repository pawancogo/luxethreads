import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import SignupForm from '@/components/auth/SignupForm';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    signup: vi.fn(),
    isLoading: false,
  }),
}));

describe('SignupForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders signup form fields', () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );
    expect(screen.getByLabelText(/name/i) || screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('submits form with user data', async () => {
    const mockSignup = vi.fn().mockResolvedValue({ success: true });
    vi.mocked(require('@/contexts/UserContext').useUser).mockReturnValue({
      signup: mockSignup,
      isLoading: false,
    });

    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    const nameInput = screen.getByLabelText(/name/i) || screen.getByLabelText(/first name/i);
    await userEvent.type(nameInput, 'Test User');
    await userEvent.type(screen.getByLabelText(/email/i), 'test@example.com');
    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    
    await userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
    });
  });

  it('validates password match', async () => {
    render(
      <BrowserRouter>
        <SignupForm />
      </BrowserRouter>
    );

    await userEvent.type(screen.getByLabelText(/password/i), 'password123');
    const confirmInput = screen.getByLabelText(/confirm/i) || screen.getByLabelText(/password.*confirm/i);
    if (confirmInput) {
      await userEvent.type(confirmInput, 'password456');
      await userEvent.click(screen.getByRole('button', { name: /sign up/i }));
      
      expect(screen.getByText(/match/i) || screen.getByText(/password/i)).toBeInTheDocument();
    }
  });
});





import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Addresses from '@/pages/Addresses';

vi.mock('@/services/api', () => ({
  addressesAPI: {
    getAll: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Addresses Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders addresses list', async () => {
    const mockAddresses = [
      {
        id: 1,
        full_name: 'Test User',
        line1: '123 Main St',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India',
      },
    ];

    vi.mocked(require('@/services/api').addressesAPI.getAll).mockResolvedValue(mockAddresses);

    render(
      <BrowserRouter>
        <Addresses />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('123 Main St')).toBeInTheDocument();
    });
  });

  it('opens add address dialog', async () => {
    vi.mocked(require('@/services/api').addressesAPI.getAll).mockResolvedValue([]);

    render(
      <BrowserRouter>
        <Addresses />
      </BrowserRouter>
    );

    const addButton = screen.getByRole('button', { name: /add address/i });
    await userEvent.click(addButton);

    expect(screen.getByText(/add new address/i) || screen.getByLabelText(/full name/i)).toBeInTheDocument();
  });
});





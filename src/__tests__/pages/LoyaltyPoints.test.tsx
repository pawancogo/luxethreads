import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoyaltyPoints from '@/pages/LoyaltyPoints';

vi.mock('@/services/api', () => ({
  loyaltyPointsAPI: {
    getBalance: vi.fn(),
    getTransactions: vi.fn(),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('LoyaltyPoints Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loyalty points balance', async () => {
    const mockBalance = {
      balance: 1000,
      available_balance: 800,
      pending_expiry: 200,
    };

    vi.mocked(require('@/services/api').loyaltyPointsAPI.getBalance).mockResolvedValue({
      data: { success: true, data: mockBalance },
    });

    render(
      <BrowserRouter>
        <LoyaltyPoints />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/1000/i) || screen.getByText(/loyalty points/i)).toBeInTheDocument();
    });
  });
});





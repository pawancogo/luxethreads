import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import SupportTickets from '@/pages/SupportTickets';

vi.mock('@/services/api', () => ({
  supportTicketsAPI: {
    getMyTickets: vi.fn(),
    createTicket: vi.fn(),
  },
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('SupportTickets Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders support tickets', async () => {
    const mockTickets = [
      {
        id: 1,
        ticket_id: 'TKT-001',
        subject: 'Test Ticket',
        status: 'open',
        category: 'general',
      },
    ];

    vi.mocked(require('@/services/api').supportTicketsAPI.getMyTickets).mockResolvedValue(mockTickets);

    render(
      <BrowserRouter>
        <SupportTickets />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText(/test ticket/i) || screen.getByText(/TKT-001/i)).toBeInTheDocument();
    });
  });
});





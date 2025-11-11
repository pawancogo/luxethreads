import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Notifications from '@/pages/Notifications';

vi.mock('@/contexts/NotificationContext', () => ({
  useNotifications: () => ({
    notifications: [
      {
        id: 1,
        type: 'order_update',
        title: 'Order Shipped',
        message: 'Your order has been shipped',
        read: false,
        created_at: new Date().toISOString(),
      },
    ],
    unreadCount: 1,
    isLoading: false,
    fetchNotifications: vi.fn(),
    markAsRead: vi.fn(),
    markAllAsRead: vi.fn(),
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('Notifications Page', () => {
  it('renders notifications', () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    );
    expect(screen.getByText(/order shipped/i)).toBeInTheDocument();
  });

  it('shows unread count', () => {
    render(
      <BrowserRouter>
        <Notifications />
      </BrowserRouter>
    );
    expect(screen.getByText(/1/i)).toBeInTheDocument();
  });
});





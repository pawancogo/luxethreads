import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NavActions from '@/components/navbar/NavActions';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, email: 'test@example.com' },
    isLoading: false,
  }),
}));

vi.mock('@/contexts/CartContext', () => ({
  useCart: () => ({
    itemCount: 2,
  }),
}));

describe('NavActions', () => {
  it('renders cart icon with count', () => {
    render(
      <BrowserRouter>
        <NavActions />
      </BrowserRouter>
    );
    expect(screen.getByText('2') || document.querySelector('[aria-label*="cart"]')).toBeInTheDocument();
  });

  it('renders user menu when logged in', () => {
    render(
      <BrowserRouter>
        <NavActions />
      </BrowserRouter>
    );
    expect(screen.getByText(/test@example.com/i) || document.querySelector('[aria-label*="user"]')).toBeInTheDocument();
  });
});






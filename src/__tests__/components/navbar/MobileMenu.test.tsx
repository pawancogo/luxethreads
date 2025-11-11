import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import MobileMenu from '@/components/navbar/MobileMenu';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: null,
    isLoading: false,
  }),
}));

describe('MobileMenu', () => {
  it('renders mobile menu button', () => {
    render(
      <BrowserRouter>
        <MobileMenu />
      </BrowserRouter>
    );
    expect(screen.getByRole('button') || document.querySelector('[aria-label*="menu"]')).toBeInTheDocument();
  });

  it('opens menu on click', async () => {
    render(
      <BrowserRouter>
        <MobileMenu />
      </BrowserRouter>
    );
    
    const menuButton = screen.getByRole('button');
    await userEvent.click(menuButton);
    
    expect(screen.getByText(/home/i) || screen.getByText(/products/i)).toBeInTheDocument();
  });
});






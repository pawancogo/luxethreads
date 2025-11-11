import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import DesktopNavigation from '@/components/navbar/DesktopNavigation';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: null,
    isLoading: false,
  }),
}));

describe('DesktopNavigation', () => {
  it('renders navigation links', () => {
    render(
      <BrowserRouter>
        <DesktopNavigation />
      </BrowserRouter>
    );
    expect(screen.getByText(/home/i) || screen.getByText(/products/i)).toBeInTheDocument();
  });

  it('renders login link when user not logged in', () => {
    render(
      <BrowserRouter>
        <DesktopNavigation />
      </BrowserRouter>
    );
    expect(screen.getByText(/login/i) || screen.getByText(/sign in/i)).toBeInTheDocument();
  });
});






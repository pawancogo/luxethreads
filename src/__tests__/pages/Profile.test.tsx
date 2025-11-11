import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Profile from '@/pages/Profile';

vi.mock('@/contexts/UserContext', () => ({
  useUser: () => ({
    user: { id: 1, name: 'Test User', email: 'test@example.com', phone: '1234567890' },
    isLoading: false,
  }),
}));

vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('@/services/api', () => ({
  usersAPI: {
    updateProfile: vi.fn(),
  },
}));

describe('Profile Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders user profile information', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('enables edit mode when edit button clicked', async () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);
    
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
  });

  it('saves profile changes', async () => {
    vi.mocked(require('@/services/api').usersAPI.updateProfile).mockResolvedValue({});

    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );
    
    const editButton = screen.getByRole('button', { name: /edit/i });
    await userEvent.click(editButton);
    
    const nameInput = screen.getByDisplayValue('Test User');
    await userEvent.clear(nameInput);
    await userEvent.type(nameInput, 'Updated Name');
    
    const saveButton = screen.getByRole('button', { name: /save/i });
    await userEvent.click(saveButton);
    
    await waitFor(() => {
      expect(require('@/services/api').usersAPI.updateProfile).toHaveBeenCalled();
    });
  });
});





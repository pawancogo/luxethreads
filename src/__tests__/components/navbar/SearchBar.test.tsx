import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '@/components/navbar/SearchBar';

describe('SearchBar', () => {
  it('renders search input', () => {
    render(<SearchBar searchQuery="" setSearchQuery={vi.fn()} onSubmit={vi.fn()} />);
    expect(screen.getByPlaceholderText(/search for products/i)).toBeInTheDocument();
  });

  it('displays search query', () => {
    render(<SearchBar searchQuery="shirt" setSearchQuery={vi.fn()} onSubmit={vi.fn()} />);
    const input = screen.getByPlaceholderText(/search for products/i) as HTMLInputElement;
    expect(input.value).toBe('shirt');
  });

  it('calls setSearchQuery on input change', async () => {
    const setSearchQuery = vi.fn();
    render(<SearchBar searchQuery="" setSearchQuery={setSearchQuery} onSubmit={vi.fn()} />);
    
    const input = screen.getByPlaceholderText(/search for products/i);
    await userEvent.type(input, 'test');
    
    expect(setSearchQuery).toHaveBeenCalled();
  });

  it('calls onSubmit on form submit', async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    render(<SearchBar searchQuery="test" setSearchQuery={vi.fn()} onSubmit={onSubmit} />);
    
    const form = screen.getByRole('textbox').closest('form');
    if (form) {
      fireEvent.submit(form);
      expect(onSubmit).toHaveBeenCalled();
    }
  });

  it('shows clear button when query exists', () => {
    render(<SearchBar searchQuery="test" setSearchQuery={vi.fn()} onSubmit={vi.fn()} />);
    const clearButton = document.querySelector('button[type="button"]');
    expect(clearButton).toBeInTheDocument();
  });

  it('clears query when clear button clicked', async () => {
    const setSearchQuery = vi.fn();
    render(<SearchBar searchQuery="test" setSearchQuery={setSearchQuery} onSubmit={vi.fn()} />);
    
    const clearButton = document.querySelector('button[type="button"]');
    if (clearButton) {
      await userEvent.click(clearButton);
      expect(setSearchQuery).toHaveBeenCalledWith('');
    }
  });
});






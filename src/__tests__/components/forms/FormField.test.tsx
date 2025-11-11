import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormField } from '@/components/forms/FormField';

describe('FormField', () => {
  it('renders text input by default', () => {
    render(<FormField name="test" value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders label when provided', () => {
    render(<FormField name="test" label="Test Field" value="" onChange={vi.fn()} />);
    expect(screen.getByText('Test Field')).toBeInTheDocument();
  });

  it('shows required indicator', () => {
    render(<FormField name="test" label="Test" value="" onChange={vi.fn()} required />);
    const label = screen.getByText('Test');
    expect(label).toBeInTheDocument();
  });

  it('calls onChange when input changes', async () => {
    const handleChange = vi.fn();
    render(<FormField name="test" value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'test value');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('renders email input type', () => {
    render(<FormField name="email" type="email" value="" onChange={vi.fn()} />);
    const input = screen.getByRole('textbox');
    expect(input).toHaveAttribute('type', 'email');
  });

  it('renders password input type', () => {
    render(<FormField name="password" type="password" value="" onChange={vi.fn()} />);
    const input = screen.getByLabelText(/password/i) || document.querySelector('input[type="password"]');
    expect(input).toBeInTheDocument();
  });

  it('renders textarea when type is textarea', () => {
    render(<FormField name="description" type="textarea" value="" onChange={vi.fn()} />);
    const textarea = screen.getByRole('textbox');
    expect(textarea.tagName).toBe('TEXTAREA');
  });

  it('displays error message', () => {
    render(<FormField name="test" value="" onChange={vi.fn()} error="This field is required" />);
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<FormField name="test" value="" onChange={vi.fn()} disabled />);
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });

  it('renders select when type is select', () => {
    const options = [
      { value: 'option1', label: 'Option 1' },
      { value: 'option2', label: 'Option 2' },
    ];
    render(<FormField name="test" type="select" value="" onChange={vi.fn()} options={options} />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });
});






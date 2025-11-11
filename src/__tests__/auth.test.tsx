import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { LoginForm } from '../components/auth/LoginForm';
import { SignupForm } from '../components/auth/SignupForm';
import * as authAPI from '../services/api/auth.service';

// Mock the API service
vi.mock('../services/api/auth.service');

describe('Authentication Components', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('LoginForm', () => {
    it('renders login form with email and password fields', () => {
      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    });

    it('validates required fields', async () => {
      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      const submitButton = screen.getByRole('button', { name: /login/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      });
    });

    it('submits form with valid credentials', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        success: true,
        data: { token: 'test-token', user: { id: 1, email: 'test@example.com' } }
      });
      vi.mocked(authAPI.login).mockImplementation(mockLogin);

      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123'
        });
      });
    });

    it('displays error message on login failure', async () => {
      const mockLogin = vi.fn().mockRejectedValue({
        response: { data: { error: 'Invalid credentials' } }
      });
      vi.mocked(authAPI.login).mockImplementation(mockLogin);

      render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrongpassword' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('SignupForm', () => {
    it('renders signup form with all required fields', () => {
      render(
        <BrowserRouter>
          <SignupForm />
        </BrowserRouter>
      );

      expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
    });

    it('validates password confirmation match', async () => {
      render(
        <BrowserRouter>
          <SignupForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'different' }
      });

      const submitButton = screen.getByRole('button', { name: /sign up/i });
      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
    });

    it('submits form with valid data', async () => {
      const mockSignup = vi.fn().mockResolvedValue({
        success: true,
        data: { token: 'test-token', user: { id: 1 } }
      });
      vi.mocked(authAPI.signup).mockImplementation(mockSignup);

      render(
        <BrowserRouter>
          <SignupForm />
        </BrowserRouter>
      );

      fireEvent.change(screen.getByLabelText(/first name/i), {
        target: { value: 'John' }
      });
      fireEvent.change(screen.getByLabelText(/last name/i), {
        target: { value: 'Doe' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'john@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'password123' }
      });

      fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

      await waitFor(() => {
        expect(mockSignup).toHaveBeenCalled();
      });
    });
  });
});





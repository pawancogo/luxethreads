/**
 * Authentication API Service
 * Handles user and admin authentication
 */

import { api } from './base';

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  token?: string;
  user?: any;
  admin?: any;
}

export const authService = {
  /**
   * User signup
   */
  signup: async (userData: SignupData): Promise<LoginResponse> => {
    const response = await api.post('/signup', { user: userData });
    if (response?.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  /**
   * User login
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/login', { email, password });
    if (response?.token) {
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  /**
   * User logout
   */
  logout: (): void => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string): Promise<any> => {
    return api.post('/password/forgot', { email });
  },

  /**
   * Reset password
   */
  resetPassword: async (
    email: string,
    tempPassword: string,
    newPassword: string,
    passwordConfirmation?: string
  ): Promise<any> => {
    return api.post('/password/reset', {
      email,
      temp_password: tempPassword,
      new_password: newPassword,
      password_confirmation: passwordConfirmation || newPassword,
    });
  },
};

export const adminAuthService = {
  /**
   * Admin login
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const response = await api.post('/admin/login', { email, password });
    if (response?.token) {
      localStorage.setItem('admin_token', response.token);
      if (response?.admin) {
        localStorage.setItem('admin', JSON.stringify(response.admin));
      }
    }
    return response;
  },

  /**
   * Admin logout
   */
  logout: (): void => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
  },
};


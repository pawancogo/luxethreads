/**
 * Authentication API Service
 * Handles user authentication (cookies-based, no localStorage)
 * Note: Admin login is not handled in frontend
 */

import { api } from './base';
import { getDeviceInfo } from '@/utils/deviceInfo';

export interface SignupData {
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  password: string;
  role: string;
}

export interface LoginResponse {
  user?: any;
}

export const authService = {
  /**
   * User signup
   * Token is stored in httpOnly cookie automatically
   */
  signup: async (userData: SignupData): Promise<LoginResponse> => {
    try {
      const response = await api.post('/signup', { user: userData });
      // Token is in httpOnly cookie, not in response
      return response as LoginResponse;
    } catch (error: any) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[authService] Signup error:', {
          message: error?.message,
          responseData: error?.response?.data,
          status: error?.response?.status
        });
      }
      throw error;
    }
  },

  /**
   * User login
   * Token is stored in httpOnly cookie automatically
   */
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const deviceInfo = getDeviceInfo();
    const response = await api.post('/login', { 
      email, 
      password,
      ...deviceInfo
    });
    // Token is in httpOnly cookie, not in response
    return response as LoginResponse;
  },

  /**
   * User logout
   * Clears httpOnly cookie on server
   */
  logout: async (): Promise<void> => {
    await api.delete('/logout');
    // Cookie is cleared by server
  },

  /**
   * Forgot password
   */
  forgotPassword: async (email: string): Promise<any> => {
    return api.post('/password/forgot', { email });
  },

  /**
   * Reset password (token-based)
   */
  resetPassword: async (
    token: string,
    password: string,
    passwordConfirmation?: string
  ): Promise<any> => {
    return api.post('/password/reset', {
      token,
      password,
      password_confirmation: passwordConfirmation || password,
    });
  },
};

// Admin authentication is handled by backend HTML interface only
// No admin services needed in frontend


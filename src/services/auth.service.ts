/**
 * Auth Service - Business Logic Layer
 * Handles authentication operations beyond basic login/signup
 * Follows Single Responsibility Principle
 */

import { authService } from './api/auth.service';

/**
 * Auth Service - Business logic for authentication operations
 */
export class AuthService {
  /**
   * Request password reset
   * Always shows success message to prevent email enumeration
   */
  async forgotPassword(email: string): Promise<void> {
    try {
      await authService.forgotPassword(email.trim());
    } catch (error) {
      // Even on error, don't reveal if email exists (security best practice)
      // The error is silently handled to prevent email enumeration
    }
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    token: string,
    password: string,
    passwordConfirmation?: string
  ): Promise<void> {
    if (!token) {
      throw new Error('Invalid reset link. The password reset link is invalid or has expired.');
    }

    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long.');
    }

    if (password !== (passwordConfirmation || password)) {
      throw new Error('Passwords do not match.');
    }

    try {
      await authService.resetPassword(token, password, passwordConfirmation);
    } catch (error: any) {
      const errorMsg = error?.message || 'Failed to reset password. The link may have expired.';
      throw new Error(errorMsg);
    }
  }

  /**
   * Validate password strength
   */
  validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const authService = new AuthService();


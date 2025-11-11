/**
 * Email Verification Service - Business Logic Layer
 * Handles email verification operations and business rules
 * Follows Single Responsibility Principle
 */

import { emailVerificationService as emailVerificationAPI } from './api/email-verification.service';
import { userService } from './user.service';

export interface VerificationResult {
  success: boolean;
  message: string;
  redirectPath?: string;
}

/**
 * Email Verification Service - Business logic for email verification
 */
export class EmailVerificationService {
  /**
   * Verify email with token
   */
  async verify(token: string): Promise<VerificationResult> {
    try {
      await emailVerificationAPI.verify(token);
      
      // Clear verification requirements from sessionStorage
      sessionStorage.removeItem('requires_verification');
      
      return {
        success: true,
        message: 'Your email has been successfully verified.',
      };
    } catch (error: any) {
      const errorMsg = error?.message || 'Verification failed. The link may have expired. Please request a new one.';
      throw new Error(errorMsg);
    }
  }

  /**
   * Resend verification email
   * Handles both authenticated and unauthenticated cases
   */
  async resend(email?: string): Promise<void> {
    try {
      // Check if user is logged in
      const currentUser = await userService.getCurrentUser();
      
      if (currentUser) {
        // Use authenticated endpoint
        await emailVerificationAPI.resendAuthenticated();
      } else if (email) {
        // Use public endpoint with email
        await emailVerificationAPI.resend(email);
      } else {
        throw new Error('Email address is required to resend verification');
      }
    } catch (error: any) {
      throw new Error(error?.message || 'Failed to send verification email. Please try again later.');
    }
  }

  /**
   * Get redirect path based on user role
   */
  getRedirectPath(userRole?: string): string {
    if (userRole === 'supplier') {
      return '/supplier';
    }
    return '/';
  }

  /**
   * Get login redirect path
   */
  getLoginRedirectPath(): string {
    return '/auth';
  }
}

// Export singleton instance
export const emailVerificationService = new EmailVerificationService();


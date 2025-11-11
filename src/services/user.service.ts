/**
 * User Service - Business Logic Layer
 * Handles user data transformation and business rules
 * Follows Single Responsibility Principle
 */

import { authService } from './api/auth.service';
import { usersService } from './api/users.service';
import type { User, UserRole } from '@/stores/userStore';

export interface BackendUserData {
  id?: string | number;
  email?: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  role?: string;
  company_name?: string;
  tax_id?: string;
  gst_number?: string;
  phone_number?: string;
  phone?: string;
  is_active?: boolean;
  email_verified?: boolean;
}

/**
 * Maps backend user data to frontend User model
 */
export function mapBackendUserToUser(backendData: BackendUserData | null, fallbackEmail?: string): User | null {
  if (!backendData) return null;

  const id = backendData.id?.toString() || '';
  const email = backendData.email || fallbackEmail || '';
  
  // Build name from available fields
  const name = backendData.full_name ||
    `${backendData.first_name || ''} ${backendData.last_name || ''}`.trim() ||
    email.split('@')[0] ||
    '';

  return {
    id,
    name,
    email,
    role: backendData.role === 'supplier' ? 'supplier' : 'customer',
    companyName: backendData.company_name,
    taxId: backendData.tax_id || backendData.gst_number,
    phone: backendData.phone_number || backendData.phone,
    is_active: backendData.is_active !== false,
    email_verified: backendData.email_verified || false,
  };
}

/**
 * User Service - Business logic for user operations
 */
export class UserService {
  /**
   * Login user
   */
  async login(email: string, password: string): Promise<{ success: boolean; error?: Error; user?: User }> {
    try {
      const response = await authService.login(email, password);
      const userData = (response as any)?.user;

      if (!userData) {
        throw new Error('Invalid login response: user data not found');
      }

      const user = mapBackendUserToUser(userData, email);
      if (!user) {
        throw new Error('Failed to map user data');
      }

      sessionStorage.setItem('user_logged_in', 'true');
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error as Error };
    }
  }

  /**
   * Signup user
   */
  async signup(
    name: string,
    email: string,
    password: string,
    role: UserRole = 'customer',
    companyName?: string,
    taxId?: string,
    phone?: string,
    firstName?: string,
    lastName?: string
  ): Promise<{ success: boolean; error?: Error; user?: User }> {
    try {
      const nameParts = name.split(' ');
      const first_name = firstName || nameParts[0] || name;
      const last_name = lastName || nameParts.slice(1).join(' ') || '';

      const userData = {
        first_name,
        last_name,
        email,
        phone_number: phone || '',
        password,
        role: role === 'supplier' ? 'supplier' : 'customer',
      };

      const response = await authService.signup(userData);
      const userResponse = (response as any)?.user;

      if (!userResponse || !userResponse.id) {
        throw new Error('Invalid signup response: user data not found');
      }

      const user = mapBackendUserToUser(userResponse, email);
      if (!user) {
        throw new Error('Failed to map user data');
      }

      // Add supplier-specific fields
      if (role === 'supplier') {
        user.companyName = companyName;
        user.taxId = taxId;
      }

      sessionStorage.setItem('user_logged_in', 'true');
      return { success: true, user };
    } catch (error: any) {
      return {
        success: false,
        error: error as Error,
      };
    }
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await authService.logout();
    } catch (error) {
      // Log error but don't throw - still clear local state
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('Logout error:', error);
      }
    } finally {
      sessionStorage.removeItem('user_logged_in');
    }
  }

  /**
   * Get current user from API
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const userData = await usersService.getCurrentUser();
      // Response is transformed by interceptor
      const backendData = (userData as any)?.data || userData;
      return mapBackendUserToUser(backendData);
    } catch (error: any) {
      // Handle 401 - user not authenticated
      if (error?.response?.status === 401) {
        sessionStorage.removeItem('user_logged_in');
      }
      return null;
    }
  }

  /**
   * Refresh user data
   */
  async refreshUser(currentUser: User | null): Promise<User | null> {
    try {
      const userData = await usersService.getCurrentUser();
      const backendData = (userData as any)?.data || userData;

      if (!backendData) {
        return currentUser;
      }

      return mapBackendUserToUser(backendData);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        return null;
      }
      return currentUser;
    }
  }

  /**
   * Update user profile
   */
  async updateProfile(
    userId: string,
    updateData: {
      first_name?: string;
      last_name?: string;
      phone_number?: string;
      current_password?: string;
      password?: string;
      password_confirmation?: string;
    }
  ): Promise<User | null> {
    try {
      await usersService.updateUser(userId, updateData);
      // Refresh user data after update
      return await this.getCurrentUser();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Split full name into first and last name
   */
  splitName(fullName: string): { first_name: string; last_name: string } {
    const nameParts = fullName.trim().split(' ');
    return {
      first_name: nameParts[0] || fullName,
      last_name: nameParts.slice(1).join(' ') || nameParts[0] || '',
    };
  }

  /**
   * Check if user has required role(s)
   */
  hasRole(user: User | null, roles: UserRole | UserRole[]): boolean {
    if (!user) return false;
    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
  }
}

export const userService = new UserService();


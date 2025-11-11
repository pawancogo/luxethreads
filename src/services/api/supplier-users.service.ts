/**
 * Supplier Team Management API Service
 */

import { api } from './base';

export interface SupplierUserData {
  email: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  permissions?: {
    can_manage_products?: boolean;
    can_manage_orders?: boolean;
    can_view_financials?: boolean;
    can_manage_users?: boolean;
    can_manage_settings?: boolean;
    can_view_analytics?: boolean;
  };
}

export const supplierUsersService = {
  /**
   * List team members
   */
  getUsers: async () => {
    return api.get('/supplier/users');
  },

  /**
   * Get team member
   */
  getUser: async (userId: string | number) => {
    return api.get(`/supplier/users/${userId}`);
  },

  /**
   * Create team member
   */
  createUser: async (userData: SupplierUserData) => {
    return api.post('/supplier/users', { user: userData });
  },

  /**
   * Invite team member
   */
  inviteUser: async (userData: SupplierUserData) => {
    return api.post('/supplier/users/invite', userData);
  },

  /**
   * Update team member
   */
  updateUser: async (userId: string | number, userData: Partial<SupplierUserData>) => {
    return api.patch(`/supplier/users/${userId}`, { user: userData });
  },

  /**
   * Delete team member
   */
  deleteUser: async (userId: string | number) => {
    return api.delete(`/supplier/users/${userId}`);
  },

  /**
   * Resend invitation
   */
  resendInvitation: async (userId: string | number) => {
    return api.post(`/supplier/users/${userId}/resend_invitation`);
  },
};


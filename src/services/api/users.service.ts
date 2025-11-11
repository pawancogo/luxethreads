/**
 * Users API Service
 * Handles user profile, statistics, activity, and search history
 */

import { api } from './base';

export interface UserUpdateData {
  first_name?: string;
  last_name?: string;
  phone_number?: string;
  current_password?: string;
  password?: string;
  password_confirmation?: string;
}

export interface SearchData {
  query: string;
  filters?: Record<string, any>;
}

export const usersService = {
  /**
   * Get current authenticated user
   */
  getCurrentUser: async () => {
    return api.get('/users/me');
  },

  /**
   * Get user by ID
   */
  getUser: async (userId: string | number) => {
    return api.get(`/users/${userId}`);
  },

  /**
   * Update user profile
   */
  updateUser: async (userId: string | number, userData: UserUpdateData) => {
    return api.patch(`/users/${userId}`, { user: userData });
  },

  /**
   * Delete user account
   */
  deleteUser: async (userId: string | number) => {
    return api.delete(`/users/${userId}`);
  },

  /**
   * Bulk delete users
   */
  bulkDelete: async (userIds: (string | number)[]) => {
    return api.post('/users/bulk_delete', { user_ids: userIds });
  },

  /**
   * Get user statistics
   */
  getStatistics: async () => {
    return api.get('/user/statistics');
  },

  /**
   * Get user activity
   */
  getActivity: async () => {
    return api.get('/user/activity');
  },

  /**
   * Get search history
   */
  getSearches: async () => {
    return api.get('/user/searches');
  },

  /**
   * Save search
   */
  saveSearch: async (searchData: SearchData) => {
    return api.post('/user/searches', searchData);
  },

  /**
   * Delete search
   */
  deleteSearch: async (searchId: number) => {
    return api.delete(`/user/searches/${searchId}`);
  },

  /**
   * Clear all searches
   */
  clearSearches: async () => {
    return api.delete('/user/searches/clear');
  },

  /**
   * Get popular searches
   */
  getPopularSearches: async () => {
    return api.get('/user/searches/popular');
  },
};


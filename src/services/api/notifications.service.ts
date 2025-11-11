/**
 * Notifications API Service
 */

import { api } from './base';

export interface NotificationPreferences {
  email?: Record<string, boolean>;
  sms?: Record<string, boolean>;
  push?: Record<string, boolean>;
}

export const notificationsService = {
  /**
   * Get notifications
   */
  getNotifications: async (params?: {
    is_read?: boolean;
    notification_type?: string;
    limit?: number;
    offset?: number;
  }) => {
    return api.get('/notifications', { params });
  },

  /**
   * Get notification
   */
  getNotification: async (notificationId: number) => {
    return api.get(`/notifications/${notificationId}`);
  },

  /**
   * Mark as read
   */
  markAsRead: async (notificationId: number) => {
    return api.patch(`/notifications/${notificationId}/mark_as_read`);
  },

  /**
   * Mark all as read
   */
  markAllAsRead: async () => {
    return api.patch('/notifications/mark_all_read');
  },

  /**
   * Get unread count
   */
  getUnreadCount: async () => {
    return api.get('/notifications/unread_count');
  },

  /**
   * Get notification preferences
   */
  getPreferences: async () => {
    return api.get('/notification_preferences');
  },

  /**
   * Update notification preferences
   */
  updatePreferences: async (preferences: NotificationPreferences) => {
    return api.patch('/notification_preferences', { preferences });
  },
};


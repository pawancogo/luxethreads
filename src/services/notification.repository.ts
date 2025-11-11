/**
 * Notification Repository - Data Access Layer
 * Abstracts API calls for notification operations
 * Follows Repository Pattern
 */

import { notificationsService } from './api/notifications.service';

export interface GetNotificationsParams {
  is_read?: boolean;
  notification_type?: string;
  limit?: number;
  offset?: number;
}

/**
 * Notification Repository - Handles data access for notifications
 */
export class NotificationRepository {
  /**
   * Get notifications from API
   */
  async getNotifications(params?: GetNotificationsParams): Promise<any> {
    try {
      return await notificationsService.getNotifications(params);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get unread count from API
   */
  async getUnreadCount(): Promise<any> {
    try {
      return await notificationsService.getUnreadCount();
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: number): Promise<void> {
    try {
      await notificationsService.markAsRead(notificationId);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    try {
      await notificationsService.markAllAsRead();
    } catch (error) {
      throw error;
    }
  }
}

export const notificationRepository = new NotificationRepository();


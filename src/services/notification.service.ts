/**
 * Notification Service - Business Logic Layer
 * Handles notification operations and business rules
 * Follows Single Responsibility Principle
 */

import { NotificationRepository } from './notification.repository';
import { NotificationMapper, Notification } from './notification.mapper';

/**
 * Notification Service - Business logic for notification operations
 */
export class NotificationService {
  private repository: NotificationRepository;
  private mapper: NotificationMapper;

  constructor(repository?: NotificationRepository) {
    this.repository = repository || new NotificationRepository();
    this.mapper = new NotificationMapper();
  }

  /**
   * Check if user is authenticated
   */
  private isUserAuthenticated(): boolean {
    return sessionStorage.getItem('user_logged_in') === 'true';
  }

  /**
   * Handle authentication error
   */
  private handleAuthError(): void {
    sessionStorage.removeItem('user_logged_in');
  }

  /**
   * Fetch notifications
   */
  async fetchNotifications(limit: number = 50): Promise<Notification[]> {
    if (!this.isUserAuthenticated()) {
      return [];
    }

    try {
      const response = await this.repository.getNotifications({ limit });
      return this.mapper.mapApiResponseToNotifications(response);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        this.handleAuthError();
      }
      throw error;
    }
  }

  /**
   * Fetch unread count
   */
  async fetchUnreadCount(): Promise<number> {
    if (!this.isUserAuthenticated()) {
      return 0;
    }

    try {
      const response = await this.repository.getUnreadCount();
      return this.mapper.mapApiResponseToUnreadCount(response);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        this.handleAuthError();
        return 0;
      }
      throw error;
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(
    notificationId: number,
    currentNotifications: Notification[]
  ): Promise<Notification[]> {
    if (!this.isUserAuthenticated()) {
      return currentNotifications;
    }

    try {
      await this.repository.markAsRead(notificationId);
      return this.mapper.markNotificationAsRead(currentNotifications, notificationId);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        this.handleAuthError();
      }
      throw error;
    }
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(
    currentNotifications: Notification[]
  ): Promise<Notification[]> {
    if (!this.isUserAuthenticated()) {
      return currentNotifications;
    }

    try {
      await this.repository.markAllAsRead();
      return this.mapper.markAllNotificationsAsRead(currentNotifications);
    } catch (error: any) {
      if (error?.response?.status === 401) {
        this.handleAuthError();
      }
      throw error;
    }
  }

  /**
   * Calculate unread count from notifications
   */
  calculateUnreadCount(notifications: Notification[]): number {
    return notifications.filter(n => !n.is_read).length;
  }

  /**
   * Update unread count after marking as read
   */
  updateUnreadCountAfterMark(
    currentCount: number,
    decrement: number = 1
  ): number {
    return Math.max(0, currentCount - decrement);
  }
}

export const notificationService = new NotificationService();


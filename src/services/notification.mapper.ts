/**
 * Notification Mapper - Data Transformation Layer
 * Maps API responses to application models
 * Follows Single Responsibility Principle
 */

export interface Notification {
  id: number;
  title: string;
  message: string;
  notification_type: 'order_update' | 'payment' | 'promotion' | 'review' | 'system' | 'shipping';
  data: Record<string, any>;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface ApiNotificationResponse {
  data?: {
    success?: boolean;
    data?: Notification[];
  };
}

export interface ApiUnreadCountResponse {
  data?: {
    success?: boolean;
    data?: {
      count?: number;
    };
  };
}

/**
 * Notification Mapper - Transforms API responses to application models
 */
export class NotificationMapper {
  /**
   * Map API response to Notification array
   */
  mapApiResponseToNotifications(response: ApiNotificationResponse): Notification[] {
    if (response.data?.success && response.data?.data) {
      return response.data.data;
    }
    return [];
  }

  /**
   * Map API response to unread count
   */
  mapApiResponseToUnreadCount(response: ApiUnreadCountResponse): number {
    if (response.data?.success && response.data?.data) {
      return response.data.data.count || 0;
    }
    return 0;
  }

  /**
   * Update notification to read state
   */
  markNotificationAsRead(
    notifications: Notification[],
    notificationId: number
  ): Notification[] {
    return notifications.map(n =>
      n.id === notificationId
        ? { ...n, is_read: true, read_at: new Date().toISOString() }
        : n
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllNotificationsAsRead(notifications: Notification[]): Notification[] {
    return notifications.map(n => ({
      ...n,
      is_read: true,
      read_at: new Date().toISOString(),
    }));
  }
}

export const notificationMapper = new NotificationMapper();


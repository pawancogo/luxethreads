/**
 * Notification Store - Zustand implementation
 * Performance optimized with selectors
 * Replaces NotificationContext
 */

import { create } from 'zustand';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { notificationService } from '@/services/notification.service';
import { Notification } from '@/services/notification.mapper';

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  // Actions
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const fetchedNotifications = await notificationService.fetchNotifications(50);
      set({ notifications: fetchedNotifications });
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
      set({ notifications: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const count = await notificationService.fetchUnreadCount();
      set({ unreadCount: count });
    } catch (error) {
      console.error('Failed to fetch unread count:', error);
      set({ unreadCount: 0 });
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      const { notifications } = get();
      const updatedNotifications = await notificationService.markAsRead(
        notificationId,
        notifications
      );
      set({ notifications: updatedNotifications });
      set((state) => ({
        unreadCount: notificationService.updateUnreadCountAfterMark(state.unreadCount, 1),
      }));
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
      throw error;
    }
  },

  markAllAsRead: async () => {
    try {
      const { notifications } = get();
      const updatedNotifications = await notificationService.markAllAsRead(notifications);
      set({ notifications: updatedNotifications, unreadCount: 0 });
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
      throw error;
    }
  },

  refreshNotifications: async () => {
    await Promise.all([
      get().fetchNotifications(),
      get().fetchUnreadCount(),
    ]);
  },
}));

/**
 * Notification Hook - Provides same API as NotificationContext
 * Auto-initializes on mount
 */
export const useNotifications = () => {
  const store = useNotificationStore();
  const { toast } = useToast();

  useEffect(() => {
    const hasLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';

    if (!hasLoggedIn) {
      store.setState({ notifications: [], unreadCount: 0 });
      return;
    }

    store.refreshNotifications().catch(() => {
      store.setState({ notifications: [], unreadCount: 0 });
    });

    const interval = setInterval(() => {
      const stillLoggedIn = sessionStorage.getItem('user_logged_in') === 'true';
      if (!stillLoggedIn) {
        clearInterval(interval);
        store.setState({ notifications: [], unreadCount: 0 });
        return;
      }
      store.fetchUnreadCount().catch(() => {
        clearInterval(interval);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Wrap actions with toast notifications
  const markAsRead = async (notificationId: number) => {
    try {
      await store.markAsRead(notificationId);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        variant: 'destructive',
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await store.markAllAsRead();
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        variant: 'destructive',
      });
    }
  };

  return {
    ...store,
    markAsRead,
    markAllAsRead,
  };
};

/**
 * Performance-optimized selectors
 */
export const useNotificationList = () => useNotificationStore((state) => state.notifications);
export const useUnreadCount = () => useNotificationStore((state) => state.unreadCount);
export const useNotificationLoading = () => useNotificationStore((state) => state.isLoading);


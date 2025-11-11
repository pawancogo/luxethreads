import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCheck, Loader2, Package, CreditCard, Gift, MessageSquare, Settings, Truck } from 'lucide-react';
import { useNotifications, useNotificationList, useUnreadCount, useNotificationLoading } from '@/stores/notificationStore';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'order_update':
      return <Package className="h-5 w-5" />;
    case 'payment':
      return <CreditCard className="h-5 w-5" />;
    case 'promotion':
      return <Gift className="h-5 w-5" />;
    case 'review':
      return <MessageSquare className="h-5 w-5" />;
    case 'shipping':
      return <Truck className="h-5 w-5" />;
    case 'system':
      return <Settings className="h-5 w-5" />;
    default:
      return <Bell className="h-5 w-5" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'order_update':
      return 'bg-blue-100 text-blue-800';
    case 'payment':
      return 'bg-green-100 text-green-800';
    case 'promotion':
      return 'bg-pink-100 text-pink-800';
    case 'review':
      return 'bg-yellow-100 text-yellow-800';
    case 'shipping':
      return 'bg-purple-100 text-purple-800';
    case 'system':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const Notifications: React.FC = () => {
  const notifications = useNotificationList();
  const unreadCount = useUnreadCount();
  const isLoading = useNotificationLoading();
  const { fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  const { toast } = useToast();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.is_read)
    : notifications;

  const handleMarkAsRead = async (notificationId: number) => {
    await markAsRead(notificationId);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-pink-600" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
          <p className="text-gray-600 mt-1">
            {unreadCount > 0 ? `${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}` : 'All caught up!'}
          </p>
        </div>
        {unreadCount > 0 && (
          <Button onClick={handleMarkAllAsRead} variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({notifications.length})
        </Button>
        <Button
          variant={filter === 'unread' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('unread')}
        >
          Unread ({unreadCount})
        </Button>
      </div>

      {/* Notifications List */}
      {filteredNotifications.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-600 text-lg">No notifications found</p>
            <p className="text-gray-500 text-sm mt-2">
              {filter === 'unread' ? 'You have no unread notifications' : 'You have no notifications yet'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredNotifications.map((notification) => (
            <Card
              key={notification.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                !notification.is_read ? 'border-l-4 border-l-pink-600 bg-pink-50/50' : ''
              }`}
              onClick={() => !notification.is_read && handleMarkAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`p-2 rounded-lg ${getNotificationColor(notification.notification_type)}`}>
                    {getNotificationIcon(notification.notification_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                          {!notification.is_read && (
                            <Badge variant="secondary" className="bg-pink-600 text-white text-xs">
                              New
                            </Badge>
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <p className="text-xs text-gray-500">
                          {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                        </p>
                      </div>
                      {!notification.is_read && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleMarkAsRead(notification.id);
                          }}
                          className="ml-auto"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;


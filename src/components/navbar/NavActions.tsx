import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Settings, LogOut, Package, CreditCard, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCartItemCount } from '@/stores/cartStore';
import { useUser, useUserActions } from '@/stores/userStore';
import { useNotifications, useUnreadCount } from '@/stores/notificationStore';

const NavActions: React.FC = () => {
  const itemCount = useCartItemCount();
  const user = useUser();
  const { logout } = useUserActions();
  const { notifications, markAsRead } = useNotifications();
  const unreadCount = useUnreadCount();

  return (
    <div className="hidden md:flex items-center space-x-4">
      {/* Notifications - Phase 4 */}
      {user && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="text-center group cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors relative">
              <Bell className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
              <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
                Notifications
              </span>
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs min-w-[16px] h-[16px] flex items-center justify-center rounded-full p-0 text-[10px]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 bg-white border shadow-lg max-h-96 overflow-y-auto" align="end">
            <DropdownMenuLabel className="flex items-center justify-between">
              <span>Notifications</span>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="bg-pink-600 text-white">
                  {unreadCount} new
                </Badge>
              )}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {notifications.length === 0 ? (
              <div className="px-2 py-4 text-center text-sm text-gray-500">
                No notifications
              </div>
            ) : (
              <>
                {notifications.slice(0, 5).map((notification) => (
                  <DropdownMenuItem
                    key={notification.id}
                    className="cursor-pointer"
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    <div className="flex flex-col w-full">
                      <div className="flex items-start justify-between">
                        <p className={`text-sm font-medium ${!notification.is_read ? 'text-gray-900' : 'text-gray-600'}`}>
                          {notification.title}
                        </p>
                        {!notification.is_read && (
                          <span className="ml-2 h-2 w-2 bg-pink-600 rounded-full flex-shrink-0 mt-1" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                        {notification.message}
                      </p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <Link to="/notifications">
                  <DropdownMenuItem className="cursor-pointer text-center justify-center">
                    View all notifications
                  </DropdownMenuItem>
                </Link>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      
      {/* Profile */}
      {user ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="text-center group cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors">
              <User className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
              <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
                Profile
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-white border shadow-lg" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            {user.role === 'supplier' ? (
              <Link to="/supplier">
                <DropdownMenuItem className="cursor-pointer">
                  <Package className="mr-2 h-4 w-4" />
                  <span>Supplier Dashboard</span>
                </DropdownMenuItem>
              </Link>
            ) : (
              <>
                <Link to="/profile">
                  <DropdownMenuItem className="cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>My Profile</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/orders">
                  <DropdownMenuItem className="cursor-pointer">
                    <Package className="mr-2 h-4 w-4" />
                    <span>My Orders</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/notifications">
                  <DropdownMenuItem className="cursor-pointer">
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                    {unreadCount > 0 && (
                      <Badge className="ml-auto bg-pink-600 text-white text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </DropdownMenuItem>
                </Link>
                <Link to="/support-tickets">
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Support</span>
                  </DropdownMenuItem>
                </Link>
                <Link to="/loyalty-points">
                  <DropdownMenuItem className="cursor-pointer">
                    <CreditCard className="mr-2 h-4 w-4" />
                    <span>Loyalty Points</span>
                  </DropdownMenuItem>
                </Link>
              </>
            )}
            <Link to="/wishlist">
              <DropdownMenuItem className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Wishlist</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <div className="flex items-center space-x-2">
          <Link to="/auth" className="text-center group cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors">
            <User className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
            <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
              Login
            </span>
          </Link>
        </div>
      )}

      {/* Wishlist - Hidden for suppliers */}
      {user?.role !== 'supplier' && (
        <Link to="/wishlist" className="text-center group cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors">
          <Heart className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
          <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
            Wishlist
          </span>
        </Link>
      )}

      {/* Cart - Hidden for suppliers */}
      {user?.role !== 'supplier' && (
        <Link to="/cart" className="text-center group cursor-pointer relative px-2 py-1 rounded hover:bg-gray-50 transition-colors">
          <ShoppingCart className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
          <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
            Bag
          </span>
          {itemCount > 0 && (
            <Badge className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs min-w-[16px] h-[16px] flex items-center justify-center rounded-full p-0 text-[10px]">
              {itemCount}
            </Badge>
          )}
        </Link>
      )}
    </div>
  );
};

export default NavActions;
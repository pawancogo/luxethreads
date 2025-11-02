import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Heart, Settings, LogOut, Package, CreditCard } from 'lucide-react';
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
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';

const NavActions: React.FC = () => {
  const { state } = useCart();
  const { user, logout } = useUser();

  return (
    <div className="hidden md:flex items-center space-x-4">
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
              </>
            )}
            <Link to="/wishlist">
              <DropdownMenuItem className="cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Wishlist</span>
              </DropdownMenuItem>
            </Link>
            <DropdownMenuItem className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer text-red-600 focus:text-red-600" onClick={logout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Link to="/auth" className="text-center group cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors">
          <User className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
          <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
            Profile
          </span>
        </Link>
      )}

      {/* Wishlist */}
      <div className="text-center group cursor-pointer px-2 py-1 rounded hover:bg-gray-50 transition-colors">
        <Heart className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
        <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
          Wishlist
        </span>
      </div>

      {/* Cart */}
      <Link to="/cart" className="text-center group cursor-pointer relative px-2 py-1 rounded hover:bg-gray-50 transition-colors">
        <ShoppingCart className="h-4 w-4 mx-auto text-gray-800 group-hover:text-pink-600 transition-colors" />
        <span className="text-xs text-gray-800 group-hover:text-pink-600 font-medium block mt-0.5">
          Bag
        </span>
        {state.itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs min-w-[16px] h-[16px] flex items-center justify-center rounded-full p-0 text-[10px]">
            {state.itemCount}
          </Badge>
        )}
      </Link>
    </div>
  );
};

export default NavActions;
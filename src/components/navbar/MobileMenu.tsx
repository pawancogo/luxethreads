import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, User, ChevronDown, ChevronUp, Package, Heart, CreditCard, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUser } from '@/contexts/UserContext';

interface NavItem {
  id: string;
  name: string;
  subcategories: Array<{
    title: string;
    items: string[];
  }>;
}

interface MobileMenuProps {
  isOpen: boolean;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  navItems: NavItem[];
  onCategoryClick: (categoryId: string) => void;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen,
  searchQuery,
  setSearchQuery,
  onSearchSubmit,
  navItems,
  onCategoryClick,
  onClose
}) => {
  const { user, logout } = useUser();
  const [isProfileExpanded, setIsProfileExpanded] = useState(false);

  if (!isOpen) return null;

  const handleLogout = () => {
    logout();
    onClose();
  };

  return (
    <div className="md:hidden bg-white border-t border-gray-200">
      <div className="px-4 py-4 space-y-4">
        {/* Mobile Search */}
        <form onSubmit={onSearchSubmit}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search for products, brands and more"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </form>

        {/* Mobile Categories */}
        <div className="grid grid-cols-2 gap-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onCategoryClick(item.id)}
              className="text-left px-4 py-3 text-gray-700 hover:bg-pink-50 hover:text-pink-600 rounded-md transition-colors font-medium"
            >
              {item.name}
            </button>
          ))}
        </div>

        {/* Mobile Profile Section */}
        <div className="pt-4 border-t border-gray-200">
          {user ? (
            <div className="space-y-2">
              {/* Profile Header */}
              <button
                onClick={() => setIsProfileExpanded(!isProfileExpanded)}
                className="w-full flex items-center justify-between px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-pink-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </div>
                </div>
                {isProfileExpanded ? (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                )}
              </button>

              {/* Expanded Profile Menu */}
              {isProfileExpanded && (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                    <User className="h-4 w-4 text-gray-600 mr-3" />
                    <span className="text-sm text-gray-700">My Profile</span>
                  </button>
                  {user.role !== 'supplier' && (
                    <>
                      <Link to="/orders" onClick={onClose} className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                        <Package className="h-4 w-4 text-gray-600 mr-3" />
                        <span className="text-sm text-gray-700">Orders</span>
                      </Link>
                      <Link to="/wishlist" onClick={onClose} className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                        <Heart className="h-4 w-4 text-gray-600 mr-3" />
                        <span className="text-sm text-gray-700">Wishlist</span>
                      </Link>
                    </>
                  )}
                  {user.role === 'supplier' && (
                    <Link to="/supplier" onClick={onClose} className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                      <Package className="h-4 w-4 text-gray-600 mr-3" />
                      <span className="text-sm text-gray-700">Supplier Dashboard</span>
                    </Link>
                  )}
                  <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                    <CreditCard className="h-4 w-4 text-gray-600 mr-3" />
                    <span className="text-sm text-gray-700">Payments</span>
                  </button>
                  <button className="w-full flex items-center px-4 py-3 text-left hover:bg-gray-100 transition-colors">
                    <Settings className="h-4 w-4 text-gray-600 mr-3" />
                    <span className="text-sm text-gray-700">Settings</span>
                  </button>
                  <div className="border-t border-gray-200">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center px-4 py-3 text-left hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4 text-red-600 mr-3" />
                      <span className="text-sm text-red-600">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <Link to="/auth" onClick={onClose}>
                <Button className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                  <User className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
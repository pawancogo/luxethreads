import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '@/stores/cartStore';
import { useUser } from '@/stores/userStore';
import { useCategoriesNavigationQuery } from '@/hooks/useCategoriesQuery';

import NavLogo from './navbar/NavLogo';
import DesktopNavigation from './navbar/DesktopNavigation';
import SearchBar from './navbar/SearchBar';
import NavActions from './navbar/NavActions';
import MobileMenuButton from './navbar/MobileMenuButton';
import MobileMenu from './navbar/MobileMenu';

interface NavItem {
  id: string;
  name: string;
  subcategories: Array<{
    title: string;
    items: string[];
  }>;
}

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Don't fetch categories navigation on auth-related routes
  const isAuthRoute = ['/auth', '/forgot-password', '/reset-password', '/verify-email'].includes(location.pathname);

  // Use React Query hook with caching - prevents duplicate API calls
  const { data: navItems = [], isLoading: isLoadingNav } = useCategoriesNavigationQuery(isAuthRoute);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?query=${encodeURIComponent(searchQuery.trim())}`);
      setIsMenuOpen(false);
    }
  };

  const handleCategoryClick = (categoryId: string, subCategoryId: string = '', productId: string = '') => {
    const params = new URLSearchParams();

    if (categoryId) params.append('category', categoryId);
    if (subCategoryId) params.append('subCategory', subCategoryId);
    if (productId) params.append('product', productId);

    const queryString = params.toString();

    navigate(categoryId === 'all' ? '/products' : `/products?${queryString}`);
    setIsMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-200">
      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLogo showFallback={showFallback} setShowFallback={setShowFallback} />

          {/* Desktop Navigation */}
          <DesktopNavigation 
            navItems={navItems} 
            onCategoryClick={handleCategoryClick} 
          />
          

          {/* Search Bar */}
          <SearchBar 
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            onSubmit={handleSearch}
          />

          {/* Desktop Actions */}
          <NavActions />

          {/* Mobile Menu Button */}
          <MobileMenuButton 
            isMenuOpen={isMenuOpen}
            setIsMenuOpen={setIsMenuOpen}
          />
        </div>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isMenuOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          onSearchSubmit={handleSearch}
          navItems={navItems}
          onCategoryClick={handleCategoryClick}
          onClose={() => setIsMenuOpen(false)}
        />
      </div>
    </nav>
  );
};

export default Navbar;
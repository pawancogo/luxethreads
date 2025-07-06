import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';

import NavLogo from './navbar/NavLogo';
import DesktopNavigation from './navbar/DesktopNavigation';
import SearchBar from './navbar/SearchBar';
import NavActions from './navbar/NavActions';
import MobileMenuButton from './navbar/MobileMenuButton';
import MobileMenu from './navbar/MobileMenu';
import { navItems } from '@/data/navItems';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFallback, setShowFallback] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      // setSearchQuery('');
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
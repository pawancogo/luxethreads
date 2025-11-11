import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Menu, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCartItemCount } from '@/stores/cartStore';

interface MobileMenuButtonProps {
  isMenuOpen: boolean;
  setIsMenuOpen: (open: boolean) => void;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ isMenuOpen, setIsMenuOpen }) => {
  const itemCount = useCartItemCount();

  return (
    <div className="md:hidden flex items-center space-x-4">
      <Link to="/cart" className="relative p-2 text-gray-700">
        <ShoppingCart className="h-6 w-6" />
        {itemCount > 0 && (
          <Badge className="absolute -top-1 -right-1 bg-pink-600 text-white text-xs min-w-[20px] h-5 flex items-center justify-center rounded-full">
            {itemCount}
          </Badge>
        )}
      </Link>
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="text-gray-700 hover:text-pink-600 transition-colors"
      >
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>
  );
};

export default MobileMenuButton;

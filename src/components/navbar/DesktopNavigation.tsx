import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface NavItem {
  id: string;
  name: string;
  subcategories: Array<{
    title: string;
    items: string[];
  }>;
}

interface DesktopNavigationProps {
  navItems: NavItem[];
  onCategoryClick: (categoryId: string, subCategoryId?: string, productId?: string) => void;

}

const DesktopNavigation: React.FC<DesktopNavigationProps> = ({ navItems, onCategoryClick }) => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      {navItems.map((item) => (
        <div key={item.id} className="relative group">
          <button
            onClick={() => onCategoryClick(item.id)}
            className="text-gray-800 hover:text-pink-600 font-medium text-sm tracking-wide uppercase py-4 transition-colors relative"
          >
            {item.name}
            {/* Hover underline */}
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-pink-600 transform scale-x-0 transition-transform duration-200 group-hover:scale-x-100"></span>
          </button>
          
          {/* Dropdown Menu */}
          {item.subcategories.length > 0 && (
            <div className="absolute top-full left-0 w-max bg-white border border-gray-200 shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 max-h-[calc(100vh-80px)]">
              <ScrollArea className="h-full max-h-[calc(100vh-80px)]">
                <div className="grid grid-cols-3 gap-8 p-8">
                  {item.subcategories.map((category, index) => (
                    <div key={index} className="space-y-3">
                      <h3 className="font-semibold text-pink-600 text-sm uppercase tracking-wide border-b border-gray-200 pb-2">
                        {category.title}
                      </h3>
                      <ul className="space-y-2">
                        {category.items.map((subItem, subIndex) => (
                          <li key={subIndex}>
                            <button
                              onClick={() => onCategoryClick(item.id, category.title, subItem)}
                              className="text-gray-600 hover:text-pink-600 text-sm transition-colors block w-full text-left py-1"
                            >
                              {subItem}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default DesktopNavigation;
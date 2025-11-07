import React from 'react';
import { useProduct } from '@/contexts/ProductContext';

interface ProductsBreadcrumbProps {
  selectedCategory: string;
  searchQuery: string;
}

const ProductsBreadcrumb: React.FC<ProductsBreadcrumbProps> = ({
  selectedCategory,
  searchQuery
}) => {
  const { categories } = useProduct();
  const categoryName = selectedCategory !== 'all' 
    ? categories.find(c => c.id.toString() === selectedCategory || c.slug === selectedCategory)?.name
    : null;
  
  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-sm text-gray-500">
          Home / Clothing {categoryName && `/ ${categoryName}`}
        </div>
        {searchQuery && (
          <div className="mt-1">
            <span className="text-sm text-gray-700">Search results for "</span>
            <span className="text-sm font-medium text-gray-900">{searchQuery}</span>
            <span className="text-sm text-gray-700">"</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsBreadcrumb;
import React from 'react';
import { categories } from '@/data/mockProducts';

interface ProductsBreadcrumbProps {
  selectedCategory: string;
  searchQuery: string;
}

const ProductsBreadcrumb: React.FC<ProductsBreadcrumbProps> = ({
  selectedCategory,
  searchQuery
}) => {
  return (
    <div className="border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="text-sm text-gray-500">
          Home / Clothing {selectedCategory !== 'all' && `/ ${categories.find(c => c.id === selectedCategory)?.name}`}
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
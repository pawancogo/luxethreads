import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';
import { useProduct } from '@/contexts/ProductContext';

interface ProductsHeaderProps {
  selectedCategory: string;
  filteredProductsCount: number;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  activeFiltersCount: number;
  onSortChange: (sortBy: string) => void;
  onViewModeChange: (viewMode: string) => void;
}

const ProductsHeader: React.FC<ProductsHeaderProps> = ({
  selectedCategory,
  filteredProductsCount,
  showFilters,
  setShowFilters,
  activeFiltersCount,
  onSortChange,
  onViewModeChange
}) => {
  const { categories } = useProduct();
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recommended');

  const handleViewModeChange = (mode: string) => {
    setViewMode(mode);
    onViewModeChange(mode);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  return (
    <div className="flex items-center justify-between py-4 border-[5px] border-red-200">
      <div className="flex items-center space-x-4">
        <h1 className="text-lg font-medium text-gray-900">
          {selectedCategory !== 'all' 
            ? categories.find(c => c.id.toString() === selectedCategory || c.slug === selectedCategory)?.name 
            : 'All Products'
          }
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({filteredProductsCount} items)
          </span>
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {/* View Toggle */}
        <div className="hidden md:flex items-center border border-gray-300 rounded">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}
          >
            <Grid3X3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}
          >
            <LayoutGrid className="h-4 w-4" />
          </button>
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={handleSortChange}>
          <SelectTrigger className="w-48 border-gray-300">
            <SelectValue placeholder="Sort by: Recommended" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="newest">What's New</SelectItem>
            <SelectItem value="popular">Popularity</SelectItem>
            <SelectItem value="price-high">Price: High to Low</SelectItem>
            <SelectItem value="price-low">Price: Low to High</SelectItem>
            <SelectItem value="discount">Better Discount</SelectItem>
          </SelectContent>
        </Select>

        {/* Mobile Filter Button */}
        <Button
          variant="outline"
          className="md:hidden border-gray-300"
          onClick={() => setShowFilters(!showFilters)}
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          FILTER
          {activeFiltersCount > 0 && (
            <span className="ml-1 bg-pink-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProductsHeader; 
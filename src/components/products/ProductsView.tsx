/**
 * Products View Component (Presenter)
 * Pure presentational component - only handles UI rendering
 * Receives all data and handlers as props
 * Follows Container/Presenter pattern
 */

import React from 'react';
import { Product } from '@/contexts/CartContext';
import ProductsBreadcrumb from './ProductsBreadcrumb';
import ProductsHeader from './ProductsHeader';
import ProductsFilters from './ProductsFilters';
import ProductsGrid from './ProductsGrid';

interface ProductsViewProps {
  // Data
  products: Product[];
  categories: any[];
  
  // Loading states
  isLoading: boolean;
  isInitialLoading: boolean;
  hasMore: boolean;
  totalCount: number;
  
  // UI state
  sortBy: string;
  viewMode: 'grid' | 'list';
  selectedCategory: string;
  selectedFabrics: string[];
  selectedColors: string[];
  selectedSizes: string[];
  priceRange: [number, number];
  searchQuery: string;
  showFilters: boolean;
  
  // Refs
  loadMoreRef: React.RefObject<HTMLDivElement>;
  
  // Handlers
  onSortChange: (sortBy: string) => void;
  onViewModeChange: (mode: 'grid' | 'list') => void;
  onCategoryChange: (category: string) => void;
  onFilterChange: (filters: {
    fabrics?: string[];
    colors?: string[];
    sizes?: string[];
    priceRange?: [number, number];
  }) => void;
  onSearch: (query: string) => void;
  onToggleFilters: () => void;
}

const ProductsView: React.FC<ProductsViewProps> = ({
  products,
  categories,
  isLoading,
  isInitialLoading,
  hasMore,
  totalCount,
  sortBy,
  viewMode,
  selectedCategory,
  selectedFabrics,
  selectedColors,
  selectedSizes,
  priceRange,
  searchQuery,
  showFilters,
  loadMoreRef,
  onSortChange,
  onViewModeChange,
  onCategoryChange,
  onFilterChange,
  onSearch,
  onToggleFilters,
}) => {
  // Calculate active filters count
  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedFabrics.length +
    selectedColors.length +
    selectedSizes.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0);

  const handleFiltersChange = (filters: {
    category: string;
    fabrics: string[];
    colors: string[];
    sizes: string[];
    priceRange: number[];
  }) => {
    onCategoryChange(filters.category);
    onFilterChange({
      fabrics: filters.fabrics,
      colors: filters.colors,
      sizes: filters.sizes,
      priceRange: filters.priceRange as [number, number],
    });
  };

  const clearFilters = () => {
    onCategoryChange('all');
    onFilterChange({
      fabrics: [],
      colors: [],
      sizes: [],
      priceRange: [0, 10000],
    });
    onSearch('');
  };

  return (
    <div className="min-h-screen bg-white">
      <ProductsBreadcrumb 
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      <div className="max-w-7xl mx-auto px-4">
        <ProductsHeader
          selectedCategory={selectedCategory}
          filteredProductsCount={products.length}
          showFilters={showFilters}
          setShowFilters={onToggleFilters}
          activeFiltersCount={activeFiltersCount}
          onSortChange={onSortChange}
          onViewModeChange={onViewModeChange}
        />

        <div className="flex">
          <ProductsFilters
            showFilters={showFilters}
            setShowFilters={onToggleFilters}
            selectedCategory={selectedCategory}
            selectedFabrics={selectedFabrics}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            priceRange={priceRange}
            onFiltersChange={handleFiltersChange}
          />

          <div className="flex-1 min-w-0">
            <ProductsGrid
              filteredProducts={products}
              isLoading={isLoading || isInitialLoading}
              hasMore={hasMore}
              viewMode={viewMode}
              clearFilters={clearFilters}
            />
            {hasMore && <div ref={loadMoreRef} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsView;


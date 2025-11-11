import React, { useState } from 'react';
import { useFilter, useFilters, useFilterResults, useFilterLoading, useFilterError, useAvailableFilters } from '@/stores/filterStore';
import { mapBackendProductToList } from '@/lib/productMapper';
import { Product } from '@/types/product';
import ProductsBreadcrumb from '@/components/products/ProductsBreadcrumb';
import AdvancedProductFilters from '@/components/products/AdvancedProductFilters';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

// Sort Select Component
const SortSelect: React.FC = () => {
  const filters = useFilters();
  const availableFilters = useAvailableFilters();
  const { setFilter } = useFilter();
  
  return (
    <Select
      value={filters.sort_by || 'recommended'}
      onValueChange={(value) => {
        setFilter('sort_by', value as any);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        {availableFilters?.sort_options?.map((option) => (
          <SelectItem key={option.value} value={option.value || 'recommended'}>
            {option.label}
          </SelectItem>
        )) || (
          <>
            <SelectItem value="recommended">Recommended</SelectItem>
            <SelectItem value="price_low_high">Price: Low to High</SelectItem>
            <SelectItem value="price_high_low">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="rating">Highest Rated</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
          </>
        )}
      </SelectContent>
    </Select>
  );
};

const ProductsWithFilters: React.FC = () => {
  const results = useFilterResults();
  const isLoading = useFilterLoading();
  const error = useFilterError();
  const filters = useFilters();
  const { loadMore } = useFilter();
  
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Map backend products to frontend Product type
  const products: (Product & {
    slug?: string;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_new_arrival?: boolean;
    is_trending?: boolean;
    stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
  })[] = results?.products?.map(mapBackendProductToList) || [];
  
  const hasMore = results?.pagination
    ? results.pagination.current_page < results.pagination.total_pages
    : false;
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <ProductsBreadcrumb />
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Products</h1>
            {results?.pagination && (
              <p className="text-gray-600 mt-1">
                Showing {products.length} of {results.pagination.total_count} products
              </p>
            )}
          </div>
          
          {/* Mobile Filter Button */}
          <div className="md:hidden">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>
        
        <div className="flex gap-6">
          {/* Filters Sidebar */}
          <div className={`
            ${showFilters ? 'fixed inset-0 z-50 md:relative md:inset-auto' : 'hidden md:block'}
            w-full md:w-80 flex-shrink-0
          `}>
            <AdvancedProductFilters
              isOpen={showFilters}
              onToggle={() => setShowFilters(!showFilters)}
              className="h-full"
            />
          </div>
          
          {/* Products Grid */}
          <div className="flex-1">
            {/* Sort and View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SortSelect />
              </div>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  List
                </Button>
              </div>
            </div>
            
            {/* Error State */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
                <p className="text-red-800">{error}</p>
              </div>
            )}
            
            {/* Loading State */}
            {isLoading && products.length === 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, index) => (
                  <ProductSkeleton key={index} />
                ))}
              </div>
            )}
            
            {/* Products Grid */}
            {!isLoading && products.length > 0 && (
              <>
                <div className={`
                  grid gap-6
                  ${viewMode === 'grid' 
                    ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
                    : 'grid-cols-1'
                  }
                `}>
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
                
                {/* Load More Button */}
                {hasMore && (
                  <div className="mt-8 text-center">
                    <Button
                      onClick={loadMore}
                      disabled={isLoading}
                      variant="outline"
                      size="lg"
                    >
                      {isLoading ? 'Loading...' : 'Load More'}
                    </Button>
                  </div>
                )}
              </>
            )}
            
            {/* Empty State */}
            {!isLoading && products.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
                <p className="text-gray-500 mt-2">Try adjusting your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsWithFilters;


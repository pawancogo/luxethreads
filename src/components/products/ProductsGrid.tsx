import React from 'react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Product } from '@/contexts/CartContext';

interface ProductsGridProps {
  filteredProducts: Product[];
  isLoading: boolean;
  hasMore: boolean;
  viewMode: string;
  clearFilters: () => void;
}

const ProductsGrid: React.FC<ProductsGridProps> = ({
  filteredProducts,
  isLoading,
  hasMore,
  viewMode,
  clearFilters
}) => {
  if (filteredProducts.length === 0 && !isLoading) {
    return (
      <div className="text-center py-16">
        <div className="text-gray-400 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2 2v-5m16 0H4m16 0l-4-4m0 0l-4 4m4-4v8" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-500 mb-4">Try adjusting your filters to see more results</p>
        <Button onClick={clearFilters} className="bg-pink-500 hover:bg-pink-600">
          Clear all filters
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      {/* Products Grid */}
      <div className={`grid gap-4 mb-4 ${
        viewMode === 'grid' 
          ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' 
          : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
      }`}>
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {/* Loading Skeletons */}
        {isLoading && (
          <>
            {Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={`skeleton-${index}`} />
            ))}
          </>
        )}
      </div>

      {/* Load More Info */}
      {filteredProducts.length > 0 && (
        <div className="text-center py-4">
          {isLoading ? (
            <p className="text-gray-600">Loading more products...</p>
          ) : hasMore ? (
            <p className="text-gray-600">Scroll down to load more products</p>
          ) : (
            <p className="text-gray-600">You've reached the end of the catalog</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductsGrid;
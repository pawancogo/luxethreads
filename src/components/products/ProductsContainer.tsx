/**
 * Products Container Component - Clean Architecture Implementation
 * Uses ProductService and CategoryService for business logic
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { productService } from '@/services/product.service';
import { productFilterUtils } from '@/services/product-filter.utils';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { useToast } from '@/hooks/use-toast';
import { getQueryParam, updateQueryParam } from '@/utils/url.utils';
import { useDebouncedValue } from '@/utils/debounce';
import { Product } from '@/types/product';
import ProductsView from './ProductsView';

interface ProductsContainerProps {
  // Can add props if needed for testing or different configurations
}

const ProductsContainer: React.FC<ProductsContainerProps> = () => {
  const location = useLocation();
  const { toast } = useToast();
  
  // Products state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(
    getQueryParam(location.search, 'category', 'all')
  );
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState(
    getQueryParam(location.search, 'query') || getQueryParam(location.search, 'search')
  );
  const [showFilters, setShowFilters] = useState(false);
  
  // Debounced search query for URL updates
  const debouncedSearchQuery = useDebouncedValue(searchQuery, 500);
  
  // API pagination state
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Load categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await productService.getCategories();
        setCategories(cats);
        
        // Find category ID if category name is selected
        if (selectedCategory !== 'all') {
          const foundCategory = productService.findCategoryByName(cats, selectedCategory);
          if (foundCategory) {
            setSelectedCategoryId(foundCategory.id);
          }
        }
      } catch (error) {
        // Error handled silently - categories will be empty
      }
    };
    
    loadCategories();
  }, [selectedCategory]);

  // Load products from API
  const loadProducts = async (page: number = 1, reset: boolean = false) => {
    if (isLoading && !reset) return;
    
    setIsLoading(true);
    
    try {
      // Use ProductService for all product fetching
      const result = await productService.getPublicProducts({
        query: searchQuery || undefined,
        category_id: selectedCategoryId || undefined,
        min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
        max_price: priceRange[1] < 10000 ? priceRange[1] : undefined,
        page,
        per_page: 20,
      });
      
      if (reset) {
        setAllProducts(result.products);
      } else {
        setAllProducts(prev => [...prev, ...result.products]);
      }
      
      setHasMore(page < result.total_pages);
      setTotalCount(result.total);
      
      setCurrentPage(page);
    } catch (error: any) {
      const errorMessage = error?.message || 'Failed to load products. Please try again.';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Sync URL params with state on mount and when URL changes
  useEffect(() => {
    const queryFromUrl = getQueryParam(location.search, 'query') || getQueryParam(location.search, 'search');
    const categoryFromUrl = getQueryParam(location.search, 'category');
    
    // Update search query if URL has different value
    if (queryFromUrl !== searchQuery) {
      setSearchQuery(queryFromUrl);
    }
    
    // Update category if URL has different value
    if (categoryFromUrl && categoryFromUrl !== selectedCategory) {
      setSelectedCategory(categoryFromUrl);
      const foundCategory = productService.findCategoryByIdOrName(categories, categoryFromUrl);
      if (foundCategory) {
        setSelectedCategoryId(foundCategory.id);
      }
    }
  }, [location.search, categories, searchQuery, selectedCategory]);

  // Load products when search params change
  useEffect(() => {
    loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategoryId, priceRange[0], priceRange[1]]);

  // Filter and sort products using centralized utility
  useEffect(() => {
    const filtered = productFilterUtils.filterAndSort(
      allProducts,
      {
        fabrics: selectedFabrics.length > 0 ? selectedFabrics : undefined,
        colors: selectedColors.length > 0 ? selectedColors : undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
        priceRange: priceRange[0] > 0 || priceRange[1] < 10000 
          ? [priceRange[0], priceRange[1]] as [number, number]
          : undefined,
      },
      sortBy as any
    );
    
    setFilteredProducts(filtered);
  }, [allProducts, selectedFabrics, selectedColors, selectedSizes, sortBy, priceRange]);

  // Infinite scroll ref (for compatibility with ProductsView)
  const loadMoreRef = useRef<HTMLDivElement>(null);
  
  // Infinite scroll
  useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: () => {
      if (hasMore && !isLoading) {
        loadProducts(currentPage + 1, false);
      }
    },
  });

  // Handlers
  const handleSortChange = (newSortBy: string) => {
    setSortBy(newSortBy);
  };

  const handleViewModeChange = (mode: 'grid' | 'list') => {
    setViewMode(mode);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSelectedCategoryId(null);
    } else {
      const foundCategory = productService.findCategoryByName(categories, category);
      setSelectedCategoryId(foundCategory?.id || null);
    }
    setCurrentPage(1);
  };

  const handleFilterChange = (filters: {
    fabrics?: string[];
    colors?: string[];
    sizes?: string[];
    priceRange?: [number, number];
  }) => {
    if (filters.fabrics !== undefined) setSelectedFabrics(filters.fabrics);
    if (filters.colors !== undefined) setSelectedColors(filters.colors);
    if (filters.sizes !== undefined) setSelectedSizes(filters.sizes);
    if (filters.priceRange !== undefined) setPriceRange(filters.priceRange);
  };

  // Update URL when debounced search query changes
  useEffect(() => {
    updateQueryParam(location.pathname, location.search, 'query', debouncedSearchQuery || null);
  }, [debouncedSearchQuery, location.pathname, location.search]);

  const handleSearch = (query: string) => {
    // Update search query immediately for UI responsiveness
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handleToggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  // Pass all data and handlers to presentational component
  return (
    <ProductsView
      products={filteredProducts}
      categories={categories}
      isLoading={isLoading}
      isInitialLoading={isInitialLoading}
      hasMore={hasMore}
      totalCount={totalCount}
      sortBy={sortBy}
      viewMode={viewMode as 'grid' | 'list'}
      selectedCategory={selectedCategory}
      selectedFabrics={selectedFabrics}
      selectedColors={selectedColors}
      selectedSizes={selectedSizes}
      priceRange={priceRange as [number, number]}
      searchQuery={searchQuery}
      showFilters={showFilters}
      loadMoreRef={loadMoreRef}
      onSortChange={handleSortChange}
      onViewModeChange={handleViewModeChange}
      onCategoryChange={handleCategoryChange}
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
      onToggleFilters={handleToggleFilters}
    />
  );
};

export default ProductsContainer;


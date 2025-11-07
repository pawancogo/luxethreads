/**
 * Products Container Component
 * Handles business logic, data fetching, and state management
 * Follows Container/Presenter pattern - separates logic from UI
 */

import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '@/services/api';
import { mapBackendProductToList } from '@/lib/productMapper';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { Product } from '@/contexts/CartContext';
import ProductsView from './ProductsView';

interface ProductsContainerProps {
  // Can add props if needed for testing or different configurations
}

const ProductsContainer: React.FC<ProductsContainerProps> = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Products state
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>(queryParams.get('category') || 'all');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('query') || queryParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  
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
        const response = await categoriesAPI.getAll();
        const cats = Array.isArray(response) ? response : [];
        setCategories(cats);
        
        // Find category ID if category name is selected
        if (selectedCategory !== 'all') {
          const foundCategory = cats.find((c: any) => 
            c.name?.toLowerCase() === selectedCategory.toLowerCase()
          );
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
  const loadProducts = useCallback(async (page: number = 1, reset: boolean = false) => {
    if (isLoading && !reset) return;
    
    setIsLoading(true);
    
    try {
      let response;
      
      // Use search API if there's a query, category, or price filter
      if (searchQuery || selectedCategoryId || priceRange[0] > 0 || priceRange[1] < 10000) {
        response = await productsAPI.searchProducts({
          query: searchQuery || undefined,
          category_id: selectedCategoryId || undefined,
          min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
          max_price: priceRange[1] < 10000 ? priceRange[1] : undefined,
          page,
          per_page: 20,
        });
        
        // Search API returns { products, facets, pagination }
        const productsData = response.products || [];
        const pagination = response.pagination || {};
        
        if (reset) {
          setAllProducts(productsData.map(mapBackendProductToList));
        } else {
          setAllProducts(prev => [...prev, ...productsData.map(mapBackendProductToList)]);
        }
        
        setHasMore(page < (pagination.total_pages || 1));
        setTotalCount(pagination.total_count || 0);
      } else {
        // Use regular products API
        response = await productsAPI.getPublicProducts({
          page,
          per_page: 20
        });
        
        // Handle response structure
        let productsData: any[] = [];
        let pagination: any = null;
        
        if (Array.isArray(response)) {
          productsData = response;
          pagination = {
            total_count: response.length,
            total_pages: 1,
            current_page: page,
            per_page: 20,
          };
        } else if (response && typeof response === 'object') {
          productsData = response.products || [];
          pagination = response.pagination || null;
        }
        
        if (reset) {
          setAllProducts(productsData.map(mapBackendProductToList));
        } else {
          setAllProducts(prev => [...prev, ...productsData.map(mapBackendProductToList)]);
        }
        
        if (pagination) {
          setHasMore(page < pagination.total_pages);
          setTotalCount(pagination.total_count || 0);
        } else {
          setHasMore(productsData.length === 20);
        }
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [isLoading, searchQuery, selectedCategoryId, priceRange]);

  // Initial load
  useEffect(() => {
    loadProducts(1, true);
  }, [loadProducts]);

  // Filter products
  useEffect(() => {
    let filtered = [...allProducts];
    
    // Apply filters
    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(p => selectedFabrics.includes(p.fabric));
    }
    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => selectedColors.some(color => p.colors.includes(color)));
    }
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => selectedSizes.some(size => p.sizes.includes(size)));
    }
    
    // Apply sorting
    switch (sortBy) {
      case 'price_low_high':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_high_low':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => (b as any).createdAt - (a as any).createdAt);
        break;
      case 'oldest':
        filtered.sort((a, b) => (a as any).createdAt - (b as any).createdAt);
        break;
      default:
        // recommended - keep original order
        break;
    }
    
    setFilteredProducts(filtered);
  }, [allProducts, selectedFabrics, selectedColors, selectedSizes, sortBy]);

  // Infinite scroll
  const { loadMoreRef } = useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: () => {
      if (hasMore && !isLoading) {
        loadProducts(currentPage + 1, false);
      }
    },
  });

  // Handlers
  const handleSortChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category);
    if (category === 'all') {
      setSelectedCategoryId(null);
    } else {
      const foundCategory = categories.find((c: any) => 
        c.name?.toLowerCase() === category.toLowerCase()
      );
      setSelectedCategoryId(foundCategory?.id || null);
    }
    setCurrentPage(1);
    loadProducts(1, true);
  }, [categories, loadProducts]);

  const handleFilterChange = useCallback((filters: {
    fabrics?: string[];
    colors?: string[];
    sizes?: string[];
    priceRange?: [number, number];
  }) => {
    if (filters.fabrics !== undefined) setSelectedFabrics(filters.fabrics);
    if (filters.colors !== undefined) setSelectedColors(filters.colors);
    if (filters.sizes !== undefined) setSelectedSizes(filters.sizes);
    if (filters.priceRange !== undefined) setPriceRange(filters.priceRange);
  }, []);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    loadProducts(1, true);
  }, [loadProducts]);

  const handleToggleFilters = useCallback(() => {
    setShowFilters(prev => !prev);
  }, []);

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
      viewMode={viewMode}
      selectedCategory={selectedCategory}
      selectedFabrics={selectedFabrics}
      selectedColors={selectedColors}
      selectedSizes={selectedSizes}
      priceRange={priceRange}
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


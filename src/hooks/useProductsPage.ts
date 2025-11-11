/**
 * useProductsPage Hook - Clean Architecture Implementation
 * Removed unnecessary useCallback and useMemo hooks
 * Uses services instead of direct API calls
 * Follows: UI → Logic (Services) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productService } from '@/services/product.service';
import { productFilterUtils } from '@/services/product-filter.utils';
import { Product } from '@/types/product';

export const useProductsPage = () => {
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
        const cats = await productService.getCategories();
        setCategories(cats);
        
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
        setFilteredProducts(result.products);
      } else {
        setAllProducts(prev => [...prev, ...result.products]);
        setFilteredProducts(prev => [...prev, ...result.products]);
      }
      
      setCurrentPage(page);
      setHasMore(page < result.total_pages);
      setTotalCount(result.total);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadProducts(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategoryId, priceRange[0], priceRange[1]]);

  // Filter products using centralized utility
  const applyFilters = () => {
    const filtered = productFilterUtils.filterAndSort(
      allProducts,
      {
        fabrics: selectedFabrics.length > 0 ? selectedFabrics : undefined,
        colors: selectedColors.length > 0 ? selectedColors : undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
      },
      sortBy as any
    );

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    applyFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allProducts, selectedFabrics, selectedColors, selectedSizes, sortBy]);

  const loadMore = () => {
    if (!isLoading && hasMore) {
      loadProducts(currentPage + 1, false);
    }
  };

  return {
    filteredProducts,
    categories,
    sortBy,
    setSortBy,
    viewMode,
    setViewMode,
    selectedCategory,
    setSelectedCategory,
    selectedFabrics,
    setSelectedFabrics,
    selectedColors,
    setSelectedColors,
    selectedSizes,
    setSelectedSizes,
    priceRange,
    setPriceRange,
    searchQuery,
    setSearchQuery,
    showFilters,
    setShowFilters,
    isLoading,
    isInitialLoading,
    loadMore,
    hasMore,
    totalCount,
  };
};




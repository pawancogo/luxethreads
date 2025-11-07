import { useState, useEffect, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '@/services/api';
import { mapBackendProductToList } from '@/lib/productMapper';
import { Product } from '@/contexts/CartContext';

export const useProductsPage = () => {
  const location = useLocation();
  const queryParams = useMemo(() => new URLSearchParams(location.search), [location.search]);
  
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
      
      if (searchQuery || selectedCategoryId || priceRange[0] > 0 || priceRange[1] < 10000) {
        response = await productsAPI.searchProducts({
          query: searchQuery || undefined,
          category_id: selectedCategoryId || undefined,
          min_price: priceRange[0] > 0 ? priceRange[0] : undefined,
          max_price: priceRange[1] < 10000 ? priceRange[1] : undefined,
          page,
          per_page: 20,
        });
      } else {
        response = await productsAPI.getPublicProducts({
          page,
          per_page: 20,
        });
      }
      
      const productsData = Array.isArray(response) 
        ? response 
        : ((response as any)?.products || []);
      
      const mappedProducts = productsData.map(mapBackendProductToList);
      
      if (reset) {
        setAllProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
      } else {
        setAllProducts(prev => [...prev, ...mappedProducts]);
        setFilteredProducts(prev => [...prev, ...mappedProducts]);
      }
      
      setCurrentPage(page);
      setHasMore(productsData.length === 20);
      setTotalCount((response as any)?.total_count || mappedProducts.length);
    } catch (error) {
      // Error handling
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  }, [searchQuery, selectedCategoryId, priceRange, isLoading]);

  // Initial load
  useEffect(() => {
    loadProducts(1, true);
  }, [searchQuery, selectedCategoryId, priceRange[0], priceRange[1]]);

  // Filter products
  const applyFilters = useCallback(() => {
    let filtered = [...allProducts];

    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(p => 
        selectedFabrics.some(fabric => 
          p.attributes?.some(attr => 
            attr.attribute_type === 'Fabric' && attr.attribute_value === fabric
          )
        )
      );
    }

    if (selectedColors.length > 0) {
      filtered = filtered.filter(p => 
        selectedColors.some(color => 
          p.attributes?.some(attr => 
            attr.attribute_type === 'Color' && attr.attribute_value === color
          )
        )
      );
    }

    if (selectedSizes.length > 0) {
      filtered = filtered.filter(p => 
        selectedSizes.some(size => 
          p.attributes?.some(attr => 
            attr.attribute_type === 'Size' && attr.attribute_value === size
          )
        )
      );
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.discountedPrice || a.price) - (b.discountedPrice || b.price));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.discountedPrice || b.price) - (a.discountedPrice || a.price));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [allProducts, selectedFabrics, selectedColors, selectedSizes, sortBy]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      loadProducts(currentPage + 1, false);
    }
  }, [isLoading, hasMore, currentPage, loadProducts]);

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



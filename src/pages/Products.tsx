import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { productsAPI, categoriesAPI } from '@/services/api';
import { mapBackendProductToList } from '@/lib/productMapper';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import ProductsBreadcrumb from '@/components/products/ProductsBreadcrumb';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsGrid from '@/components/products/ProductsGrid';
import { Product } from '@/contexts/CartContext';

const Products = () => {
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
        console.error('Error loading categories:', error);
      }
    };
    
    loadCategories();
  }, []);

  // Load products from API
  const loadProducts = async (page: number = 1, reset: boolean = false) => {
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
        response = await productsAPI.getPublicProducts(page, 20);
        
        const productsData = Array.isArray(response) ? response : (response.products || []);
        
        if (reset) {
          setAllProducts(productsData.map(mapBackendProductToList));
        } else {
          setAllProducts(prev => [...prev, ...productsData.map(mapBackendProductToList)]);
        }
        
        // Assume has more if we got a full page
        setHasMore(productsData.length === 20);
      }
      
      setCurrentPage(page);
    } catch (error) {
      console.error('Error loading products:', error);
      if (reset) {
        setAllProducts([]);
      }
    } finally {
      setIsLoading(false);
      setIsInitialLoading(false);
    }
  };

  // Load more products function
  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return;
    await loadProducts(currentPage + 1, false);
  };

  // Initial load and reload when filters change
  useEffect(() => {
    setIsInitialLoading(true);
    setCurrentPage(1);
    setHasMore(true);
    loadProducts(1, true);
  }, [searchQuery, selectedCategoryId, priceRange]);

  // Update category ID when category name changes
  useEffect(() => {
    if (selectedCategory === 'all') {
      setSelectedCategoryId(null);
    } else {
      const foundCategory = categories.find((c: any) => 
        c.name?.toLowerCase() === selectedCategory.toLowerCase()
      );
      setSelectedCategoryId(foundCategory?.id || null);
    }
  }, [selectedCategory, categories]);

  // Use infinite scroll hook
  useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMoreProducts,
    threshold: 200
  });

  useEffect(() => {
    const searchParam = queryParams.get('query') || queryParams.get('search');
    const categoryParam = queryParams.get('category') || queryParams.get('product');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  // Client-side filtering (for colors, sizes, fabrics) and sorting
  useEffect(() => {
    let filtered = [...allProducts];

    // Apply fabric filter (client-side, since backend doesn't support it)
    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(product => selectedFabrics.includes(product.fabric));
    }

    // Apply color filter (client-side)
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Apply size filter (client-side)
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Apply sorting (client-side)
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'discount':
        filtered.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0;
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0;
          return discountB - discountA;
        });
        break;
      case 'newest':
        filtered.sort((a, b) => parseInt(b.id) - parseInt(a.id));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [selectedFabrics, selectedColors, selectedSizes, sortBy, allProducts]);

  const handleFiltersChange = (filters: {
    category: string;
    fabrics: string[];
    colors: string[];
    sizes: string[];
    priceRange: number[];
  }) => {
    setSelectedCategory(filters.category);
    setSelectedFabrics(filters.fabrics);
    setSelectedColors(filters.colors);
    setSelectedSizes(filters.sizes);
    setPriceRange(filters.priceRange);
  };

  const clearFilters = () => {
    setSelectedCategory('all');
    setSelectedFabrics([]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([0, 10000]);
    setSearchQuery('');
  };

  const activeFiltersCount = 
    (selectedCategory !== 'all' ? 1 : 0) +
    selectedFabrics.length +
    selectedColors.length +
    selectedSizes.length +
    (priceRange[0] !== 0 || priceRange[1] !== 10000 ? 1 : 0);

    console.log('selectedCategory', selectedCategory)

  return (
    <div className="min-h-screen bg-white">
      <ProductsBreadcrumb 
        selectedCategory={selectedCategory}
        searchQuery={searchQuery}
      />

      <div className="max-w-7xl mx-auto px-4">
        <ProductsHeader
          selectedCategory={selectedCategory}
          filteredProductsCount={filteredProducts.length}
          showFilters={showFilters}
          setShowFilters={setShowFilters}
          activeFiltersCount={activeFiltersCount}
          onSortChange={setSortBy}
          onViewModeChange={setViewMode}
        />

        <div className="flex">
          <ProductsFilters
            showFilters={showFilters}
            setShowFilters={setShowFilters}
            selectedCategory={selectedCategory}
            selectedFabrics={selectedFabrics}
            selectedColors={selectedColors}
            selectedSizes={selectedSizes}
            priceRange={priceRange}
            onFiltersChange={handleFiltersChange}
          />

          <div className="flex-1 min-w-0">
            <ProductsGrid
              filteredProducts={filteredProducts}
              isLoading={isLoading || isInitialLoading}
              hasMore={hasMore}
              viewMode={viewMode}
              clearFilters={clearFilters}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
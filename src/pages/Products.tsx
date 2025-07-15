import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockProducts } from '@/data/mockProducts';
import { fetchProducts } from '@/services/productService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import ProductsBreadcrumb from '@/components/products/ProductsBreadcrumb';
import ProductsHeader from '@/components/products/ProductsHeader';
import ProductsFilters from '@/components/products/ProductsFilters';
import ProductsGrid from '@/components/products/ProductsGrid';
import { Product } from '@/contexts/CartContext';

const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Combine initial products with API products
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('product') || 'all');
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  
  // Infinite scroll state
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  // Load more products function
  const loadMoreProducts = async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    console.log('Loading more products, page:', currentPage + 1);
    
    try {
      const response = await fetchProducts(currentPage + 1);
      setAllProducts(prev => [...prev, ...response.products]);
      setHasMore(response.hasMore);
      setCurrentPage(prev => prev + 1);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Use infinite scroll hook
  useInfiniteScroll({
    hasMore,
    isLoading,
    onLoadMore: loadMoreProducts,
    threshold: 200
  });

  useEffect(() => {
    const searchParam = queryParams.get('search');
    const categoryParam = queryParams.get('product');
    
    if (searchParam) {
      setSearchQuery(searchParam);
    }
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [location.search]);

  useEffect(() => {
    let filtered = [...allProducts];

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.fabric.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    // Apply fabric filter
    if (selectedFabrics.length > 0) {
      filtered = filtered.filter(product => selectedFabrics.includes(product.fabric));
    }

    // Apply color filter
    if (selectedColors.length > 0) {
      filtered = filtered.filter(product =>
        product.colors.some(color => selectedColors.includes(color))
      );
    }

    // Apply size filter
    if (selectedSizes.length > 0) {
      filtered = filtered.filter(product =>
        product.sizes.some(size => selectedSizes.includes(size))
      );
    }

    // Apply price filter
    filtered = filtered.filter(product =>
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );

    // Apply sorting
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
        filtered.sort((a, b) => b.id.localeCompare(a.id));
        break;
      case 'popular':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, selectedFabrics, selectedColors, selectedSizes, priceRange, sortBy, allProducts]);

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
              isLoading={isLoading}
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
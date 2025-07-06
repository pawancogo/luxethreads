import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mockProducts, categories, fabrics, colors, sizes } from '@/data/mockProducts';
import { fetchProducts } from '@/services/productService';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import ProductCard from '@/components/ProductCard';
import ProductSkeleton from '@/components/ProductSkeleton';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { X, SlidersHorizontal, Grid3X3, LayoutGrid } from 'lucide-react';
import { Product } from '@/contexts/CartContext';

const Products = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  
  // Combine initial products with API products
  const [allProducts, setAllProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [sortBy, setSortBy] = useState('recommended');
  const [selectedCategory, setSelectedCategory] = useState(queryParams.get('category') || 'all');
  const [selectedFabrics, setSelectedFabrics] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [searchQuery, setSearchQuery] = useState(queryParams.get('search') || '');
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  
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
    const categoryParam = queryParams.get('category');
    
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

  const handleFabricChange = (fabric: string, checked: boolean) => {
    if (checked) {
      setSelectedFabrics([...selectedFabrics, fabric]);
    } else {
      setSelectedFabrics(selectedFabrics.filter(f => f !== fabric));
    }
  };

  const handleColorChange = (color: string, checked: boolean) => {
    if (checked) {
      setSelectedColors([...selectedColors, color]);
    } else {
      setSelectedColors(selectedColors.filter(c => c !== color));
    }
  };

  const handleSizeChange = (size: string, checked: boolean) => {
    if (checked) {
      setSelectedSizes([...selectedSizes, size]);
    } else {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    }
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

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="text-sm text-gray-500">
            Home / Clothing {selectedCategory !== 'all' && `/ ${categories.find(c => c.id === selectedCategory)?.name}`}
          </div>
          {searchQuery && (
            <div className="mt-1">
              <span className="text-sm text-gray-700">Search results for "</span>
              <span className="text-sm font-medium text-gray-900">{searchQuery}</span>
              <span className="text-sm text-gray-700">"</span>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Top Controls */}
        <div className="flex items-center justify-between py-4 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <h1 className="text-lg font-medium text-gray-900">
              {selectedCategory !== 'all' 
                ? categories.find(c => c.id === selectedCategory)?.name 
                : 'All Products'
              }
              <span className="text-sm font-normal text-gray-500 ml-2">
                ({filteredProducts.length} items)
              </span>
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {/* View Toggle */}
            <div className="hidden md:flex items-center border border-gray-300 rounded">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}
              >
                <Grid3X3 className="h-4 w-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-pink-500 text-white' : 'text-gray-500'}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
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

        <div className="flex">
          {/* Filters Sidebar */}
          <div className={`w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden md:block'} ${showFilters ? 'fixed inset-0 z-50 bg-white md:relative md:inset-auto md:z-auto' : ''}`}>
            <div className="h-full overflow-y-auto border-r border-gray-200">
              {/* Mobile Filter Header */}
              {showFilters && (
                <div className="md:hidden flex items-center justify-between p-4 border-b">
                  <h3 className="text-lg font-medium">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-6 w-6" />
                  </button>
                </div>
              )}

              <div className="p-4 space-y-6">
                {/* Active Filters */}
                {activeFiltersCount > 0 && (
                  <div className="pb-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">FILTERS</h4>
                      <button
                        onClick={clearFilters}
                        className="text-sm text-pink-500 hover:text-pink-600"
                      >
                        CLEAR ALL
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedCategory !== 'all' && (
                        <span className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                          {categories.find(c => c.id === selectedCategory)?.name}
                          <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                        </span>
                      )}
                      {selectedFabrics.map(fabric => (
                        <span key={fabric} className="inline-flex items-center px-3 py-1 text-sm bg-gray-100 text-gray-800 rounded-full">
                          {fabric}
                          <X className="h-3 w-3 ml-1 cursor-pointer" onClick={() => handleFabricChange(fabric, false)} />
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">CATEGORIES</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <div key={category.id} className="flex items-center">
                        <Checkbox
                          id={`category-${category.id}`}
                          checked={selectedCategory === category.id}
                          onCheckedChange={() => setSelectedCategory(category.id)}
                          className="border-gray-300"
                        />
                        <Label htmlFor={`category-${category.id}`} className="ml-3 text-sm text-gray-700">
                          {category.name} ({category.count})
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">PRICE</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={10000}
                      min={0}
                      step={100}
                      className="mb-4"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Fabric */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">FABRIC</h4>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {fabrics.map((fabric) => (
                      <div key={fabric} className="flex items-center">
                        <Checkbox
                          id={`fabric-${fabric}`}
                          checked={selectedFabrics.includes(fabric)}
                          onCheckedChange={(checked) => handleFabricChange(fabric, checked as boolean)}
                          className="border-gray-300"
                        />
                        <Label htmlFor={`fabric-${fabric}`} className="ml-3 text-sm text-gray-700 capitalize">
                          {fabric}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Color */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">COLOR</h4>
                  <div className="grid grid-cols-4 gap-3">
                    {colors.map((color) => (
                      <div key={color} className="flex flex-col items-center">
                        <div className="relative">
                          <input
                            type="checkbox"
                            id={`color-${color}`}
                            checked={selectedColors.includes(color)}
                            onChange={(e) => handleColorChange(color, e.target.checked)}
                            className="sr-only"
                          />
                          <label
                            htmlFor={`color-${color}`}
                            className={`block w-8 h-8 rounded-full border-2 cursor-pointer ${
                              selectedColors.includes(color) ? 'border-gray-900 ring-2 ring-offset-2 ring-gray-900' : 'border-gray-300'
                            }`}
                            style={{ backgroundColor: color.toLowerCase() }}
                          />
                        </div>
                        <span className="text-xs mt-1 text-gray-600">{color}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Size */}
                <div>
                  <h4 className="font-medium text-gray-900 mb-3 text-sm uppercase tracking-wide">SIZE</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {sizes.map((size) => (
                      <label
                        key={size}
                        className={`flex items-center justify-center h-10 border-2 rounded cursor-pointer text-sm ${
                          selectedSizes.includes(size)
                            ? 'border-pink-500 bg-pink-50 text-pink-600'
                            : 'border-gray-300 text-gray-700 hover:border-gray-400'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedSizes.includes(size)}
                          onChange={(e) => handleSizeChange(size, e.target.checked)}
                          className="sr-only"
                        />
                        {size}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 min-w-0">
            {filteredProducts.length === 0 && !isLoading ? (
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
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
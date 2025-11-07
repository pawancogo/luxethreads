import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productsAPI } from '@/services/api';
import { mapBackendProductToList } from '@/lib/productMapper';
import { Product } from '@/contexts/CartContext';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';
import ProductSkeleton from './ProductSkeleton';

const FeaturedProducts = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        setIsLoading(true);
        // Phase 2: Use object parameters with featured filter
        const response = await productsAPI.getPublicProducts({
          page: 1,
          per_page: 4,
          featured: true
        });
        
        // API interceptor extracts data, so response is the data object
        // Backend returns: { products: [...], pagination: {...}, ... }
        const products = Array.isArray(response) 
          ? response 
          : ((response as any)?.products || []);
        const mappedProducts = products.map(mapBackendProductToList);
        setFeaturedProducts(mappedProducts);
      } catch (error) {
        setFeaturedProducts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  return (
    <section className="pt-20 pb-10 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Featured Products
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Discover our handpicked collection of premium clothing
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <div className="col-span-4 text-center py-8 text-gray-600">
              No featured products available at the moment.
            </div>
          )}
        </div>

        <div className="mt-10 text-center">
          <Link to="/products">
            <Button size="lg" variant="outline" className="border-amber-600 text-amber-600 hover:bg-amber-50">
              View All Products
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
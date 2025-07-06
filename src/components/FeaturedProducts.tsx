import React from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from '@/data/mockProducts';
import ProductCard from './ProductCard';
import { Button } from '@/components/ui/button';

const FeaturedProducts = () => {
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 4);

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
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
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
import React from 'react';
import Hero from '@/components/Hero';
import FeaturedProducts from '@/components/FeaturedProducts';

const Home = () => {
  return (
    <div className="min-h-screen">
      <Hero />
      <FeaturedProducts />
      
      {/* Categories Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Shop by Category
            </h2>
            <p className="mt-4 text-xl text-gray-600">
              Find the perfect outfit for every occasion
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Sarees', image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=300&fit=crop', path: '/products?category=saree' },
              { name: 'Kurtas', image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=300&fit=crop', path: '/products?category=kurta' },
              { name: 'Kurtis', image: 'https://images.unsplash.com/photo-1583391733975-b8ba0630c7fe?w=400&h=300&fit=crop', path: '/products?category=kurti' },
              { name: 'Shirts', image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=300&fit=crop', path: '/products?category=shirt' },
            ].map((category) => (
              <a
                key={category.name}
                href={category.path}
                className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="aspect-[4/3] bg-gray-200">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                  <h3 className="text-white text-xl font-bold">{category.name}</h3>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Handpicked fabrics and traditional craftsmanship ensure lasting quality.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Fast Delivery</h3>
              <p className="text-gray-600">Quick and secure delivery to your doorstep within 3-5 business days.</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Easy Returns</h3>
              <p className="text-gray-600">30-day hassle-free return policy for your peace of mind.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
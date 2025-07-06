import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '@/contexts/CartContext';
import { Badge } from '@/components/ui/badge';
import { Heart, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const rating = 4.2; // Mock rating
  const ratingCount = Math.floor(Math.random() * 1000) + 100; // Mock rating count

  return (
    <div className="group relative bg-white border border-gray-200 rounded-md overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Wishlist Button */}
      <button
        onClick={(e) => {
          e.preventDefault();
          setIsWishlisted(!isWishlisted);
        }}
        className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <Heart 
          className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
        />
      </button>

      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image */}
        <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse" />
          )}
          
          {/* Discount Badge */}
          {discountPercentage > 0 && (
            <Badge className="absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1">
              {discountPercentage}% OFF
            </Badge>
          )}

          {/* Out of Stock Overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">OUT OF STOCK</span>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="p-3">
          {/* Brand & Product Name */}
          <div className="mb-2">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight line-clamp-1 mb-1">
              ClothCraft
            </h3>
            <p className="text-gray-600 text-sm leading-tight line-clamp-2">
              {product.name}
            </p>
          </div>

          {/* Rating */}
          <div className="flex items-center mb-2">
            <div className="flex items-center bg-green-600 text-white px-1.5 py-0.5 rounded text-xs">
              <span className="font-medium">{rating}</span>
              <Star className="h-2.5 w-2.5 ml-0.5 fill-current" />
            </div>
            <span className="text-gray-500 text-xs ml-1">({ratingCount})</span>
          </div>

          {/* Price */}
          <div className="flex items-center space-x-2 mb-2">
            <span className="text-gray-900 font-bold text-sm">
              ₹{product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <>
                <span className="text-gray-500 text-sm line-through">
                  ₹{product.originalPrice.toLocaleString()}
                </span>
                <span className="text-orange-600 text-sm font-medium">
                  ({discountPercentage}% OFF)
                </span>
              </>
            )}
          </div>

          {/* Fabric & Category */}
          <div className="text-gray-500 text-xs mb-2">
            {product.fabric} • {product.category}
          </div>

          {/* Size Options Preview */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <span className="text-xs text-gray-500">Sizes:</span>
              <div className="flex space-x-1">
                {product.sizes.slice(0, 4).map((size, index) => (
                  <span
                    key={index}
                    className="text-xs text-gray-600 border border-gray-300 px-1 py-0.5 rounded"
                  >
                    {size}
                  </span>
                ))}
                {product.sizes.length > 4 && (
                  <span className="text-xs text-gray-500">+{product.sizes.length - 4}</span>
                )}
              </div>
            </div>
          </div>

          {/* Color Options */}
          <div className="flex items-center mt-2">
            <span className="text-xs text-gray-500 mr-2">Colors:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-3 h-3 rounded-full border border-gray-300"
                  style={{ backgroundColor: color.toLowerCase() }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500 ml-1">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;

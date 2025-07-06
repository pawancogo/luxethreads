import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { mockProducts } from '@/data/mockProducts';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { toast } = useToast();
  
  const product = mockProducts.find(p => p.id === id);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/products">
            <Button>Back to Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const discountPercentage = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    if (!selectedColor && product.colors.length > 0) {
      toast({
        title: "Please select a color",
        variant: "destructive",
      });
      return;
    }

    if (!selectedSize && product.sizes.length > 0) {
      toast({
        title: "Please select a size",
        variant: "destructive",
      });
      return;
    }

    const color = selectedColor || product.colors[0] || 'Default';
    const size = selectedSize || product.sizes[0] || 'Default';

    addToCart(product, color, size);
    toast({
      title: "Added to cart!",
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center mb-8">
          <Link to="/products" className="flex items-center text-amber-600 hover:text-amber-700">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Products
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Product Images */}
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <img
                  src={images[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`aspect-square rounded-md overflow-hidden border-2 ${
                        selectedImageIndex === index ? 'border-amber-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <p className="text-gray-600 capitalize mt-2">
                  {product.category} • {product.fabric}
                </p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-amber-600">
                  ₹{product.price.toLocaleString()}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ₹{product.originalPrice.toLocaleString()}
                    </span>
                    <Badge className="bg-red-100 text-red-800">
                      {discountPercentage}% OFF
                    </Badge>
                  </>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Color Selection */}
              {product.colors.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                  <Select value={selectedColor} onValueChange={setSelectedColor}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.colors.map((color) => (
                        <SelectItem key={color} value={color}>
                          {color}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                  <Select value={selectedSize} onValueChange={setSelectedSize}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a size" />
                    </SelectTrigger>
                    <SelectContent>
                      {product.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {/* Stock Status */}
              <div className="flex items-center">
                {product.inStock ? (
                  <Badge className="bg-green-100 text-green-800">In Stock</Badge>
                ) : (
                  <Badge className="bg-red-100 text-red-800">Out of Stock</Badge>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <Button
                  size="lg"
                  className="flex-1 bg-amber-600 hover:bg-amber-700"
                  onClick={handleAddToCart}
                  disabled={!product.inStock}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button size="lg" variant="outline" className="border-gray-300">
                  <Heart className="h-5 w-5" />
                </Button>
              </div>

              {/* Product Details */}
              <div className="border-t pt-6">
                <h3 className="font-semibold text-gray-900 mb-4">Product Details</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category:</span>
                    <span className="capitalize">{product.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fabric:</span>
                    <span className="capitalize">{product.fabric}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Colors:</span>
                    <span>{product.colors.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Sizes:</span>
                    <span>{product.sizes.join(', ')}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
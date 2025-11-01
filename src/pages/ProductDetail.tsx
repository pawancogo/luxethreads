import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { productsAPI, cartAPI } from '@/services/api';
import { mapBackendProductDetail, findVariantByAttributes } from '@/lib/productMapper';
import { Product } from '@/contexts/CartContext';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ProductSkeleton from '@/components/ProductSkeleton';

interface BackendProductDetail {
  id: number;
  name: string;
  description: string;
  brand: { id: number; name: string; logo_url?: string };
  category: { id: number; name: string };
  supplier: { id: number; company_name: string; verified: boolean };
  variants: Array<{
    id: number;
    sku: string;
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    images: Array<{ id: number; url: string; alt_text?: string }>;
    attributes: Array<{ attribute_type: string; attribute_value: string }>;
  }>;
  reviews: Array<any>;
  total_reviews: number;
  average_rating?: number;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const { loadCart } = useCart();
  
  const [backendProduct, setBackendProduct] = useState<BackendProductDetail | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await productsAPI.getPublicProduct(id);
        const productData = response as any as BackendProductDetail;
        setBackendProduct(productData);
        
        // Map to frontend Product type  
        const mappedProduct = mapBackendProductDetail(productData as any);
        setProduct(mappedProduct);
        
        // Extract colors and sizes from variants
        const colors = Array.from(new Set(
          productData.variants.flatMap(v => 
            v.attributes.filter(a => a.attribute_type.toLowerCase() === 'color').map(a => a.attribute_value)
          )
        ));
        const sizes = Array.from(new Set(
          productData.variants.flatMap(v => 
            v.attributes.filter(a => a.attribute_type.toLowerCase() === 'size' || a.attribute_type.toLowerCase() === 'sizes')
              .map(a => a.attribute_value)
          )
        ));
        
        // Set default selections
        if (colors.length > 0) setSelectedColor(colors[0]);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        
        // Find default variant
        if (colors.length > 0 || sizes.length > 0) {
          const defaultVariant = findVariantByAttributes(productData.variants, colors[0], sizes[0]);
          if (defaultVariant) setSelectedVariantId(defaultVariant.id);
        }
      } catch (error) {
        console.error('Error loading product:', error);
        toast({
          title: "Error",
          description: "Failed to load product details. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  // Update variant when color/size changes
  useEffect(() => {
    if (backendProduct) {
      const variant = findVariantByAttributes(backendProduct.variants, selectedColor, selectedSize);
      setSelectedVariantId(variant?.id || null);
      
      // Update images when variant changes
      if (variant && variant.images.length > 0) {
        const variantImages = variant.images.map(img => img.url);
        setProduct(prev => prev ? { ...prev, images: variantImages, image: variantImages[0] } : null);
      }
    }
  }, [selectedColor, selectedSize, backendProduct]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <ProductSkeleton />
        </div>
      </div>
    );
  }

  if (!product || !backendProduct) {
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

  const handleAddToCart = async () => {
    if (!selectedVariantId) {
      toast({
        title: "Please select a variant",
        description: "Please select color and size options.",
        variant: "destructive",
      });
      return;
    }

    try {
      await cartAPI.addToCart(selectedVariantId, 1);
      // Reload cart to update cart count
      await loadCart();
      toast({
        title: "Added to cart!",
        description: `${product.name} has been added to your cart.`,
      });
    } catch (error: any) {
      const errorMessage = error?.message || error?.errors?.[0] || "Failed to add to cart";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    }
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
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </Badge>
                  </>
                )}
                {backendProduct.average_rating && (
                  <Badge className="bg-blue-100 text-blue-800">
                    ⭐ {backendProduct.average_rating.toFixed(1)} ({backendProduct.total_reviews} reviews)
                  </Badge>
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
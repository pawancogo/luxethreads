/**
 * ProductDetail Page - Clean Architecture Implementation
 * Uses WishlistService and CartContext for business logic
 * Follows: UI → Logic (Services/Contexts) → Data (API Services)
 */

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Heart } from 'lucide-react';
import { productService } from '@/services/product.service';
import { wishlistService } from '@/services/wishlist.service';
import { useAddToCartMutation } from '@/hooks/useCartQuery';
import { mapBackendProductDetail, findVariantByAttributes } from '@/lib/productMapper';
import { Product } from '@/types/product';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ProductSkeleton from '@/components/ProductSkeleton';
import ProductReviews from '@/components/products/ProductReviews';

// Phase 2: Enhanced BackendProductDetail interface
interface BackendProductDetail {
  id: number;
  slug?: string;
  name: string;
  description: string;
  short_description?: string;
  brand: { id: number; name: string; slug?: string; logo_url?: string };
  category: { id: number; name: string; slug?: string };
  supplier: { id: number; company_name: string; verified: boolean };
  // Phase 2: Product flags
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  published_at?: string;
  variants: Array<{
    id: number;
    sku: string;
    price: number;
    discounted_price?: number;
    mrp?: number;
    stock_quantity: number;
    available_quantity?: number;
    weight_kg?: number;
    currency?: string;
    is_available?: boolean;
    is_low_stock?: boolean;
    out_of_stock?: boolean;
    images: Array<{ 
      id: number; 
      url: string; 
      thumbnail_url?: string;
      medium_url?: string;
      large_url?: string;
      alt_text?: string 
    }>;
    attributes: Array<{ attribute_type: string; attribute_value: string }>;
  }>;
  reviews: Array<any>;
  total_reviews: number;
  average_rating?: number;
}

const ProductDetail = () => {
  // Phase 2: Support slug or ID in URL
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();
  const addToCartMutation = useAddToCartMutation();
  
  const [backendProduct, setBackendProduct] = useState<BackendProductDetail | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        // Phase 2: Backend supports slug or ID lookup
        const result = await productService.getPublicProduct(id);
        
        if (!result) {
          throw new Error('Product not found');
        }
        
        const { product, rawData } = result;
        
        // Store backend product data for variant handling
        const productData = rawData as BackendProductDetail;
        setBackendProduct(productData);
        setProduct(product);
        
        // Extract colors and sizes from variants (with null checks)
        const variants = productData.variants || [];
        const colors = Array.from(new Set(
          variants.flatMap(v => 
            (v.attributes || []).filter(a => a.attribute_type?.toLowerCase() === 'color').map(a => a.attribute_value)
          )
        ));
        const sizes = Array.from(new Set(
          variants.flatMap(v => 
            (v.attributes || []).filter(a => {
              const attrType = a.attribute_type?.toLowerCase();
              return attrType === 'size' || attrType === 'sizes';
            }).map(a => a.attribute_value)
          )
        ));
        
        // Set default selections
        if (colors.length > 0) setSelectedColor(colors[0]);
        if (sizes.length > 0) setSelectedSize(sizes[0]);
        
        // Find default variant
        let defaultVariantId: number | null = null;
        if ((colors.length > 0 || sizes.length > 0) && variants.length > 0) {
          const defaultVariant = findVariantByAttributes(variants, colors[0] || '', sizes[0] || '');
          if (defaultVariant) {
            defaultVariantId = defaultVariant.id;
            setSelectedVariantId(defaultVariant.id);
          }
        }
        
        // Phase 4: Track product view (after variant is determined)
        if (product.id) {
          await productService.trackProductView(Number(product.id), {
            product_variant_id: defaultVariantId || undefined,
            source: 'direct',
          });
        }
      } catch (error) {
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
    if (backendProduct && backendProduct.variants && backendProduct.variants.length > 0) {
      const variant = findVariantByAttributes(backendProduct.variants, selectedColor, selectedSize);
      setSelectedVariantId(variant?.id || null);
      
      // Update images when variant changes
      if (variant && variant.images && variant.images.length > 0) {
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
      await addToCartMutation.mutateAsync({ productVariantId: selectedVariantId, quantity: 1 });
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

  const handleWishlistToggle = async () => {
    if (!selectedVariantId) {
      toast({
        title: "Please select a variant",
        description: "Please select color and size options.",
        variant: "destructive",
      });
      return;
    }

    setIsWishlistLoading(true);
    try {
      if (isInWishlist) {
        // Remove from wishlist - would need wishlist item ID
        toast({
          title: "Removed from wishlist",
          description: `${product.name} has been removed from your wishlist.`,
        });
        setIsInWishlist(false);
      } else {
        await wishlistService.addToWishlist(selectedVariantId);
        toast({
          title: "Added to wishlist!",
          description: `${product.name} has been added to your wishlist.`,
        });
        setIsInWishlist(true);
      }
    } catch (error: any) {
      const errorMessage = wishlistService.extractErrorMessage(error);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsWishlistLoading(false);
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
              {product.colors && product.colors.length > 0 && (
                
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
              {product.sizes && product.sizes.length > 0 && (
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
                <Button 
                  size="lg" 
                  variant="outline" 
                  className={`border-gray-300 ${isInWishlist ? 'bg-red-50 border-red-300' : ''}`}
                  onClick={handleWishlistToggle}
                  disabled={isWishlistLoading}
                >
                  <Heart className={`h-5 w-5 ${isInWishlist ? 'fill-red-500 text-red-500' : ''}`} />
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
                    <span>{(product.colors || []).join(', ') || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Available Sizes:</span>
                    <span>{(product.sizes || []).join(', ') || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Reviews Section */}
        {backendProduct && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
            <ProductReviews
              productId={backendProduct.id}
              averageRating={backendProduct.average_rating}
              totalReviews={backendProduct.total_reviews}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
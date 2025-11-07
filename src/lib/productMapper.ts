import { Product } from '@/contexts/CartContext';

// Phase 2: Enhanced Backend API Product Response Types
interface BackendProduct {
  id: number;
  slug?: string;
  name: string;
  description: string;
  short_description?: string;
  brand_name: string;
  category_name: string;
  supplier_name: string;
  price: number;
  discounted_price?: number;
  base_price?: number;
  base_discounted_price?: number;
  image_url?: string;
  stock_available: boolean;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  average_rating?: number;
}

interface BackendProductDetail extends BackendProduct {
  brand: {
    id: number;
    name: string;
    logo_url?: string;
  };
  category: {
    id: number;
    name: string;
  };
  supplier: {
    id: number;
    company_name: string;
    verified: boolean;
  };
  variants: BackendProductVariant[];
  reviews: BackendReview[];
  total_reviews: number;
}

interface BackendProductVariant {
  id: number;
  sku: string;
  price: number;
  discounted_price?: number;
  stock_quantity: number;
  weight_kg?: number;
  images: BackendProductImage[];
  attributes: BackendVariantAttribute[];
}

interface BackendProductImage {
  id: number;
  url: string;
  alt_text?: string;
}

interface BackendVariantAttribute {
  attribute_type: string;
  attribute_value: string;
}

interface BackendReview {
  id: number;
  user_name: string;
  rating: number;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
}

/**
 * Extract colors from variant attributes
 */
function extractColors(variants: BackendProductVariant[]): string[] {
  const colorSet = new Set<string>();
  variants.forEach(variant => {
    variant.attributes.forEach(attr => {
      if (attr.attribute_type.toLowerCase() === 'color') {
        colorSet.add(attr.attribute_value);
      }
    });
  });
  return Array.from(colorSet);
}

/**
 * Extract sizes from variant attributes
 */
function extractSizes(variants: BackendProductVariant[]): string[] {
  const sizeSet = new Set<string>();
  variants.forEach(variant => {
    variant.attributes.forEach(attr => {
      const attrType = attr.attribute_type.toLowerCase();
      if (attrType === 'size' || attrType === 'sizes') {
        sizeSet.add(attr.attribute_value);
      }
    });
  });
  return Array.from(sizeSet);
}

/**
 * Map backend product (from list/search) to frontend Product type
 * Phase 2: Enhanced with Phase 2 fields
 */
export function mapBackendProductToList(backendProduct: BackendProduct): Product & {
  slug?: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  stockStatus?: 'in_stock' | 'low_stock' | 'out_of_stock';
} {
  // Determine stock status
  const stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' = 
    backendProduct.stock_available ? 'in_stock' : 'out_of_stock';
  
  return {
    id: backendProduct.id.toString(),
    slug: backendProduct.slug,
    name: backendProduct.name,
    price: backendProduct.discounted_price || backendProduct.base_discounted_price || backendProduct.price || backendProduct.base_price || 0,
    originalPrice: backendProduct.discounted_price ? backendProduct.price : (backendProduct.base_discounted_price ? backendProduct.base_price : undefined),
    image: backendProduct.image_url || '',
    category: backendProduct.category_name.toLowerCase(),
    fabric: '', // Not available in list view
    colors: [], // Not available in list view
    sizes: [], // Not available in list view
    description: backendProduct.short_description || backendProduct.description || '',
    inStock: backendProduct.stock_available,
    featured: backendProduct.is_featured || false,
    // Phase 2: Additional fields
    is_featured: backendProduct.is_featured,
    is_bestseller: backendProduct.is_bestseller,
    is_new_arrival: backendProduct.is_new_arrival,
    is_trending: backendProduct.is_trending,
    stockStatus,
  };
}

/**
 * Map backend product detail to frontend Product type
 */
export function mapBackendProductDetail(backendProduct: any): Product {
  const variants = backendProduct.variants || [];
  const colors = extractColors(variants);
  const sizes = extractSizes(variants);
  
  // Get primary image from first variant with images
  let primaryImage = '';
  const firstVariantWithImage = variants.find((v: any) => v.images && v.images.length > 0);
  if (firstVariantWithImage && firstVariantWithImage.images.length > 0) {
    primaryImage = firstVariantWithImage.images[0].url || firstVariantWithImage.images[0].image_url || '';
  }
  
  // Get all images from all variants
  const allImages: string[] = [];
  variants.forEach((variant: any) => {
    if (variant.images) {
      variant.images.forEach((img: any) => {
        const imgUrl = img.url || img.image_url || '';
        if (imgUrl && !allImages.includes(imgUrl)) {
          allImages.push(imgUrl);
        }
      });
    }
  });
  
  // Determine price from variants (use first variant with stock)
  const availableVariant = variants.find((v: any) => v.stock_quantity > 0) || variants[0];
  const price = availableVariant?.discounted_price || availableVariant?.price || 0;
  const originalPrice = availableVariant?.discounted_price ? availableVariant.price : undefined;
  
  // Determine stock availability
  const inStock = variants.some((v: any) => v.stock_quantity > 0);
  
  return {
    id: backendProduct.id.toString(),
    name: backendProduct.name,
    price,
    originalPrice,
    image: primaryImage || '/placeholder.svg',
    images: allImages.length > 0 ? allImages : (primaryImage ? [primaryImage] : ['/placeholder.svg']),
    category: (backendProduct.category?.name || backendProduct.category_name || '').toLowerCase(),
    fabric: '', // Extract from attributes if available
    colors: colors.length > 0 ? colors : ['Default'],
    sizes: sizes.length > 0 ? sizes : ['Free Size'],
    description: backendProduct.description || '',
    inStock,
    featured: false,
  };
}

/**
 * Map backend variant to cart item selection
 */
export function findVariantByAttributes(
  variants: BackendProductVariant[],
  color?: string,
  size?: string
): BackendProductVariant | null {
  if (!color && !size) {
    // Return first available variant
    return variants.find(v => v.stock_quantity > 0) || variants[0] || null;
  }
  
  return variants.find(variant => {
    const hasColor = !color || variant.attributes.some(
      attr => attr.attribute_type.toLowerCase() === 'color' && 
               attr.attribute_value.toLowerCase() === color.toLowerCase()
    );
    const hasSize = !size || variant.attributes.some(
      attr => (attr.attribute_type.toLowerCase() === 'size' || 
               attr.attribute_type.toLowerCase() === 'sizes') && 
               attr.attribute_value.toLowerCase() === size.toLowerCase()
    );
    return hasColor && hasSize;
  }) || null;
}

/**
 * Get product variant ID for cart operations
 */
export function getVariantIdForCart(
  productDetail: BackendProductDetail,
  color?: string,
  size?: string
): number | null {
  const variant = findVariantByAttributes(productDetail.variants, color, size);
  return variant?.id || null;
}


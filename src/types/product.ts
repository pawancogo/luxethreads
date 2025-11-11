/**
 * Product Types - Shared type definitions
 * Extracted from contexts for better organization
 */

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  fabric: string;
  colors: string[];
  sizes: string[];
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  cartItemId: number;
  productVariantId: number;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  brandName?: string;
  categoryName?: string;
}


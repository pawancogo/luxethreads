// Shared types for supplier dashboard components

export interface Category {
  id: number;
  name: string;
}

export interface Brand {
  id: number;
  name: string;
}

export interface ProductAttribute {
  attribute_type: string;
  attribute_value: string;
}

export interface SupplierProduct {
  id: number;
  name: string;
  description: string;
  status: string | null;
  category_id?: number;
  brand_id?: number;
  category_name?: string;
  brand_name?: string;
  // Product-level attributes (from backend API)
  attributes?: ProductAttribute[];
  // Backend returns 'variants', but we also support 'product_variants' for compatibility
  variants?: ProductVariant[];
  product_variants?: ProductVariant[];
}

export interface ProductVariantAttribute {
  attribute_type: string; // e.g., "Color", "Fabric", "Size"
  attribute_value: string; // e.g., "Red", "Cotton", "Large"
  hex_code?: string; // Hex color code for color attributes (e.g., "#FF0000")
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text?: string;
  display_order?: number;
}

export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  discounted_price?: number;
  stock_quantity: number;
  weight_kg?: number;
  available?: boolean;
  current_price?: number;
  images?: string[] | ProductImage[]; // Array of image URLs (legacy) or ProductImage objects
  attributes?: ProductVariantAttribute[]; // Array of variant attributes (color, fabric, size, etc.)
  created_at?: string;
  updated_at?: string;
}

export interface SupplierOrder {
  order_id: number;
  order_number: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  status: string | null;
  payment_status: string;
  total_amount: number;
  shipping_address?: any;
  items: OrderItem[];
}

export interface OrderItem {
  order_item_id: number;
  product_variant_id: number;
  sku: string;
  product_name: string;
  brand_name: string;
  category_name: string;
  quantity: number;
  price_at_purchase: number;
  subtotal: number;
  image_url?: string;
}

export interface SupplierProfile {
  id: number;
  company_name: string;
  gst_number: string;
  description?: string;
  website_url?: string;
  verified: boolean;
  needs_completion?: boolean;
}

export interface ProductVariantForm {
  sku: string;
  price: string;
  discounted_price: string;
  stock_quantity: string;
  weight_kg: string;
  image_urls: string[];
}


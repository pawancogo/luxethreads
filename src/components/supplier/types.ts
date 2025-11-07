// Shared types for supplier dashboard components

// Phase 2: Enhanced Category interface
export interface Category {
  id: number;
  name: string;
  slug?: string;
  parent_id?: number;
  level?: number;
  path?: string;
  short_description?: string;
  image_url?: string;
  banner_url?: string;
  icon_url?: string;
  featured?: boolean;
  products_count?: number;
  active_products_count?: number;
  parent?: Category;
  sub_categories?: Category[];
}

// Phase 2: Enhanced Brand interface
export interface Brand {
  id: number;
  name: string;
  slug?: string;
  logo_url?: string;
  banner_url?: string;
  short_description?: string;
  country_of_origin?: string;
  founded_year?: number;
  website_url?: string;
  active?: boolean;
  products_count?: number;
  active_products_count?: number;
}

export interface ProductAttribute {
  attribute_type: string;
  attribute_value: string;
}

// Phase 2: Enhanced SupplierProduct interface
export interface SupplierProduct {
  id: number;
  name: string;
  slug?: string;
  description: string;
  short_description?: string;
  status: string | null;
  category_id?: number;
  brand_id?: number;
  category_name?: string;
  brand_name?: string;
  // Phase 2: Product flags
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_new_arrival?: boolean;
  is_trending?: boolean;
  published_at?: string;
  // Phase 2: SEO fields
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  // Phase 2: Content
  highlights?: string[];
  search_keywords?: string[];
  tags?: string[];
  // Phase 2: Pricing
  base_price?: number;
  base_discounted_price?: number;
  base_mrp?: number;
  // Phase 2: Dimensions
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;
  weight_kg?: number;
  // Phase 2: Metrics
  total_stock_quantity?: number;
  low_stock_variants_count?: number;
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

// Phase 2: Enhanced ProductImage interface
export interface ProductImage {
  id: number;
  url: string;
  thumbnail_url?: string;
  medium_url?: string;
  large_url?: string;
  alt_text?: string;
  display_order?: number;
  image_type?: string;
  color_dominant?: string;
  file_size_bytes?: number;
  width_pixels?: number;
  height_pixels?: number;
  mime_type?: string;
}

// Phase 2: Enhanced ProductVariant interface
export interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  discounted_price?: number;
  mrp?: number;
  cost_price?: number;
  currency?: string;
  stock_quantity: number;
  reserved_quantity?: number;
  available_quantity?: number;
  low_stock_threshold?: number;
  weight_kg?: number;
  // Phase 2: Inventory flags
  available?: boolean;
  is_low_stock?: boolean;
  out_of_stock?: boolean;
  is_available?: boolean;
  // Phase 2: Identification
  barcode?: string;
  ean_code?: string;
  isbn?: string;
  // Phase 2: Images with multiple sizes
  images?: string[] | ProductImage[]; // Array of image URLs (legacy) or ProductImage objects
  attributes?: ProductVariantAttribute[]; // Array of variant attributes (color, fabric, size, etc.)
  current_price?: number;
  created_at?: string;
  updated_at?: string;
}

// Phase 2: Enhanced SupplierOrder interface
export interface SupplierOrder {
  order_id: number;
  order_number: string;
  order_date: string;
  customer_name: string;
  customer_email: string;
  status: string | null;
  payment_status: string;
  total_amount: number;
  currency?: string;
  tracking_number?: string;
  tracking_url?: string;
  estimated_delivery_date?: string;
  shipping_address?: any;
  status_history?: Array<{
    status: string;
    timestamp: string;
    note?: string;
  }>;
  items: OrderItem[];
}

// Phase 2: Enhanced OrderItem interface
export interface OrderItem {
  order_item_id: number;
  product_variant_id: number;
  sku: string;
  product_name: string;
  brand_name: string;
  category_name: string;
  quantity: number;
  price_at_purchase: number;
  discounted_price?: number;
  final_price?: number;
  subtotal: number;
  currency?: string;
  // Phase 2: Fulfillment
  fulfillment_status?: 'pending' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'returned' | 'refunded';
  tracking_number?: string;
  tracking_url?: string;
  shipped_at?: string;
  delivered_at?: string;
  // Phase 2: Returns
  is_returnable?: boolean;
  return_deadline?: string;
  can_return?: boolean;
  image_url?: string;
}

// Supplier Return Request interface
export interface SupplierReturnRequest {
  id: number;
  return_id: string;
  order_id: number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  status: 'requested' | 'approved' | 'rejected' | 'shipped' | 'received' | 'completed' | 'cancelled';
  resolution_type: 'refund' | 'replacement';
  refund_status?: 'pending' | 'processing' | 'completed' | 'failed';
  created_at: string;
  status_updated_at?: string;
  items_count: number;
  total_quantity: number;
  items?: Array<{
    return_item_id: number;
    order_item_id: number;
    product_name: string;
    product_variant_id: number;
    sku: string;
    quantity: number;
    reason: string;
    price_at_purchase: number;
    subtotal: number;
    image_url?: string;
  }>;
  order?: {
    id: number;
    order_number: string;
    total_amount: number;
    currency: string;
    order_date: string;
  };
  status_history?: Array<{
    status: string;
    timestamp: string;
    notes?: string;
  }>;
  pickup_address?: any;
  pickup_scheduled_at?: string;
  refund_amount?: number;
  refund_id?: string;
}

// Supplier Analytics interface
export interface SupplierAnalytics {
  summary: {
    total_revenue: number;
    total_orders: number;
    total_items_sold: number;
    total_items_returned: number;
    average_order_value: number;
    return_rate: number;
    pending_orders: number;
    shipped_orders: number;
    delivered_orders: number;
  };
  daily_stats: Array<{
    date: string;
    orders_count: number;
    revenue: number;
    items_sold: number;
  }>;
  top_products: Array<{
    product_id: number;
    product_name: string;
    total_quantity: number;
    total_revenue: number;
    order_count: number;
  }>;
  sales_by_status: Array<{
    status: string;
    item_count: number;
    total_quantity: number;
    total_revenue: number;
  }>;
  returns_summary: {
    total_returned_items: number;
    total_returned_value: number;
    total_return_requests: number;
    approved_returns: number;
    rejected_returns: number;
    completed_returns: number;
  };
  period: {
    start_date: string;
    end_date: string;
  };
}

// Supplier Payment interface
export interface SupplierPayment {
  id: number;
  payment_id: string;
  supplier_profile_id: number;
  amount: number;
  net_amount: number;
  currency: string;
  payment_method: 'bank_transfer' | 'upi' | 'neft' | 'rtgs';
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';
  period_start_date: string;
  period_end_date: string;
  created_at: string;
  processed_at?: string;
  commission_deducted?: number;
  commission_rate?: number;
  notes?: string;
  bank_account_details?: any;
  processed_by?: {
    id: number;
    name: string;
  };
  supplier_profile?: {
    id: number;
    business_name?: string;
  };
}

export interface KYCDocument {
  id: number;
  filename: string;
  content_type: string;
  byte_size: number;
  url: string;
  created_at: string;
  size: string;
}

export interface SupplierProfile {
  id: number;
  company_name: string;
  gst_number: string;
  description?: string;
  website_url?: string;
  verified: boolean;
  needs_completion?: boolean;
  // Phase 1: New fields
  supplier_tier?: 'basic' | 'verified' | 'premium' | 'partner';
  owner_id?: number;
  owner?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  is_active?: boolean;
  is_suspended?: boolean;
  contact_email?: string;
  contact_phone?: string;
  support_email?: string;
  support_phone?: string;
  business_type?: string;
  business_category?: string;
  company_registration_number?: string;
  pan_number?: string;
  cin_number?: string;
  // KYC Documents
  kyc_documents?: KYCDocument[];
}

// Phase 2: Enhanced ProductVariantForm interface
export interface ProductVariantForm {
  sku: string;
  price: string;
  discounted_price: string;
  mrp?: string;
  cost_price?: string;
  stock_quantity: string;
  reserved_quantity?: string;
  low_stock_threshold?: string;
  weight_kg: string;
  currency?: string;
  barcode?: string;
  ean_code?: string;
  isbn?: string;
  image_urls: string[];
  attribute_value_ids?: number[];
}

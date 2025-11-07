// Advanced Product Filter Types

export interface ProductFilters {
  // Pagination
  page?: number;
  per_page?: number;
  
  // Price filters
  min_price?: number;
  max_price?: number;
  
  // Category filters
  category_id?: number;
  category_slug?: string;
  category_ids?: number[];
  
  // Brand filters
  brand_id?: number;
  brand_slug?: string;
  brand_ids?: number[];
  
  // Phase 2 flag filters
  featured?: boolean;
  bestseller?: boolean;
  new_arrival?: boolean;
  trending?: boolean;
  
  // Stock filters
  in_stock?: boolean;
  
  // Rating filters
  min_rating?: number;
  
  // Attribute filters (array of attribute_value_ids)
  attribute_values?: number[];
  
  // Search
  query?: string;
  
  // Sorting
  sort_by?: 'recommended' | 'price_low_high' | 'price_high_low' | 'newest' | 'oldest' | 'rating' | 'popular' | 'name_asc' | 'name_desc';
  
  // Status
  status?: string;
}

export interface FilterOption {
  value: string | number;
  label: string;
  count?: number;
}

export interface SortOption {
  value: ProductFilters['sort_by'];
  label: string;
}

export interface AvailableFilters {
  price_range: {
    min: number;
    max: number;
  };
  categories: Array<{
    id: number;
    name: string;
    slug?: string;
  }>;
  brands: Array<{
    id: number;
    name: string;
    slug?: string;
  }>;
  sort_options: SortOption[];
  flags: Array<{
    key: string;
    label: string;
  }>;
}

export interface AppliedFilter {
  type: string;
  label?: string;
  value?: any;
  min?: number;
  max?: number;
}

export interface FilterResult {
  products: any[];
  pagination: {
    total_count: number;
    total_pages: number;
    current_page: number;
    per_page: number;
  };
  filters_applied: AppliedFilter[];
  available_filters?: AvailableFilters;
}



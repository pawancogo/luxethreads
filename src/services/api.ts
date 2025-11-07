import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    // Check if this is an admin route
    const isAdminRoute = config.url?.includes('/admin/') && !config.url?.includes('/admin/login');
    
    if (isAdminRoute) {
      const adminToken = localStorage.getItem('admin_token');
      if (adminToken) {
        config.headers.Authorization = `Bearer ${adminToken}`;
      }
    } else {
      const token = localStorage.getItem('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    // Handle response format from backend: { success, message, data }
    if (response.data && response.data.success !== undefined) {
      // Backend standardized response format
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      // If success is false, treat as error
      if (!response.data.success) {
        const message = response.data.message || 'Operation failed';
        const errors = response.data.errors || [];
        const error = new Error(message) as any;
        error.errors = errors;
        return Promise.reject(error);
      }
    }
    // Fallback for non-standard responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    return response.data;
  },
  (error) => {
    if (error.response) {
      // Handle API errors from backend
      const responseData = error.response.data || {};
      const status = error.response.status;
      const message = responseData.message || responseData.error || error.message || 'An error occurred';
      
      // Check for account deactivated or unauthorized errors (401)
      if (status === 401 || message.toLowerCase().includes('deactivated') || message.toLowerCase().includes('account has been')) {
        // Automatically logout and redirect to login
        const clearAuthData = () => {
          // Clear localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('auth_token');
          
          // Clear specific auth cookies
          document.cookie = 'authtoken=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;';
          
          // Clear all other cookies
          document.cookie.split(";").forEach((c) => {
            document.cookie = c
              .replace(/^ +/, "")
              .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
          });
        };
        
        clearAuthData();
        
        // Redirect to login page
        if (window.location.pathname !== '/auth') {
          window.location.href = '/auth';
        }
        
        // Return error to caller
        const errorObj = new Error(message) as any;
        errorObj.errors = responseData.errors || [];
        errorObj.status = status;
        errorObj.isAuthError = true;
        return Promise.reject(errorObj);
      }
      
      // Backend error format: { success: false, message, errors }
      if (responseData.success === false) {
        const errors = responseData.errors || [];
        const errorObj = new Error(message) as any;
        errorObj.errors = errors;
        errorObj.status = status;
        return Promise.reject(errorObj);
      }
      
      // Fallback error handling
      const errors = responseData.errors || [];
      const errorObj = new Error(message) as any;
      errorObj.errors = errors;
      errorObj.status = status;
      return Promise.reject(errorObj);
    }
    return Promise.reject(error);
  }
);

// ==================== Authentication ====================
export const authAPI = {
  signup: async (userData: {
    first_name: string;
    last_name: string;
    email: string;
    phone_number: string;
    password: string;
    role: string;
  }) => {
    const response = await api.post('/signup', { user: userData });
    // @ts-ignore - Response may have token property
    if (response?.token) {
      // @ts-ignore
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  login: async (email: string, password: string) => {
    const response = await api.post('/login', { email, password });
    // @ts-ignore - Response may have token property
    if (response?.token) {
      // @ts-ignore
      localStorage.setItem('auth_token', response.token);
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
  },

  // Password Reset
  forgotPassword: async (email: string) => {
    return api.post('/password/forgot', { email });
  },

  resetPassword: async (email: string, tempPassword: string, newPassword: string, passwordConfirmation?: string) => {
    return api.post('/password/reset', {
      email,
      temp_password: tempPassword,
      new_password: newPassword,
      password_confirmation: passwordConfirmation || newPassword,
    });
  },
};

// ==================== Admin Authentication ====================
export const adminAuthAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/admin/login', { email, password });
    // @ts-ignore - Response may have token property
    if (response?.token) {
      // @ts-ignore
      localStorage.setItem('admin_token', response.token);
      // @ts-ignore
      if (response?.admin) {
        // @ts-ignore
        localStorage.setItem('admin', JSON.stringify(response.admin));
      }
    }
    return response;
  },

  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
  },
};

// ==================== RBAC Management ====================
export const rbacAPI = {
  // Get all roles
  getRoles: async (roleType?: 'admin' | 'supplier') => {
    const params = roleType ? { role_type: roleType } : {};
    return api.get('/admin/rbac/roles', { params });
  },

  // Get all permissions
  getPermissions: async (category?: string) => {
    const params = category ? { category } : {};
    return api.get('/admin/rbac/permissions', { params });
  },

  // Get roles assigned to an admin
  getAdminRoles: async (adminId: string | number) => {
    return api.get(`/admin/rbac/admins/${adminId}/roles`);
  },

  // Assign role to admin
  assignRole: async (
    adminId: string | number,
    roleSlug: string,
    expiresAt?: string,
    customPermissions?: Record<string, boolean>
  ) => {
    return api.post(`/admin/rbac/admins/${adminId}/assign_role`, {
      role_slug: roleSlug,
      expires_at: expiresAt,
      custom_permissions: customPermissions,
    });
  },

  // Remove role from admin
  removeRole: async (adminId: string | number, roleSlug: string) => {
    return api.delete(`/admin/rbac/admins/${adminId}/remove_role/${roleSlug}`);
  },

  // Update custom permissions for an admin role
  updatePermissions: async (
    adminId: string | number,
    roleSlug: string,
    customPermissions: Record<string, boolean>
  ) => {
    return api.patch(`/admin/rbac/admins/${adminId}/update_permissions`, {
      role_slug: roleSlug,
      custom_permissions: customPermissions,
    });
  },
};

// ==================== Admin User Management ====================
export const adminUsersAPI = {
  getUsers: async (params?: {
    page?: number;
    per_page?: number;
    email?: string;
    search?: string;
    role?: string;
    active?: boolean;
  }) => {
    return api.get('/admin/users', { params });
  },

  getUser: async (userId: string | number) => {
    return api.get(`/admin/users/${userId}`);
  },

  updateUser: async (userId: string | number, userData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
  }) => {
    return api.patch(`/admin/users/${userId}`, { user: userData });
  },

  deleteUser: async (userId: string | number) => {
    return api.delete(`/admin/users/${userId}`);
  },

  activateUser: async (userId: string | number) => {
    return api.patch(`/admin/users/${userId}/activate`);
  },

  deactivateUser: async (userId: string | number) => {
    return api.patch(`/admin/users/${userId}/deactivate`);
  },

  getUserOrders: async (userId: string | number, params?: { status?: string }) => {
    return api.get(`/admin/users/${userId}/orders`, { params });
  },

  getUserActivity: async (userId: string | number) => {
    return api.get(`/admin/users/${userId}/activity`);
  },
};

// ==================== Admin Supplier Management ====================
export const adminSuppliersAPI = {
  getSuppliers: async (params?: {
    page?: number;
    per_page?: number;
    email?: string;
    search?: string;
    verified?: boolean;
    active?: boolean;
  }) => {
    return api.get('/admin/suppliers', { params });
  },

  getSupplier: async (supplierId: string | number) => {
    return api.get(`/admin/suppliers/${supplierId}`);
  },

  updateSupplier: async (supplierId: string | number, supplierData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    email?: string;
    supplier_profile?: {
      company_name?: string;
      gst_number?: string;
      description?: string;
      website_url?: string;
    };
  }) => {
    return api.patch(`/admin/suppliers/${supplierId}`, { supplier: supplierData });
  },

  deleteSupplier: async (supplierId: string | number) => {
    return api.delete(`/admin/suppliers/${supplierId}`);
  },

  activateSupplier: async (supplierId: string | number) => {
    return api.patch(`/admin/suppliers/${supplierId}/activate`);
  },

  deactivateSupplier: async (supplierId: string | number) => {
    return api.patch(`/admin/suppliers/${supplierId}/deactivate`);
  },

  suspendSupplier: async (supplierId: string | number, suspensionReason?: string) => {
    return api.patch(`/admin/suppliers/${supplierId}/suspend`, { suspension_reason: suspensionReason });
  },

  getSupplierStats: async (supplierId: string | number) => {
    return api.get(`/admin/suppliers/${supplierId}/stats`);
  },
};

// ==================== Admin Product Management ====================
export const adminProductsAPI = {
  getProducts: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    supplier_id?: number;
    category_id?: number;
    brand_id?: number;
    search?: string;
    created_from?: string;
    created_to?: string;
  }) => {
    return api.get('/admin/products', { params });
  },

  getProduct: async (productId: string | number) => {
    return api.get(`/admin/products/${productId}`);
  },

  updateProduct: async (productId: string | number, productData: {
    name?: string;
    description?: string;
    short_description?: string;
    category_id?: number;
    brand_id?: number;
    is_featured?: boolean;
    is_bestseller?: boolean;
    status?: string;
  }) => {
    return api.patch(`/admin/products/${productId}`, { product: productData });
  },

  deleteProduct: async (productId: string | number) => {
    return api.delete(`/admin/products/${productId}`);
  },

  approveProduct: async (productId: string | number) => {
    return api.patch(`/admin/products/${productId}/approve`);
  },

  rejectProduct: async (productId: string | number, rejectionReason: string) => {
    return api.patch(`/admin/products/${productId}/reject`, { rejection_reason: rejectionReason });
  },

  bulkApproveProducts: async (productIds: number[]) => {
    return api.post('/admin/products/bulk_approve', { product_ids: productIds });
  },

  bulkRejectProducts: async (productIds: number[], rejectionReason: string) => {
    return api.post('/admin/products/bulk_reject', { 
      product_ids: productIds,
      rejection_reason: rejectionReason
    });
  },

  exportProducts: async (params?: {
    status?: string;
    supplier_id?: number;
    category_id?: number;
  }) => {
    const response = await api.get('/admin/products/export', { 
      params,
      responseType: 'blob'
    });
    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `products_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return response;
  },
};

// ==================== Admin Order Management ====================
export const adminOrdersAPI = {
  getOrders: async (params?: {
    page?: number;
    per_page?: number;
    status?: string;
    payment_status?: string;
    user_id?: number;
    order_number?: string;
    created_from?: string;
    created_to?: string;
    min_amount?: number;
    max_amount?: number;
  }) => {
    return api.get('/admin/orders', { params });
  },

  getOrder: async (orderId: string | number) => {
    return api.get(`/admin/orders/${orderId}`);
  },

  updateOrder: async (orderId: string | number, orderData: {
    internal_notes?: string;
    tracking_number?: string;
    tracking_url?: string;
  }) => {
    return api.patch(`/admin/orders/${orderId}`, { order: orderData });
  },

  deleteOrder: async (orderId: string | number) => {
    return api.delete(`/admin/orders/${orderId}`);
  },

  cancelOrder: async (orderId: string | number, cancellationReason: string) => {
    return api.patch(`/admin/orders/${orderId}/cancel`, { cancellation_reason: cancellationReason });
  },

  updateOrderStatus: async (orderId: string | number, status: string) => {
    return api.patch(`/admin/orders/${orderId}/update_status`, { status });
  },

  addOrderNote: async (orderId: string | number, note: string) => {
    return api.post(`/admin/orders/${orderId}/notes`, { note });
  },

  getOrderAuditLog: async (orderId: string | number) => {
    return api.get(`/admin/orders/${orderId}/audit_log`);
  },

  refundOrder: async (orderId: string | number, refundData: {
    refund_amount: number;
    refund_reason?: string;
  }) => {
    return api.patch(`/admin/orders/${orderId}/refund`, { refund: refundData });
  },
};

// ==================== Admin Reports & Analytics ====================
export const adminReportsAPI = {
  getSalesReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get('/admin/reports/sales', { params });
  },

  getProductsReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get('/admin/reports/products', { params });
  },

  getUsersReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get('/admin/reports/users', { params });
  },

  getSuppliersReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get('/admin/reports/suppliers', { params });
  },

  getRevenueReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get('/admin/reports/revenue', { params });
  },

  getReturnsReport: async (params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    return api.get('/admin/reports/returns', { params });
  },

  exportReport: async (reportType: string, params?: {
    start_date?: string;
    end_date?: string;
  }) => {
    const response = await api.get('/admin/reports/export', {
      params: { report_type: reportType, ...params },
      responseType: 'blob'
    });
    // Create blob URL and trigger download
    const url = window.URL.createObjectURL(new Blob([response]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    return response;
  },
};

// ==================== Admin Settings ====================
export const adminSettingsAPI = {
  getSettings: async (category?: string) => {
    return api.get('/admin/settings', { params: { category } });
  },

  getSetting: async (key: string) => {
    return api.get(`/admin/settings/${key}`);
  },

  createSetting: async (settingData: {
    key: string;
    value: string | number | boolean;
    value_type: string;
    category: string;
    description?: string;
    is_public?: boolean;
  }) => {
    return api.post('/admin/settings', { setting: settingData });
  },

  updateSetting: async (settingId: number, settingData: Partial<{
    value: string | number | boolean;
    value_type: string;
    category: string;
    description: string;
    is_public: boolean;
  }>) => {
    return api.patch(`/admin/settings/${settingId}`, { setting: settingData });
  },

  deleteSetting: async (settingId: number) => {
    return api.delete(`/admin/settings/${settingId}`);
  },
};

// ==================== Admin Email Templates ====================
export const adminEmailTemplatesAPI = {
  getTemplates: async () => {
    return api.get('/admin/email_templates');
  },

  getTemplate: async (templateId: number) => {
    return api.get(`/admin/email_templates/${templateId}`);
  },

  createTemplate: async (templateData: {
    template_type: string;
    subject: string;
    body_html?: string;
    body_text?: string;
    from_email?: string;
    from_name?: string;
    is_active?: boolean;
    description?: string;
    variables?: Record<string, any>;
  }) => {
    return api.post('/admin/email_templates', { email_template: templateData });
  },

  updateTemplate: async (templateId: number, templateData: Partial<{
    subject: string;
    body_html: string;
    body_text: string;
    from_email: string;
    from_name: string;
    is_active: boolean;
    description: string;
    variables: Record<string, any>;
  }>) => {
    return api.patch(`/admin/email_templates/${templateId}`, { email_template: templateData });
  },

  deleteTemplate: async (templateId: number) => {
    return api.delete(`/admin/email_templates/${templateId}`);
  },

  previewTemplate: async (templateId: number, variables: Record<string, any>) => {
    return api.post(`/admin/email_templates/${templateId}/preview`, { variables });
  },
};

// ==================== Users ====================
export const usersAPI = {
  getUser: async (userId: string | number) => {
    return api.get(`/users/${userId}`);
  },

  updateUser: async (userId: string | number, userData: {
    first_name?: string;
    last_name?: string;
    phone_number?: string;
  }) => {
    return api.patch(`/users/${userId}`, { user: userData });
  },

  deleteUser: async (userId: string | number) => {
    return api.delete(`/users/${userId}`);
  },
};

// ==================== Products ====================
export const productsAPI = {
  // Public products (for customers) - Advanced filtering with ProductFilterService
  getPublicProducts: async (params?: {
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
    search?: string;
    
    // Sorting
    sort_by?: 'recommended' | 'price_low_high' | 'price_high_low' | 'newest' | 'oldest' | 'rating' | 'popular' | 'name_asc' | 'name_desc';
    
    // Status
    status?: string;
  }) => {
    return api.get('/public/products', { params: params || {} });
  },

  // Phase 2: Support slug or ID lookup
  getPublicProduct: async (idOrSlug: string | number) => {
    return api.get(`/public/products/${idOrSlug}`);
  },

  // Supplier products
  getSupplierProducts: async () => {
    return api.get('/products');
  },

  getSupplierProduct: async (id: string | number) => {
    return api.get(`/products/${id}`);
  },

  // Phase 2: Enhanced product creation with Phase 2 fields
  createProduct: async (productData: {
    name: string;
    description: string;
    short_description?: string;
    category_id: number;
    brand_id: number;
    product_type?: string;
    highlights?: string[];
    search_keywords?: string[];
    tags?: string[];
    base_price?: number;
    base_discounted_price?: number;
    base_mrp?: number;
    length_cm?: number;
    width_cm?: number;
    height_cm?: number;
    weight_kg?: number;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_new_arrival?: boolean;
    is_trending?: boolean;
    published_at?: string;
    attribute_value_ids?: number[];
  }) => {
    return api.post('/products', { product: productData });
  },

  // Phase 2: Enhanced product update with Phase 2 fields
  updateProduct: async (id: string | number, productData: Partial<{
    name: string;
    description: string;
    short_description?: string;
    category_id: number;
    brand_id: number;
    product_type?: string;
    highlights?: string[];
    search_keywords?: string[];
    tags?: string[];
    base_price?: number;
    base_discounted_price?: number;
    base_mrp?: number;
    length_cm?: number;
    width_cm?: number;
    height_cm?: number;
    weight_kg?: number;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_new_arrival?: boolean;
    is_trending?: boolean;
    published_at?: string;
    attribute_value_ids?: number[];
  }>) => {
    return api.put(`/products/${id}`, { product: productData });
  },

  deleteProduct: async (id: string | number) => {
    return api.delete(`/products/${id}`);
  },

  // Phase 2: Enhanced product variants with Phase 2 fields
  createVariant: async (productId: string | number, variantData: {
    sku?: string; // Auto-generated by backend
    price: number;
    discounted_price?: number;
    mrp?: number;
    cost_price?: number;
    stock_quantity: number;
    reserved_quantity?: number;
    low_stock_threshold?: number;
    weight_kg?: number;
    currency?: string;
    barcode?: string;
    ean_code?: string;
    isbn?: string;
    image_urls?: string[]; // Array of image URLs
    attribute_value_ids?: number[]; // Array of attribute value IDs (Color, Size, Fabric, etc.)
  }) => {
    return api.post(`/products/${productId}/product_variants`, { product_variant: variantData });
  },

  // Phase 2: Enhanced variant update with Phase 2 fields
  updateVariant: async (productId: string | number, variantId: string | number, variantData: Partial<{
    sku?: string; // Auto-generated by backend, optional for updates
    price: number;
    discounted_price?: number;
    mrp?: number;
    cost_price?: number;
    stock_quantity: number;
    reserved_quantity?: number;
    low_stock_threshold?: number;
    weight_kg?: number;
    currency?: string;
    barcode?: string;
    ean_code?: string;
    isbn?: string;
    image_urls?: string[]; // Array of image URLs
    attribute_value_ids?: number[]; // Array of attribute value IDs (Color, Size, Fabric, etc.)
  }>) => {
    return api.put(`/products/${productId}/product_variants/${variantId}`, { product_variant: variantData });
  },

  deleteVariant: async (productId: string | number, variantId: string | number) => {
    return api.delete(`/products/${productId}/product_variants/${variantId}`);
  },

  // Bulk operations
  bulkUpload: async (formData: FormData) => {
    return api.post('/products/bulk_upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  exportProducts: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/products/export`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Export failed' }));
      throw error;
    }
    return await response.blob();
  },

  downloadTemplate: async () => {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'}/api/v1/products/export_template`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || ''}`,
      },
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Download failed' }));
      throw error;
    }
    return await response.blob();
  },

  // Phase 2: Enhanced search with Phase 2 filters
  searchProducts: async (params: {
    query?: string;
    category_id?: number | string; // Support slug or ID
    brand_id?: number | string; // Support slug or ID
    featured?: boolean;
    bestseller?: boolean;
    new_arrival?: boolean;
    trending?: boolean;
    min_price?: number;
    max_price?: number;
    page?: number;
    per_page?: number;
  }) => {
    return api.get('/search', { params });
  },
};

// ==================== Categories & Brands ====================
// Phase 2: Enhanced categories API with show action
export const categoriesAPI = {
  getAll: async () => {
    return api.get('/categories');
  },
  // Phase 2: Get category by slug or ID
  getBySlugOrId: async (slugOrId: string | number) => {
    return api.get(`/categories/${slugOrId}`);
  },
  // Get navigation structure for menu
  getNavigation: async () => {
    return api.get('/categories/navigation');
  },
};

// Phase 2: Enhanced brands API with show action
export const brandsAPI = {
  getAll: async () => {
    return api.get('/brands');
  },
  // Phase 2: Get brand by slug or ID
  getBySlugOrId: async (slugOrId: string | number) => {
    return api.get(`/brands/${slugOrId}`);
  },
};

// ==================== Attribute Types ====================
export const attributeTypesAPI = {
  getAll: async (level?: 'product' | 'variant', categoryId?: number) => {
    // The axios interceptor already handles the response format and returns data directly
    const params: any = {};
    if (level) params.level = level;
    if (categoryId) params.category_id = categoryId;
    return api.get('/attribute_types', { params });
  },
};

// ==================== Cart ====================
export const cartAPI = {
  getCart: async () => {
    return api.get('/cart');
  },

  addToCart: async (productVariantId: number, quantity: number = 1) => {
    return api.post('/cart_items', {
      product_variant_id: productVariantId,
      quantity,
    });
  },

  updateCartItem: async (cartItemId: number, quantity: number) => {
    return api.put(`/cart_items/${cartItemId}`, { quantity });
  },

  removeFromCart: async (cartItemId: number) => {
    return api.delete(`/cart_items/${cartItemId}`);
  },
};

// ==================== Wishlist ====================
export const wishlistAPI = {
  getWishlist: async () => {
    return api.get('/wishlist/items');
  },

  addToWishlist: async (productVariantId: number) => {
    return api.post('/wishlist/items', {
      product_variant_id: productVariantId,
    });
  },

  removeFromWishlist: async (wishlistItemId: number) => {
    return api.delete(`/wishlist/items/${wishlistItemId}`);
  },
};

// ==================== Addresses ====================
export const addressesAPI = {
  getAddresses: async () => {
    return api.get('/addresses');
  },

  createAddress: async (addressData: {
    address_type: 'shipping' | 'billing';
    full_name: string;
    phone_number: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    label?: string;
    is_default_shipping?: boolean;
    is_default_billing?: boolean;
    delivery_instructions?: string;
  }) => {
    return api.post('/addresses', { address: addressData });
  },

  updateAddress: async (addressId: number, addressData: Partial<{
    full_name: string;
    phone_number: string;
    line1: string;
    line2: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    label?: string;
    is_default_shipping?: boolean;
    is_default_billing?: boolean;
    delivery_instructions?: string;
  }>) => {
    return api.patch(`/addresses/${addressId}`, { address: addressData });
  },

  deleteAddress: async (addressId: number) => {
    return api.delete(`/addresses/${addressId}`);
  },
};

// ==================== Orders ====================
export const ordersAPI = {
  createOrder: async (orderData: {
    shipping_address_id: number;
    billing_address_id: number;
    shipping_method?: string;
    payment_method_id?: string;
    coupon_code?: string;
  }) => {
    return api.post('/orders', { order: orderData });
  },

  getMyOrders: async () => {
    return api.get('/my-orders');
  },

  getOrderDetails: async (orderId: string | number) => {
    return api.get(`/my-orders/${orderId}`);
  },

  cancelOrder: async (orderId: string | number, cancellationReason: string) => {
    return api.patch(`/my-orders/${orderId}/cancel`, {
      cancellation_reason: cancellationReason,
    });
  },

  downloadInvoice: async (orderId: string | number) => {
    const response = await api.get(`/my-orders/${orderId}/invoice`, {
      responseType: 'blob',
    });
    return response;
  },
};

// ==================== Supplier Orders ====================
export const supplierOrdersAPI = {
  getSupplierOrders: async () => {
    return api.get('/supplier/orders');
  },

  getSupplierOrderItem: async (itemId: string | number) => {
    return api.get(`/supplier/orders/${itemId}`);
  },

  confirmOrderItem: async (itemId: string | number) => {
    return api.post(`/supplier/orders/${itemId}/confirm`);
  },

  shipOrderItem: async (itemId: string | number, trackingNumber: string) => {
    return api.put(`/supplier/orders/${itemId}/ship`, { tracking_number: trackingNumber });
  },

  updateTracking: async (itemId: string | number, trackingNumber: string, trackingUrl?: string) => {
    return api.put(`/supplier/orders/${itemId}/update_tracking`, {
      tracking_number: trackingNumber,
      tracking_url: trackingUrl,
    });
  },
};

// ==================== Supplier Returns ====================
export const supplierReturnsAPI = {
  getSupplierReturns: async (params?: { status?: string }) => {
    return api.get('/supplier/returns', { params });
  },

  getSupplierReturn: async (returnId: string | number) => {
    return api.get(`/supplier/returns/${returnId}`);
  },

  getReturnTracking: async (returnId: string | number) => {
    return api.get(`/supplier/returns/${returnId}/tracking`);
  },

  approveReturn: async (returnId: string | number, notes?: string) => {
    return api.post(`/supplier/returns/${returnId}/approve`, {
      notes,
    });
  },

  rejectReturn: async (returnId: string | number, rejectionReason: string) => {
    return api.post(`/supplier/returns/${returnId}/reject`, {
      rejection_reason: rejectionReason,
    });
  },
};

// ==================== Supplier Analytics ====================
export const supplierAnalyticsAPI = {
  getAnalytics: async (params?: { start_date?: string; end_date?: string }) => {
    return api.get('/supplier/analytics', { params });
  },
};

// ==================== Supplier Profile ====================
// Phase 1: Suppliers are now Users with role='supplier'
// The supplier_profile is linked to User via owner_id
// API endpoints remain the same but now work with unified User model
export const supplierProfileAPI = {
  getProfile: async () => {
    return api.get('/supplier_profile');
  },

  createProfile: async (profileData: {
    company_name: string;
    gst_number: string;
    description?: string;
    website_url?: string;
    supplier_tier?: 'basic' | 'verified' | 'premium' | 'partner';
    contact_email?: string;
    contact_phone?: string;
  }) => {
    return api.post('/supplier_profile', { supplier_profile: profileData });
  },

  updateProfile: async (profileData: Partial<{
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
    supplier_tier?: 'basic' | 'verified' | 'premium' | 'partner';
    contact_email?: string;
    contact_phone?: string;
  }>) => {
    return api.put('/supplier_profile', { supplier_profile: profileData });
  },
};

// ==================== Supplier Documents (KYC) ====================
export const supplierDocumentsAPI = {
  getDocuments: async () => {
    return api.get('/supplier/documents');
  },

  uploadDocument: async (file: File) => {
    const formData = new FormData();
    formData.append('document[file]', file);
    
    return api.post('/supplier/documents', formData, {
      headers: {
        // Delete Content-Type to let browser set it with boundary for FormData
      },
      transformRequest: [
        (data, headers) => {
          // Remove Content-Type header to let browser set it automatically
          delete headers['Content-Type'];
          return data;
        },
      ],
    });
  },

  deleteDocument: async (documentId: number) => {
    return api.delete(`/supplier/documents/${documentId}`);
  },
};

// ==================== Return Requests ====================
export const returnRequestsAPI = {
  createReturnRequest: async (returnData: {
    order_id: number;
    resolution_type: 'refund' | 'replacement';
    items: Array<{
      order_item_id: number;
      quantity: number;
      reason: string;
    }>;
    media?: Array<{
      file_key: string;
      media_type: 'image' | 'video';
    }>;
  }) => {
    return api.post('/return_requests', {
      return_request: {
        order_id: returnData.order_id,
        resolution_type: returnData.resolution_type,
      },
      items: returnData.items,
      media: returnData.media,
    });
  },

  getMyReturns: async () => {
    return api.get('/my-returns');
  },

  getReturnDetails: async (returnId: string | number) => {
    return api.get(`/return_requests/${returnId}`);
  },

  // Phase 3: Enhanced return tracking
  getReturnTracking: async (returnId: string | number) => {
    return api.get(`/return_requests/${returnId}/tracking`);
  },

  // Phase 3: Schedule pickup
  schedulePickup: async (returnId: string | number, scheduledAt: string) => {
    return api.post(`/return_requests/${returnId}/pickup_schedule`, {
      pickup: { scheduled_at: scheduledAt },
    });
  },

  // Admin return management
  approveReturn: async (returnId: string | number) => {
    return api.patch(`/admin/return_requests/${returnId}/approve`);
  },

  rejectReturn: async (returnId: string | number, rejectionReason?: string) => {
    return api.patch(`/admin/return_requests/${returnId}/reject`, {
      rejection_reason: rejectionReason,
    });
  },

  processRefund: async (returnId: string | number, refundData?: {
    amount?: number;
  }) => {
    return api.patch(`/admin/return_requests/${returnId}/process_refund`, {
      refund: refundData,
    });
  },
};

// ==================== Payments ====================
// Phase 3: Payment system
export const paymentsAPI = {
  createPayment: async (orderId: number, paymentData: {
    amount: number;
    currency?: string;
    payment_method: 'cod' | 'credit_card' | 'debit_card' | 'upi' | 'wallet' | 'netbanking' | 'emi';
    payment_gateway?: string;
    gateway_transaction_id?: string;
    gateway_payment_id?: string;
    card_last4?: string;
    card_brand?: string;
    upi_id?: string;
    wallet_type?: string;
  }) => {
    return api.post(`/orders/${orderId}/payments`, { payment: paymentData });
  },

  getPayment: async (paymentId: string | number) => {
    return api.get(`/payments/${paymentId}`);
  },

  processRefund: async (paymentId: string | number, refundData: {
    amount?: number;
    currency?: string;
    reason: string;
    description?: string;
  }) => {
    return api.post(`/payments/${paymentId}/refund`, { refund: refundData });
  },
};

// ==================== Payment Refunds ====================
// Phase 3: Payment refunds management
export const paymentRefundsAPI = {
  getRefunds: async (params?: {
    status?: string;
    order_id?: number;
  }) => {
    return api.get('/payment_refunds', { params });
  },

  getRefund: async (refundId: string | number) => {
    return api.get(`/payment_refunds/${refundId}`);
  },

  createRefund: async (paymentId: number, refundData: {
    amount?: number;
    currency?: string;
    reason: string;
    description?: string;
  }) => {
    return api.post('/payment_refunds', {
      payment_id: paymentId,
      refund: refundData,
    });
  },
};

// ==================== Supplier Payments ====================
// Phase 3: Supplier payments
export const supplierPaymentsAPI = {
  getSupplierPayments: async (params?: {
    status?: string;
  }) => {
    return api.get('/supplier/payments', { params });
  },

  getSupplierPayment: async (paymentId: string | number) => {
    return api.get(`/supplier/payments/${paymentId}`);
  },

  // Admin endpoints
  getAllSupplierPayments: async (params?: {
    status?: string;
    supplier_profile_id?: number;
  }) => {
    return api.get('/admin/supplier_payments', { params });
  },

  createSupplierPayment: async (paymentData: {
    supplier_profile_id: number;
    amount: number;
    currency?: string;
    payment_method: 'bank_transfer' | 'upi' | 'neft' | 'rtgs';
    period_start_date: string;
    period_end_date: string;
    commission_deducted?: number;
    notes?: string;
  }) => {
    return api.post('/admin/supplier_payments', { supplier_payment: paymentData });
  },

  getSupplierPaymentDetails: async (paymentId: string | number) => {
    return api.get(`/admin/supplier_payments/${paymentId}`);
  },
};

// ==================== Shipping ====================
// Phase 3: Shipping system
export const shippingAPI = {
  getShippingMethods: async () => {
    return api.get('/shipping_methods');
  },

  getOrderShipments: async (orderId: number) => {
    return api.get(`/orders/${orderId}/shipments`);
  },

  getShipment: async (shipmentId: string | number) => {
    return api.get(`/shipments/${shipmentId}`);
  },

  getShipmentTracking: async (shipmentId: string | number) => {
    return api.get(`/shipments/${shipmentId}/tracking`);
  },

  // Supplier shipping
  createShipment: async (shipmentData: {
    order_item_id: number;
    shipping_method_id?: number;
    shipping_provider?: string;
    tracking_number?: string;
    tracking_url?: string;
    from_address?: any;
    to_address?: any;
    weight_kg?: number;
    shipping_charge?: number;
    cod_charge?: number;
  }) => {
    return api.post('/supplier/shipments', { shipment: shipmentData });
  },

  getSupplierShipments: async () => {
    return api.get('/supplier/shipments');
  },

  addTrackingEvent: async (shipmentId: string | number, eventData: {
    event_type: string;
    event_description?: string;
    location?: string;
    city?: string;
    state?: string;
    pincode?: string;
    event_time?: string;
    source?: string;
  }) => {
    return api.post(`/supplier/shipments/${shipmentId}/tracking_events`, { tracking_event: eventData });
  },

  // Admin shipping methods CRUD
  getAllShippingMethods: async (params?: {
    is_active?: boolean;
  }) => {
    return api.get('/admin/shipping_methods', { params });
  },

  createShippingMethod: async (shippingMethodData: {
    name: string;
    code: string;
    description?: string;
    provider?: string;
    base_charge?: number;
    per_kg_charge?: number;
    free_shipping_above?: number;
    estimated_days_min?: number;
    estimated_days_max?: number;
    is_cod_available?: boolean;
    is_active?: boolean;
    available_pincodes?: string[];
    excluded_pincodes?: string[];
  }) => {
    return api.post('/admin/shipping_methods', { shipping_method: shippingMethodData });
  },

  updateShippingMethod: async (shippingMethodId: string | number, shippingMethodData: Partial<{
    name: string;
    code: string;
    description?: string;
    provider?: string;
    base_charge?: number;
    per_kg_charge?: number;
    free_shipping_above?: number;
    estimated_days_min?: number;
    estimated_days_max?: number;
    is_cod_available?: boolean;
    is_active?: boolean;
    available_pincodes?: string[];
    excluded_pincodes?: string[];
  }>) => {
    return api.patch(`/admin/shipping_methods/${shippingMethodId}`, { shipping_method: shippingMethodData });
  },

  deleteShippingMethod: async (shippingMethodId: string | number) => {
    return api.delete(`/admin/shipping_methods/${shippingMethodId}`);
  },
};

// ==================== Coupons ====================
// Phase 3: Coupon system
export const couponsAPI = {
  validateCoupon: async (code: string) => {
    return api.get('/coupons/validate', { params: { code } });
  },

  applyCoupon: async (code: string, orderAmount: number) => {
    return api.post('/coupons/apply', { code, order_amount: orderAmount });
  },

  // Admin coupon CRUD
  getAllCoupons: async (params?: {
    is_active?: boolean;
    coupon_type?: string;
  }) => {
    return api.get('/admin/coupons', { params });
  },

  createCoupon: async (couponData: {
    code: string;
    name: string;
    description?: string;
    coupon_type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_one_get_one';
    discount_value: number;
    max_discount_amount?: number;
    min_order_amount?: number;
    valid_from: string;
    valid_until: string;
    is_active?: boolean;
    max_uses?: number;
    max_uses_per_user?: number;
    is_new_user_only?: boolean;
    is_first_order_only?: boolean;
    applicable_categories?: number[];
    applicable_products?: number[];
    applicable_brands?: number[];
    applicable_suppliers?: number[];
  }) => {
    return api.post('/admin/coupons', { coupon: couponData });
  },

  updateCoupon: async (couponId: string | number, couponData: Partial<{
    code: string;
    name: string;
    description?: string;
    coupon_type: 'percentage' | 'fixed_amount' | 'free_shipping' | 'buy_one_get_one';
    discount_value: number;
    max_discount_amount?: number;
    min_order_amount?: number;
    valid_from: string;
    valid_until: string;
    is_active?: boolean;
    max_uses?: number;
    max_uses_per_user?: number;
    is_new_user_only?: boolean;
    is_first_order_only?: boolean;
    applicable_categories?: number[];
    applicable_products?: number[];
    applicable_brands?: number[];
    applicable_suppliers?: number[];
  }>) => {
    return api.patch(`/admin/coupons/${couponId}`, { coupon: couponData });
  },

  deleteCoupon: async (couponId: string | number) => {
    return api.delete(`/admin/coupons/${couponId}`);
  },
};

// ==================== Promotions ====================
// Phase 3: Promotions system
export const promotionsAPI = {
  getActivePromotions: async (params?: {
    promotion_type?: string;
    featured?: boolean;
  }) => {
    return api.get('/promotions', { params });
  },

  getPromotion: async (promotionId: string | number) => {
    return api.get(`/promotions/${promotionId}`);
  },

  // Admin promotion CRUD
  getAllPromotions: async (params?: {
    is_active?: boolean;
    promotion_type?: string;
  }) => {
    return api.get('/admin/promotions', { params });
  },

  createPromotion: async (promotionData: {
    name: string;
    description?: string;
    promotion_type: 'flash_sale' | 'buy_x_get_y' | 'bundle_deal' | 'seasonal_sale';
    start_date: string;
    end_date: string;
    is_active?: boolean;
    is_featured?: boolean;
    applicable_categories?: number[];
    applicable_products?: number[];
    applicable_brands?: number[];
    applicable_suppliers?: number[];
    discount_percentage?: number;
    discount_amount?: number;
    min_order_amount?: number;
    max_discount_amount?: number;
  }) => {
    return api.post('/admin/promotions', { promotion: promotionData });
  },

  updatePromotion: async (promotionId: string | number, promotionData: Partial<{
    name: string;
    description?: string;
    promotion_type: 'flash_sale' | 'buy_x_get_y' | 'bundle_deal' | 'seasonal_sale';
    start_date: string;
    end_date: string;
    is_active?: boolean;
    is_featured?: boolean;
    applicable_categories?: number[];
    applicable_products?: number[];
    applicable_brands?: number[];
    applicable_suppliers?: number[];
    discount_percentage?: number;
    discount_amount?: number;
    min_order_amount?: number;
    max_discount_amount?: number;
  }>) => {
    return api.patch(`/admin/promotions/${promotionId}`, { promotion: promotionData });
  },

  deletePromotion: async (promotionId: string | number) => {
    return api.delete(`/admin/promotions/${promotionId}`);
  },
};

// ==================== Reviews (Enhanced) ====================
// Phase 3: Enhanced reviews
export const reviewsAPI = {
  createReview: async (productId: number, reviewData: {
    rating: number;
    comment: string;
    title?: string;
    review_images?: string[];
  }) => {
    return api.post(`/products/${productId}/reviews`, { review: reviewData });
  },

  getProductReviews: async (productId: number, params?: {
    moderation_status?: string;
    featured?: boolean;
    verified?: boolean;
  }) => {
    return api.get(`/products/${productId}/reviews`, { params });
  },

  voteHelpful: async (productId: number, reviewId: number, isHelpful: boolean) => {
    return api.post(`/products/${productId}/reviews/${reviewId}/vote`, { is_helpful: isHelpful });
  },

  // Supplier review response
  respondToReview: async (reviewId: number, response: string) => {
    return api.patch(`/supplier/reviews/${reviewId}/respond`, { supplier_response: response });
  },

  // Admin review moderation
  moderateReview: async (reviewId: number, moderationData: {
    moderation_status?: 'pending' | 'approved' | 'rejected' | 'flagged';
    is_featured?: boolean;
    moderation_notes?: string;
  }) => {
    return api.patch(`/admin/reviews/${reviewId}/moderate`, { review: moderationData });
  },
};

// ==================== Phase 4: Notifications ====================
export const notificationsAPI = {
  getNotifications: async (params?: {
    is_read?: boolean;
    notification_type?: string;
    limit?: number;
    offset?: number;
  }) => {
    return api.get('/notifications', { params });
  },

  getNotification: async (notificationId: number) => {
    return api.get(`/notifications/${notificationId}`);
  },

  markAsRead: async (notificationId: number) => {
    return api.patch(`/notifications/${notificationId}/mark_as_read`);
  },

  markAllAsRead: async () => {
    return api.patch('/notifications/mark_all_read');
  },

  getUnreadCount: async () => {
    return api.get('/notifications/unread_count');
  },
};

// ==================== Phase 4: Notification Preferences ====================
export const notificationPreferencesAPI = {
  getPreferences: async () => {
    return api.get('/notification_preferences');
  },

  updatePreferences: async (preferences: {
    email?: Record<string, boolean>;
    sms?: Record<string, boolean>;
    push?: Record<string, boolean>;
  }) => {
    return api.patch('/notification_preferences', { preferences });
  },
};

// ==================== Phase 4: Support Tickets ====================
export const supportTicketsAPI = {
  getTickets: async (params?: { status?: string }) => {
    return api.get('/support_tickets', { params });
  },

  getTicket: async (ticketId: number) => {
    return api.get(`/support_tickets/${ticketId}`);
  },

  createTicket: async (ticketData: {
    subject: string;
    description: string;
    category?: 'order_issue' | 'product_issue' | 'payment_issue' | 'account_issue' | 'other';
    priority?: 'low' | 'medium' | 'high' | 'urgent';
    order_id?: number;
    product_id?: number;
    initial_message?: string;
  }) => {
    return api.post('/support_tickets', { support_ticket: ticketData });
  },

  sendMessage: async (ticketId: number, messageData: {
    message: string;
    attachments?: string[];
  }) => {
    return api.post(`/support_tickets/${ticketId}/messages`, { message: messageData });
  },

  // Admin methods
  adminGetTickets: async (params?: {
    status?: string;
    priority?: string;
    assigned_to_id?: number;
    category?: string;
  }) => {
    return api.get('/admin/support_tickets', { params });
  },

  adminGetTicket: async (ticketId: number) => {
    return api.get(`/admin/support_tickets/${ticketId}`);
  },

  adminAssignTicket: async (ticketId: number, assignedToId?: number) => {
    return api.patch(`/admin/support_tickets/${ticketId}/assign`, { assigned_to_id: assignedToId });
  },

  adminResolveTicket: async (ticketId: number, resolution?: string) => {
    return api.patch(`/admin/support_tickets/${ticketId}/resolve`, { resolution });
  },

  adminCloseTicket: async (ticketId: number) => {
    return api.patch(`/admin/support_tickets/${ticketId}/close`);
  },
};

// ==================== Phase 4: Loyalty Points ====================
export const loyaltyPointsAPI = {
  getTransactions: async (params?: {
    transaction_type?: 'earned' | 'redeemed' | 'expired' | 'adjusted';
  }) => {
    return api.get('/loyalty_points', { params });
  },

  getBalance: async () => {
    return api.get('/loyalty_points/balance');
  },
};

// ==================== Phase 4: Product Views (Analytics) ====================
export const productViewsAPI = {
  trackView: async (productId: number, params?: {
    product_variant_id?: number;
    source?: 'search' | 'category' | 'brand' | 'direct' | 'recommendation';
    session_id?: string;
  }) => {
    return api.post(`/products/${productId}/views`, params);
  },
};

export default api;

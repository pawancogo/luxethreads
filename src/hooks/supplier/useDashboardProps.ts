import React from 'react';
import { SupplierProduct, SupplierOrder, SupplierProfile, SupplierReturnRequest, SupplierPayment, Category, Brand, ProductVariantForm } from '@/components/supplier/types';

export interface ProductTabProps {
  products: SupplierProduct[];
  isLoadingProducts: boolean;
  onProductsRefresh?: () => void;
  categories: Category[];
  brands: Brand[];
  isAddProductOpen: boolean;
  isAddVariantOpen: boolean;
  isEditProductOpen: boolean;
  selectedProductId: number | null;
  editingProduct: SupplierProduct | null;
  productCreationStep: 'product' | 'variants';
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
  productVariants: ProductVariantForm[];
  newVariant: {
    sku: string;
    price: string;
    discounted_price: string;
    stock_quantity: string;
    weight_kg: string;
    image_urls: string[];
    attribute_value_ids?: number[];
  };
  editingProductForm?: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
  onAddProductOpenChange: (open: boolean) => void;
  onProductFormChange: (field: string, value: string) => void;
  onStepChange: (step: 'product' | 'variants') => void;
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onUpdateVariant: (index: number, field: string, value: string) => void;
  onAddImageUrl: (variantIndex: number) => void;
  onRemoveImageUrl: (variantIndex: number, imageIndex: number) => void;
  onUpdateImageUrl: (variantIndex: number, imageIndex: number, value: string) => void;
  onCreateProduct: () => void;
  onCreateAllVariants: () => void;
  onCancelProductCreation: () => void;
  onAddVariantOpenChange: (open: boolean, productId?: number) => void;
  onNewVariantChange: (field: string, value: string) => void;
  onAddImageUrlToNewVariant?: () => void;
  onRemoveImageUrlFromNewVariant?: (imageIndex: number) => void;
  onUpdateImageUrlInNewVariant?: (imageIndex: number, value: string) => void;
  onCreateVariant: () => void;
  onEditProductOpenChange: (open: boolean, product?: SupplierProduct) => void;
  onEditingProductChange: (field: string, value: string) => void;
  onUpdateProduct: () => void;
  onDeleteProduct: (productId: number) => void;
  onEditVariant?: (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
  }) => Promise<void>;
  onDeleteVariant?: (productId: number, variantId: number) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
  getProductMinPrice: (product: SupplierProduct) => string;
  getProductTotalStock: (product: SupplierProduct) => number;
}

export interface OrderTabProps {
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  onConfirmOrderItem: (orderItemId: number) => Promise<void>;
  onShipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  onUpdateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

export interface ReturnsTabProps {
  returns: SupplierReturnRequest[];
  isLoadingReturns: boolean;
  onApproveReturn: (returnId: number, notes?: string) => Promise<void>;
  onRejectReturn: (returnId: number, rejectionReason: string) => Promise<void>;
}

export interface PayoutsTabProps {
  payments: SupplierPayment[];
  isLoadingPayments: boolean;
}

export interface ProfileTabProps {
  supplierProfile: SupplierProfile | null;
  isLoadingProfile: boolean;
  isEditingProfile: boolean;
  profileForm: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  };
  onEditProfile: () => void;
  onCancelEdit: () => void;
  onUpdateProfile: () => void;
  onProfileFormChange: (field: string, value: string) => void;
  onProfileRefresh?: () => void;
}

export const useDashboardProps = (props: {
  // Data
  products: SupplierProduct[];
  orders: SupplierOrder[];
  profile: SupplierProfile | null;
  categories: Category[];
  brands: Brand[];
  // Loading states
  isLoadingProducts: boolean;
  isLoadingOrders: boolean;
  isLoadingProfile: boolean;
  // Refresh callbacks
  onProductsRefresh?: () => void;
  onProfileRefresh?: () => void;
  // Product creation
  isAddProductOpen: boolean;
  onAddProductOpenChange: (open: boolean) => void;
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
  onProductFormChange: (field: string, value: string) => void;
  productCreationStep: 'product' | 'variants';
  onStepChange: (step: 'product' | 'variants') => void;
  productVariants: ProductVariantForm[];
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onUpdateVariant: (index: number, field: string, value: string) => void;
  onAddImageUrl: (variantIndex: number) => void;
  onRemoveImageUrl: (variantIndex: number, imageIndex: number) => void;
  onUpdateImageUrl: (variantIndex: number, imageIndex: number, value: string) => void;
  onCreateProduct: () => void;
  onCreateAllVariants: () => void;
  onCancelProductCreation: () => void;
  // Edit product
  isEditProductOpen: boolean;
  editingProduct: SupplierProduct | null;
  onEditProductOpenChange: (open: boolean, product?: SupplierProduct) => void;
  onEditingProductChange: (field: string, value: string) => void;
  onUpdateProduct: () => void;
  onDeleteProduct: (productId: number) => void;
  editingProductForm?: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
  // Add variant
  isAddVariantOpen: boolean;
  selectedProductId: number | null;
  onAddVariantOpenChange: (open: boolean, productId?: number) => void;
  newVariant: {
    sku: string;
    price: string;
    discounted_price: string;
    stock_quantity: string;
    weight_kg: string;
    image_urls: string[];
    attribute_value_ids?: number[];
  };
  onNewVariantChange: (field: string, value: string | number[]) => void;
  onAddImageUrlToNewVariant?: () => void;
  onRemoveImageUrlFromNewVariant?: (imageIndex: number) => void;
  onUpdateImageUrlInNewVariant?: (imageIndex: number, value: string) => void;
  onCreateVariant: () => void;
  onEditVariant?: (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
  }) => Promise<void>;
  onDeleteVariant?: (productId: number, variantId: number) => Promise<void>;
  // Order actions
  onConfirmOrderItem: (orderItemId: number) => Promise<void>;
  onShipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  onUpdateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
  // Returns
  returns: SupplierReturnRequest[];
  isLoadingReturns: boolean;
  onApproveReturn: (returnId: number, notes?: string) => Promise<void>;
  onRejectReturn: (returnId: number, rejectionReason: string) => Promise<void>;
  // Payouts
  payments: SupplierPayment[];
  isLoadingPayments: boolean;
  // Profile
  isEditingProfile: boolean;
  profileForm: {
    company_name: string;
    gst_number: string;
    description: string;
    website_url: string;
  };
  onProfileFormChange: (field: string, value: string) => void;
  onEditProfile: () => void;
  onCancelEdit: () => void;
  onUpdateProfile: () => void;
  // Utility functions
  getStatusBadge: (status: string) => React.ReactNode;
  getProductMinPrice: (product: SupplierProduct) => string;
  getProductTotalStock: (product: SupplierProduct) => number;
}) => {
  const productTabProps: ProductTabProps = {
    products: props.products,
    isLoadingProducts: props.isLoadingProducts,
    onProductsRefresh: props.onProductsRefresh,
    categories: props.categories,
    brands: props.brands,
    isAddProductOpen: props.isAddProductOpen,
    isAddVariantOpen: props.isAddVariantOpen,
    isEditProductOpen: props.isEditProductOpen,
    selectedProductId: props.selectedProductId,
    editingProduct: props.editingProduct,
    productCreationStep: props.productCreationStep,
    productForm: props.productForm,
    productVariants: props.productVariants,
    newVariant: props.newVariant,
    editingProductForm: props.editingProductForm,
    onAddProductOpenChange: props.onAddProductOpenChange,
    onProductFormChange: props.onProductFormChange,
    onStepChange: props.onStepChange,
    onAddVariant: props.onAddVariant,
    onRemoveVariant: props.onRemoveVariant,
    onUpdateVariant: props.onUpdateVariant,
    onAddImageUrl: props.onAddImageUrl,
    onRemoveImageUrl: props.onRemoveImageUrl,
    onUpdateImageUrl: props.onUpdateImageUrl,
    onCreateProduct: props.onCreateProduct,
    onCreateAllVariants: props.onCreateAllVariants,
    onCancelProductCreation: props.onCancelProductCreation,
    onAddVariantOpenChange: props.onAddVariantOpenChange,
    onNewVariantChange: props.onNewVariantChange,
    onAddImageUrlToNewVariant: props.onAddImageUrlToNewVariant,
    onRemoveImageUrlFromNewVariant: props.onRemoveImageUrlFromNewVariant,
    onUpdateImageUrlInNewVariant: props.onUpdateImageUrlInNewVariant,
    onCreateVariant: props.onCreateVariant,
    onEditVariant: props.onEditVariant,
    onDeleteVariant: props.onDeleteVariant,
    onEditProductOpenChange: props.onEditProductOpenChange,
    onEditingProductChange: props.onEditingProductChange,
    onUpdateProduct: props.onUpdateProduct,
    onDeleteProduct: props.onDeleteProduct,
    getStatusBadge: props.getStatusBadge,
    getProductMinPrice: props.getProductMinPrice,
    getProductTotalStock: props.getProductTotalStock,
  };

  const orderTabProps: OrderTabProps = {
    orders: props.orders,
    isLoadingOrders: props.isLoadingOrders,
    onConfirmOrderItem: props.onConfirmOrderItem,
    onShipOrder: props.onShipOrder,
    onUpdateTracking: props.onUpdateTracking,
    getStatusBadge: props.getStatusBadge,
  };

  const returnsTabProps: ReturnsTabProps = {
    returns: props.returns,
    isLoadingReturns: props.isLoadingReturns,
    onApproveReturn: props.onApproveReturn,
    onRejectReturn: props.onRejectReturn,
  };

  const payoutsTabProps: PayoutsTabProps = {
    payments: props.payments,
    isLoadingPayments: props.isLoadingPayments,
  };

  const profileTabProps: ProfileTabProps = {
    supplierProfile: props.profile,
    isLoadingProfile: props.isLoadingProfile,
    isEditingProfile: props.isEditingProfile,
    profileForm: props.profileForm,
    onEditProfile: props.onEditProfile,
    onCancelEdit: props.onCancelEdit,
    onUpdateProfile: props.onUpdateProfile,
    onProfileFormChange: props.onProfileFormChange,
    onProfileRefresh: props.onProfileRefresh,
  };

  return {
    productTabProps,
    orderTabProps,
    returnsTabProps,
    payoutsTabProps,
    profileTabProps,
  };
};


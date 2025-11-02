import React from 'react';
import { SupplierProduct, SupplierOrder, SupplierProfile, Category, Brand, ProductVariantForm } from '@/components/supplier/types';

export interface ProductTabProps {
  products: SupplierProduct[];
  isLoadingProducts: boolean;
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
  getStatusBadge: (status: string) => React.ReactNode;
  getProductMinPrice: (product: SupplierProduct) => string;
  getProductTotalStock: (product: SupplierProduct) => number;
}

export interface OrderTabProps {
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  isShipOrderOpen: boolean;
  selectedOrderItemId: number | null;
  selectedOrderId: number | null;
  trackingNumber: string;
  onShipOrder: () => void;
  onTrackingNumberChange: (value: string) => void;
  onShipOrderDialogChange: (open: boolean, orderItemId?: number, orderId?: number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
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
  // Ship order
  isShipOrderOpen: boolean;
  selectedOrderItemId: number | null;
  selectedOrderId: number | null;
  trackingNumber: string;
  onTrackingNumberChange: (value: string) => void;
  onShipOrderOpenChange: (open: boolean, orderItemId?: number, orderId?: number) => void;
  onShipOrder: () => void;
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
    isShipOrderOpen: props.isShipOrderOpen,
    selectedOrderItemId: props.selectedOrderItemId,
    selectedOrderId: props.selectedOrderId,
    trackingNumber: props.trackingNumber,
    onShipOrder: props.onShipOrder,
    onTrackingNumberChange: props.onTrackingNumberChange,
    onShipOrderDialogChange: props.onShipOrderOpenChange,
    getStatusBadge: props.getStatusBadge,
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
  };

  return {
    productTabProps,
    orderTabProps,
    profileTabProps,
  };
};


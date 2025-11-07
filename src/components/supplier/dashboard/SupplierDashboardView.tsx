import React from 'react';
import { useUser } from '@/contexts/UserContext';
import StatsCards from '../StatsCards';
import DashboardHeader from './DashboardHeader';
import DashboardTabs from './DashboardTabs';
import AccessDenied from './AccessDenied';
import { useDashboardProps } from '@/hooks/supplier/useDashboardProps';
import {
  SupplierProduct,
  SupplierOrder,
  SupplierProfile,
  SupplierReturnRequest,
  SupplierPayment,
  Category,
  Brand,
  ProductVariantForm,
} from '../types';

interface SupplierDashboardViewProps {
  // Data
  products: SupplierProduct[];
  orders: SupplierOrder[];
  onProductsRefresh?: () => void;
  profile: SupplierProfile | null;
  categories: Category[];
  brands: Brand[];
  // Loading states
  isLoadingProducts: boolean;
  isLoadingOrders: boolean;
  isLoadingProfile: boolean;
  isLoadingCategories: boolean;
  isLoadingBrands: boolean;
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
  createdProductId: number | null;
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
  onProfileRefresh?: () => void;
  // Utility functions
  getStatusBadge: (status: string) => React.ReactNode;
  getProductMinPrice: (product: SupplierProduct) => string;
  getProductTotalStock: (product: SupplierProduct) => number;
}

const SupplierDashboardView: React.FC<SupplierDashboardViewProps> = (props) => {
  const { user } = useUser();

  if (!user || user.role !== 'supplier') {
    return <AccessDenied />;
  }

  // Group props by functionality using hook
  const { productTabProps, orderTabProps, returnsTabProps, payoutsTabProps, profileTabProps } = useDashboardProps({
    ...props,
    getStatusBadge: props.getStatusBadge,
    getProductMinPrice: props.getProductMinPrice,
    getProductTotalStock: props.getProductTotalStock,
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader profile={props.profile} userName={user?.name} />
        <StatsCards products={props.products} orders={props.orders} />
        <DashboardTabs
          productTabProps={productTabProps}
          orderTabProps={orderTabProps}
          returnsTabProps={returnsTabProps}
          payoutsTabProps={payoutsTabProps}
          profileTabProps={profileTabProps}
        />
      </div>
    </div>
  );
};

export default SupplierDashboardView;


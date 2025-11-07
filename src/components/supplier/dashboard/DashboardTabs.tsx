import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductsTab from '../ProductsTab';
import OrdersTab from '../OrdersTab';
import AnalyticsTab from '../AnalyticsTab';
import ProfileTab from '../ProfileTab';
import ReturnsTab from '../ReturnsTab';
import PayoutsTab from '../PayoutsTab';
import { SupplierProduct, SupplierOrder, SupplierProfile, SupplierReturnRequest, SupplierPayment, Category, Brand, ProductVariantForm } from '../types';

interface ProductTabProps {
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
  onEditVariant?: (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
  }) => Promise<void>;
  onDeleteVariant?: (productId: number, variantId: number) => Promise<void>;
  onEditProductOpenChange: (open: boolean, product?: SupplierProduct) => void;
  onEditingProductChange: (field: string, value: string) => void;
  onUpdateProduct: () => void;
  onDeleteProduct: (productId: number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getProductMinPrice: (product: SupplierProduct) => string;
  getProductTotalStock: (product: SupplierProduct) => number;
}

interface OrderTabProps {
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  onConfirmOrderItem: (orderItemId: number) => Promise<void>;
  onShipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  onUpdateTracking: (orderItemId: number, trackingNumber: string, trackingUrl?: string) => Promise<void>;
  getStatusBadge: (status: string) => React.ReactNode;
}

interface ProfileTabProps {
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

interface ReturnsTabProps {
  returns: SupplierReturnRequest[];
  isLoadingReturns: boolean;
  onApproveReturn: (returnId: number, notes?: string) => Promise<void>;
  onRejectReturn: (returnId: number, rejectionReason: string) => Promise<void>;
}

interface PayoutsTabProps {
  payments: SupplierPayment[];
  isLoadingPayments: boolean;
}

interface DashboardTabsProps {
  productTabProps: ProductTabProps;
  orderTabProps: OrderTabProps;
  returnsTabProps: ReturnsTabProps;
  payoutsTabProps: PayoutsTabProps;
  profileTabProps: ProfileTabProps;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  productTabProps,
  orderTabProps,
  returnsTabProps,
  payoutsTabProps,
  profileTabProps,
}) => {
  return (
    <Tabs defaultValue="products" className="space-y-6">
      <TabsList className="grid w-full grid-cols-6">
        <TabsTrigger value="products">My Products</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="returns">Returns</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="payouts">Payouts</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <ProductsTab {...productTabProps} onProductsRefresh={productTabProps.onProductsRefresh} />
      </TabsContent>

      <TabsContent value="orders">
        <OrdersTab {...orderTabProps} />
      </TabsContent>

      <TabsContent value="returns">
        <ReturnsTab {...returnsTabProps} />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="payouts">
        <PayoutsTab {...payoutsTabProps} />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileTab {...profileTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;


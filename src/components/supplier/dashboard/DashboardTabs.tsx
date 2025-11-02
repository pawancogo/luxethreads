import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProductsTab from '../ProductsTab';
import OrdersTab from '../OrdersTab';
import AnalyticsTab from '../AnalyticsTab';
import ProfileTab from '../ProfileTab';
import { SupplierProduct, SupplierOrder, SupplierProfile, Category, Brand, ProductVariantForm } from '../types';

interface ProductTabProps {
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
  isShipOrderOpen: boolean;
  selectedOrderItemId: number | null;
  selectedOrderId: number | null;
  trackingNumber: string;
  onShipOrder: () => void;
  onTrackingNumberChange: (value: string) => void;
  onShipOrderDialogChange: (open: boolean, orderItemId?: number, orderId?: number) => void;
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
}

interface DashboardTabsProps {
  productTabProps: ProductTabProps;
  orderTabProps: OrderTabProps;
  profileTabProps: ProfileTabProps;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
  productTabProps,
  orderTabProps,
  profileTabProps,
}) => {
  return (
    <Tabs defaultValue="products" className="space-y-6">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="products">My Products</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="analytics">Analytics</TabsTrigger>
        <TabsTrigger value="profile">Profile</TabsTrigger>
      </TabsList>

      <TabsContent value="products">
        <ProductsTab {...productTabProps} />
      </TabsContent>

      <TabsContent value="orders">
        <OrdersTab {...orderTabProps} />
      </TabsContent>

      <TabsContent value="analytics">
        <AnalyticsTab />
      </TabsContent>

      <TabsContent value="profile">
        <ProfileTab {...profileTabProps} />
      </TabsContent>
    </Tabs>
  );
};

export default DashboardTabs;


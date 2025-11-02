import React, { useState } from 'react';
import { useUser } from '@/contexts/UserContext';
import { useStatusBadge } from '@/hooks/supplier/useStatusBadge';
import { useProductUtils } from '@/hooks/supplier/useProductUtils';
import { useSupplierProducts } from '@/hooks/supplier/useSupplierProducts';
import { useSupplierOrders } from '@/hooks/supplier/useSupplierOrders';
import { useSupplierProfile } from '@/hooks/supplier/useSupplierProfile';
import { useCategoriesAndBrands } from '@/hooks/supplier/useCategoriesAndBrands';
import { useProductVariants } from '@/hooks/supplier/useProductVariants';
import { useDialog } from '@/hooks/useDialog';
import { useForm } from '@/hooks/useForm';
import SupplierDashboardView from './SupplierDashboardView';
import { SupplierProduct } from '../types';

const SupplierDashboardContainer: React.FC = () => {
  const { user } = useUser();

  // Data hooks - MUST be called before any early returns to follow Rules of Hooks
  const productsHook = useSupplierProducts();
  const ordersHook = useSupplierOrders();
  const profileHook = useSupplierProfile();
  const { categories, brands, isLoadingCategories, isLoadingBrands } = useCategoriesAndBrands();

  // Product creation dialog
  const productDialog = useDialog();
  const [productCreationStep, setProductCreationStep] = useState<'product' | 'variants'>('product');
  const [createdProductId, setCreatedProductId] = useState<number | null>(null);

  // Product form
  const productForm = useForm({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    attribute_value_ids: [] as number[],
  });

  // Product variants
  const variantsHook = useProductVariants();

  // Edit product
  const editProductDialog = useDialog();
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);
  const editProductForm = useForm({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    attribute_value_ids: [] as number[],
  });

  // Add variant dialog
  const addVariantDialog = useDialog();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  const newVariantForm = useForm({
    sku: '',
    price: '',
    discounted_price: '',
    stock_quantity: '',
    weight_kg: '',
    image_urls: [''],
    attribute_value_ids: [],
  });
  
  // Image URL handlers for new variant
  const handleAddImageUrl = () => {
    const currentUrls = newVariantForm.values.image_urls || [''];
    newVariantForm.setValue('image_urls', [...currentUrls, '']);
  };
  
  const handleRemoveImageUrl = (imageIndex: number) => {
    const currentUrls = newVariantForm.values.image_urls || [''];
    if (currentUrls.length > 1) {
      const updated = currentUrls.filter((_, idx) => idx !== imageIndex);
      newVariantForm.setValue('image_urls', updated.length > 0 ? updated : ['']);
    }
  };
  
  const handleUpdateImageUrl = (imageIndex: number, value: string) => {
    const currentUrls = newVariantForm.values.image_urls || [''];
    const updated = [...currentUrls];
    updated[imageIndex] = value;
    newVariantForm.setValue('image_urls', updated);
  };

  // Ship order dialog
  const shipOrderDialog = useDialog();
  const [selectedOrderItemId, setSelectedOrderItemId] = useState<number | null>(null);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const trackingForm = useForm({
    tracking_number: '',
  });

  // Profile form
  const profileForm = useForm({
    company_name: '',
    gst_number: '',
    description: '',
    website_url: '',
  });
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Extract utility functions to hooks (must be called before early returns)
  const { getStatusBadge } = useStatusBadge();
  const { getProductMinPrice, getProductTotalStock } = useProductUtils();

  // Early return if user is not loaded or not a supplier (AFTER all hooks)
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-gray-600">Loading...</div>
      </div>
    );
  }

  if (user.role !== 'supplier') {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center text-gray-600">
          <p className="text-lg font-semibold mb-2">Access Denied</p>
          <p>You must be a supplier to access this page.</p>
        </div>
      </div>
    );
  }

  // Handlers
  const handleCreateProductStep1 = async () => {
    const { name, description, category_id, brand_id, attribute_value_ids } = productForm.values;
    if (!name || !description || !category_id || !brand_id) {
      return;
    }

    const attributeValueIds = Array.isArray(attribute_value_ids)
      ? attribute_value_ids.filter(id => id && id > 0)
      : [];

    const productId = await productsHook.createProduct({
      name,
      description,
      category_id: parseInt(category_id),
      brand_id: parseInt(brand_id),
      attribute_value_ids: attributeValueIds.length > 0 ? attributeValueIds : undefined,
    });

    if (productId) {
      setCreatedProductId(productId);
      setProductCreationStep('variants');
    }
  };

  const handleCreateAllVariants = async () => {
    if (!createdProductId) return;
    try {
      await variantsHook.createAllVariants(createdProductId);
      productDialog.close();
      productForm.reset();
      variantsHook.resetVariants();
      setCreatedProductId(null);
      setProductCreationStep('product');
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEditProduct = (product: SupplierProduct) => {
    setEditingProduct(product);
    // Extract attribute_value_ids from product.attributes (backend API response)
    // This ensures single source of truth - attributes come from backend
    const attributeValueIds: number[] = [];
    
    editProductForm.resetTo({
      name: product.name,
      description: product.description || '',
      category_id: product.category_id?.toString() || '',
      brand_id: product.brand_id?.toString() || '',
      attribute_value_ids: attributeValueIds, // Will be loaded from product.attributes in EditProductDialog
    });
    editProductDialog.open();
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    try {
      await productsHook.updateProduct(editingProduct.id, {
        name: editProductForm.values.name,
        description: editProductForm.values.description,
        category_id: parseInt(editProductForm.values.category_id),
        brand_id: parseInt(editProductForm.values.brand_id),
        attribute_value_ids: editProductForm.values.attribute_value_ids || [],
      });
      editProductDialog.close();
      setEditingProduct(null);
      editProductForm.reset();
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productsHook.deleteProduct(productId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleCreateVariant = async () => {
    if (!selectedProductId || !newVariantForm.values.price || !newVariantForm.values.stock_quantity) {
      console.error('Missing required fields:', {
        selectedProductId,
        price: newVariantForm.values.price,
        stock_quantity: newVariantForm.values.stock_quantity
      });
      return;
    }

    try {
      const { productsAPI } = await import('@/services/api');
      // Filter out empty image URLs
      const imageUrls = (newVariantForm.values.image_urls || [])
        .filter((url: string) => url && url.trim() !== '');
      
      const attributeValueIds = Array.isArray(newVariantForm.values.attribute_value_ids)
        ? newVariantForm.values.attribute_value_ids.filter(id => id && id > 0)
        : [];
      
      const payload = {
        price: parseFloat(newVariantForm.values.price),
        discounted_price: newVariantForm.values.discounted_price
          ? parseFloat(newVariantForm.values.discounted_price)
          : undefined,
        stock_quantity: parseInt(newVariantForm.values.stock_quantity),
        weight_kg: newVariantForm.values.weight_kg
          ? parseFloat(newVariantForm.values.weight_kg)
          : undefined,
        image_urls: imageUrls.length > 0 ? imageUrls : undefined,
        attribute_value_ids: attributeValueIds.length > 0 ? attributeValueIds : undefined,
      };
      
      console.log('Creating variant with payload:', payload);
      
      await productsAPI.createVariant(selectedProductId, payload);
      addVariantDialog.close();
      newVariantForm.reset();
      setSelectedProductId(null);
      await productsHook.refetch();
    } catch (error: any) {
      console.error('Failed to create variant:', error);
      // Show error message to user
    }
  };

  const handleUpdateVariant = async (productId: number, variantId: number, data: {
    price: number;
    discounted_price?: number;
    stock_quantity: number;
    weight_kg?: number;
    image_urls?: string[];
    attribute_value_ids?: number[];
  }) => {
    try {
      await productsHook.updateVariant(productId, variantId, data);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleDeleteVariant = async (productId: number, variantId: number) => {
    try {
      await productsHook.deleteVariant(productId, variantId);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleShipOrder = async () => {
    const currentOrderItemId = selectedOrderItemId;
    const trackingNum = trackingForm.values.tracking_number;
    
    if (!currentOrderItemId || !trackingNum) return;
    
    try {
      await ordersHook.shipOrder(currentOrderItemId, trackingNum);
      shipOrderDialog.close();
      trackingForm.reset();
      setSelectedOrderItemId(null);
      setSelectedOrderId(null);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleEditProfile = () => {
    if (profileHook.profile) {
      profileForm.resetTo({
        company_name: profileHook.profile.company_name || '',
        gst_number: profileHook.profile.gst_number || '',
        description: profileHook.profile.description || '',
        website_url: profileHook.profile.website_url || '',
      });
    }
    setIsEditingProfile(true);
  };

  const handleUpdateProfile = async () => {
    if (profileHook.profile) {
      await profileHook.updateProfile(profileForm.values);
    } else {
      await profileHook.createProfile(profileForm.values);
    }
    setIsEditingProfile(false);
  };

  const handleCancelProfileEdit = () => {
    setIsEditingProfile(false);
    if (profileHook.profile) {
      profileForm.resetTo({
        company_name: profileHook.profile.company_name || '',
        gst_number: profileHook.profile.gst_number || '',
        description: profileHook.profile.description || '',
        website_url: profileHook.profile.website_url || '',
      });
    }
  };


  return (
    <SupplierDashboardView
      // Data
      products={productsHook.products}
      orders={ordersHook.orders}
      profile={profileHook.profile}
      categories={categories}
      brands={brands}
      // Loading states
      isLoadingProducts={productsHook.isLoading}
      isLoadingOrders={ordersHook.isLoading}
      isLoadingProfile={profileHook.isLoading}
      isLoadingCategories={isLoadingCategories}
      isLoadingBrands={isLoadingBrands}
      // Product creation
      isAddProductOpen={productDialog.isOpen}
      onAddProductOpenChange={productDialog.toggle}
      productForm={productForm.values}
      onProductFormChange={productForm.setValue}
      productCreationStep={productCreationStep}
      onStepChange={setProductCreationStep}
      productVariants={variantsHook.variants}
      createdProductId={createdProductId}
      onAddVariant={variantsHook.addVariant}
      onRemoveVariant={variantsHook.removeVariant}
      onUpdateVariant={variantsHook.updateVariant}
      onAddImageUrl={variantsHook.addImageUrl}
      onRemoveImageUrl={variantsHook.removeImageUrl}
      onUpdateImageUrl={variantsHook.updateImageUrl}
      onCreateProduct={handleCreateProductStep1}
      onCreateAllVariants={handleCreateAllVariants}
      onCancelProductCreation={() => {
        productDialog.close();
        productForm.reset();
        variantsHook.resetVariants();
        setCreatedProductId(null);
        setProductCreationStep('product');
      }}
      // Edit product
      isEditProductOpen={editProductDialog.isOpen}
      editingProduct={editingProduct}
      onEditProductOpenChange={(open, product) => {
        if (open && product) {
          handleEditProduct(product);
        } else {
          editProductDialog.close();
          setEditingProduct(null);
          editProductForm.reset();
        }
      }}
      editingProductForm={editProductForm.values}
      onEditingProductChange={editProductForm.setValue}
      onUpdateProduct={handleUpdateProduct}
      onDeleteProduct={handleDeleteProduct}
      // Add variant
      isAddVariantOpen={addVariantDialog.isOpen}
      selectedProductId={selectedProductId}
      onAddVariantOpenChange={(open, productId) => {
        if (open) {
          setSelectedProductId(productId || null);
          addVariantDialog.open();
        } else {
          addVariantDialog.close();
          setSelectedProductId(null);
        }
      }}
      newVariant={newVariantForm.values}
      onNewVariantChange={(field: string, value: string | number[]) => {
        if (field === 'attribute_value_ids') {
          newVariantForm.setValue('attribute_value_ids', value as number[]);
        } else {
          newVariantForm.setValue(field as keyof typeof newVariantForm.values, value as string);
        }
      }}
      onAddImageUrlToNewVariant={handleAddImageUrl}
      onRemoveImageUrlFromNewVariant={handleRemoveImageUrl}
      onUpdateImageUrlInNewVariant={handleUpdateImageUrl}
      onCreateVariant={handleCreateVariant}
      onEditVariant={handleUpdateVariant}
      onDeleteVariant={handleDeleteVariant}
      // Ship order
      isShipOrderOpen={shipOrderDialog.isOpen}
      selectedOrderItemId={selectedOrderItemId}
      selectedOrderId={selectedOrderId}
      trackingNumber={trackingForm.values.tracking_number}
      onTrackingNumberChange={(value) => trackingForm.setValue('tracking_number', value)}
      onShipOrderOpenChange={(open, orderItemId, orderId) => {
        if (open) {
          setSelectedOrderItemId(orderItemId || null);
          setSelectedOrderId(orderId || null);
          shipOrderDialog.open();
        } else {
          shipOrderDialog.close();
          setSelectedOrderItemId(null);
          setSelectedOrderId(null);
        }
      }}
      onShipOrder={handleShipOrder}
      // Profile
      isEditingProfile={isEditingProfile}
      profileForm={profileForm.values}
      onProfileFormChange={profileForm.setValue}
      onEditProfile={handleEditProfile}
      onCancelEdit={handleCancelProfileEdit}
      onUpdateProfile={handleUpdateProfile}
      // Utility functions - extracted to hooks
      getStatusBadge={getStatusBadge}
      getProductMinPrice={getProductMinPrice}
      getProductTotalStock={getProductTotalStock}
    />
  );
};

export default SupplierDashboardContainer;


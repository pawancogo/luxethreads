import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import ProductTable from './products/ProductTable';
import AddVariantDialog from './products/AddVariantDialog';
import EditVariantDialog from './products/EditVariantDialog';
import EditProductDialog from './products/EditProductDialog';
import ProductsTabHeader from './products/ProductsTabHeader';
import { SupplierProduct, Category, Brand, ProductVariantForm, ProductVariant } from './types';

interface ProductsTabProps {
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
  editingProductForm?: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
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

const ProductsTab: React.FC<ProductsTabProps> = ({
  products,
  isLoadingProducts,
  categories,
  brands,
  isAddProductOpen,
  isAddVariantOpen,
  isEditProductOpen,
  selectedProductId,
  editingProduct,
  productCreationStep,
  productForm,
  productVariants,
  newVariant,
  onAddProductOpenChange,
  onProductFormChange,
  onStepChange,
  onAddVariant,
  onRemoveVariant,
  onUpdateVariant,
  onAddImageUrl,
  onRemoveImageUrl,
  onUpdateImageUrl,
  onCreateProduct,
  onCreateAllVariants,
  onCancelProductCreation,
  onAddVariantOpenChange,
  onNewVariantChange,
  onAddImageUrlToNewVariant,
  onRemoveImageUrlFromNewVariant,
  onUpdateImageUrlInNewVariant,
  onCreateVariant,
  onEditProductOpenChange,
  onEditingProductChange,
  onUpdateProduct,
  onDeleteProduct,
  onEditVariant,
  onDeleteVariant,
  getStatusBadge,
  getProductMinPrice,
  getProductTotalStock,
  editingProductForm,
}) => {
  // Find the product for the selected variant dialog
  const selectedProduct = selectedProductId
    ? products.find((p) => p.id === selectedProductId)
    : null;
  
  // Edit variant dialog state
  const [isEditVariantOpen, setIsEditVariantOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<ProductVariant | null>(null);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [variantForm, setVariantForm] = useState({
    price: '',
    discounted_price: '',
    stock_quantity: '',
    weight_kg: '',
    image_urls: [''],
    attribute_value_ids: [] as number[],
  });
  
  // Handle edit variant
  const handleEditVariant = (productId: number, variantId: number) => {
    const product = products.find((p) => p.id === productId);
    const variant = product?.variants?.find((v) => v.id === variantId) || 
                   product?.product_variants?.find((v) => v.id === variantId);
    
    if (variant) {
      setEditingVariant(variant);
      setEditingProductId(productId);
      
      // Extract image URLs - handle both string[] and ProductImage[]
      const imageUrls = variant.images && variant.images.length > 0
        ? variant.images.map((img: any) => typeof img === 'string' ? img : img.url || img.image_url || '')
        : [''];
      
      setVariantForm({
        price: variant.price?.toString() || '',
        discounted_price: variant.discounted_price?.toString() || '',
        stock_quantity: variant.stock_quantity?.toString() || '',
        weight_kg: variant.weight_kg?.toString() || '',
        image_urls: imageUrls,
        attribute_value_ids: [], // Will be loaded from variant.attributes in EditVariantDialog
      });
      setIsEditVariantOpen(true);
    }
  };
  
  // Handle delete variant
  const handleDeleteVariant = async (productId: number, variantId: number) => {
    if (!confirm('Are you sure you want to delete this variant?')) return;
    if (onDeleteVariant) {
      onDeleteVariant(productId, variantId);
    }
  };
  
  // Handle variant form change
  const handleVariantFormChange = (field: string, value: string) => {
    setVariantForm((prev) => ({ ...prev, [field]: value }));
  };
  
  // Handle image URL management
  const handleAddImageUrl = () => {
    setVariantForm((prev) => ({ ...prev, image_urls: [...prev.image_urls, ''] }));
  };
  
  const handleRemoveImageUrl = (imageIndex: number) => {
    setVariantForm((prev) => {
      const updated = prev.image_urls.filter((_, idx) => idx !== imageIndex);
      return { ...prev, image_urls: updated.length > 0 ? updated : [''] };
    });
  };
  
  const handleUpdateImageUrl = (imageIndex: number, value: string) => {
    setVariantForm((prev) => {
      const updated = [...prev.image_urls];
      updated[imageIndex] = value;
      return { ...prev, image_urls: updated };
    });
  };
  
  // Handle update variant
  const handleUpdateVariant = async () => {
    if (!editingVariant || !editingProductId || !variantForm.price || !variantForm.stock_quantity) {
      return;
    }
    
    if (onEditVariant) {
      try {
        // Filter out empty image URLs
        const imageUrls = variantForm.image_urls.filter(url => url && url.trim() !== '');
        
        await onEditVariant(editingProductId, editingVariant.id, {
          price: parseFloat(variantForm.price),
          discounted_price: variantForm.discounted_price ? parseFloat(variantForm.discounted_price) : undefined,
          stock_quantity: parseInt(variantForm.stock_quantity),
          weight_kg: variantForm.weight_kg ? parseFloat(variantForm.weight_kg) : undefined,
          image_urls: imageUrls.length > 0 ? imageUrls : undefined,
        });
        
        setIsEditVariantOpen(false);
        setEditingVariant(null);
        setEditingProductId(null);
        setVariantForm({
          price: '',
          discounted_price: '',
          stock_quantity: '',
          weight_kg: '',
          image_urls: [''],
        });
      } catch (error) {
        // Error is handled by the parent handler
      }
    }
  };

  return (
    <Card>
      <ProductsTabHeader
        isAddProductOpen={isAddProductOpen}
        onAddProductOpenChange={onAddProductOpenChange}
        productCreationStep={productCreationStep}
        productForm={productForm}
        productVariants={productVariants}
        categories={categories}
        brands={brands}
        onProductFormChange={onProductFormChange}
        onStepChange={onStepChange}
        onAddVariant={onAddVariant}
        onRemoveVariant={onRemoveVariant}
        onUpdateVariant={onUpdateVariant}
        onAddImageUrl={onAddImageUrl}
        onRemoveImageUrl={onRemoveImageUrl}
        onUpdateImageUrl={onUpdateImageUrl}
        onCreateProduct={onCreateProduct}
        onCreateAllVariants={onCreateAllVariants}
        onCancelProductCreation={onCancelProductCreation}
      />
      <CardContent>
        {isLoadingProducts ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No products found. Create your first product to get started.
          </div>
        ) : (
          <ProductTable
            products={products}
            onAddVariant={(productId) => onAddVariantOpenChange(true, productId)}
            onEditProduct={(product) => {
              // Pass product to parent handler
              onEditProductOpenChange(true, product);
            }}
            onDeleteProduct={onDeleteProduct}
            onEditVariant={handleEditVariant}
            onDeleteVariant={handleDeleteVariant}
            getStatusBadge={getStatusBadge}
            getProductMinPrice={getProductMinPrice}
            getProductTotalStock={getProductTotalStock}
          />
        )}
      </CardContent>

      <AddVariantDialog
        productName={selectedProduct?.name || ''}
        productId={selectedProductId || 0}
        categoryId={selectedProduct?.category_id}
        isOpen={isAddVariantOpen}
        onOpenChange={(open) => onAddVariantOpenChange(open, selectedProductId || undefined)}
        newVariant={newVariant}
        onNewVariantChange={onNewVariantChange}
        onAddImageUrl={onAddImageUrlToNewVariant ?? (() => {})}
        onRemoveImageUrl={onRemoveImageUrlFromNewVariant ?? (() => {})}
        onUpdateImageUrl={onUpdateImageUrlInNewVariant ?? (() => {})}
        onCreateVariant={onCreateVariant}
      />

      <EditProductDialog
        isOpen={isEditProductOpen}
        onOpenChange={(open) => onEditProductOpenChange(open)}
        editingProduct={editingProduct}
        productForm={editingProductForm || {
          name: editingProduct?.name || '',
          description: editingProduct?.description || '',
          category_id: editingProduct?.category_id?.toString() || '',
          brand_id: editingProduct?.brand_id?.toString() || '',
          attribute_value_ids: (editingProduct as any)?.attributes?.map((attr: any) => {
            // This is a placeholder - would need to map from attribute objects to IDs
            // Better to pass through from parent component
            return null;
          }).filter(Boolean) as number[] || [],
        }}
        onEditingProductChange={onEditingProductChange}
        onUpdateProduct={onUpdateProduct}
      />
      
      <EditVariantDialog
        productName={editingProductId ? products.find((p) => p.id === editingProductId)?.name || '' : ''}
        productId={editingProductId || 0}
        variant={editingVariant}
        isOpen={isEditVariantOpen}
        onOpenChange={(open) => {
          setIsEditVariantOpen(open);
          if (!open) {
            setEditingVariant(null);
            setEditingProductId(null);
            setVariantForm({
              price: '',
              discounted_price: '',
              stock_quantity: '',
              weight_kg: '',
              image_urls: [''],
            });
          }
        }}
        variantForm={variantForm}
        onVariantFormChange={handleVariantFormChange}
        onAddImageUrl={handleAddImageUrl}
        onRemoveImageUrl={handleRemoveImageUrl}
        onUpdateImageUrl={handleUpdateImageUrl}
        onUpdateVariant={handleUpdateVariant}
      />
    </Card>
  );
};

export default ProductsTab;

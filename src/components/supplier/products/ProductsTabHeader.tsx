import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ProductCreationDialog from '../ProductCreationDialog';
import { Category, Brand, ProductVariantForm } from '../types';

interface ProductsTabHeaderProps {
  isAddProductOpen: boolean;
  onAddProductOpenChange: (open: boolean) => void;
  productCreationStep: 'product' | 'variants';
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
    attribute_value_ids?: number[];
  };
  productVariants: ProductVariantForm[];
  categories: Category[];
  brands: Brand[];
  onProductFormChange: (field: string, value: string | number[]) => void;
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
}

const ProductsTabHeader: React.FC<ProductsTabHeaderProps> = ({
  isAddProductOpen,
  onAddProductOpenChange,
  productCreationStep,
  productForm,
  productVariants,
  categories,
  brands,
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
}) => {
  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </div>
        <Dialog open={isAddProductOpen} onOpenChange={onAddProductOpenChange}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </DialogTrigger>
          <ProductCreationDialog
            step={productCreationStep}
            productForm={productForm}
            variants={productVariants}
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
            onCancel={onCancelProductCreation}
          />
        </Dialog>
      </div>
    </CardHeader>
  );
};

export default ProductsTabHeader;


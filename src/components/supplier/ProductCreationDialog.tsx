import React from 'react';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Category, Brand, ProductVariantForm } from './types';
import ProductFormStep from './products/ProductFormStep';
import VariantsStep from './products/VariantsStep';

interface ProductCreationDialogProps {
  step: 'product' | 'variants';
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
  };
  variants: ProductVariantForm[];
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
  onCancel: () => void;
}

const ProductCreationDialog: React.FC<ProductCreationDialogProps> = ({
  step,
  productForm,
  variants,
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
  onCancel,
}) => {
  return (
    <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
      <DialogHeader>
        <DialogTitle>
          {step === 'product' ? 'Step 1: Product Details' : 'Step 2: Add Variants & Images'}
        </DialogTitle>
        <DialogDescription>
          {step === 'product'
            ? 'Enter basic product information'
            : 'Add product variants with images'}
        </DialogDescription>
      </DialogHeader>

      {step === 'product' ? (
        <ProductFormStep
          productForm={productForm}
          categories={categories}
          brands={brands}
          onProductFormChange={onProductFormChange}
          onCreateProduct={onCreateProduct}
          onCancel={onCancel}
        />
      ) : (
        <VariantsStep
          variants={variants}
          onAddVariant={onAddVariant}
          onRemoveVariant={onRemoveVariant}
          onUpdateVariant={onUpdateVariant}
          onAddImageUrl={onAddImageUrl}
          onRemoveImageUrl={onRemoveImageUrl}
          onUpdateImageUrl={onUpdateImageUrl}
          onCreateAllVariants={onCreateAllVariants}
          onBack={() => onStepChange('product')}
          onCancel={onCancel}
        />
      )}
    </DialogContent>
  );
};

export default ProductCreationDialog;

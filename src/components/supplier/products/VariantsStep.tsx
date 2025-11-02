import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductVariantForm } from '../types';
import VariantForm from './VariantForm';

interface VariantsStepProps {
  variants: ProductVariantForm[];
  onAddVariant: () => void;
  onRemoveVariant: (index: number) => void;
  onUpdateVariant: (index: number, field: string, value: string) => void;
  onAddImageUrl: (variantIndex: number) => void;
  onRemoveImageUrl: (variantIndex: number, imageIndex: number) => void;
  onUpdateImageUrl: (variantIndex: number, imageIndex: number, value: string) => void;
  onCreateAllVariants: () => void;
  onBack: () => void;
  onCancel: () => void;
}

const VariantsStep: React.FC<VariantsStepProps> = ({
  variants,
  onAddVariant,
  onRemoveVariant,
  onUpdateVariant,
  onAddImageUrl,
  onRemoveImageUrl,
  onUpdateImageUrl,
  onCreateAllVariants,
  onBack,
  onCancel,
}) => {
  return (
    <>
      <div className="grid gap-6 py-4 max-h-[60vh] overflow-y-auto">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">Add at least one variant with images for your product</p>
          <Button variant="outline" size="sm" onClick={onAddVariant}>
            <Plus className="h-4 w-4 mr-2" />
            Add Variant
          </Button>
        </div>

        {variants.map((variant, variantIndex) => (
          <VariantForm
            key={variantIndex}
            variant={variant}
            variantIndex={variantIndex}
            canRemove={variants.length > 1}
            onUpdateVariant={onUpdateVariant}
            onRemoveVariant={onRemoveVariant}
            onAddImageUrl={onAddImageUrl}
            onRemoveImageUrl={onRemoveImageUrl}
            onUpdateImageUrl={onUpdateImageUrl}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onCreateAllVariants}>Create Product & Variants</Button>
      </div>
    </>
  );
};

export default VariantsStep;


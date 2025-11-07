import { useState } from 'react';
import { useForm } from '@/hooks/useForm';
import { ProductVariantForm } from '@/components/supplier/types';

interface UseProductFormReturn {
  // Product form
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
    attribute_value_ids: number[];
  };
  setProductFormValue: (field: string, value: string | number[]) => void;
  resetProductForm: () => void;
  
  // Variants
  variants: ProductVariantForm[];
  addVariant: () => void;
  removeVariant: (index: number) => void;
  updateVariant: (index: number, field: string, value: string) => void;
  addImageUrl: (variantIndex: number) => void;
  removeImageUrl: (variantIndex: number, imageIndex: number) => void;
  updateImageUrl: (variantIndex: number, imageIndex: number, value: string) => void;
  resetVariants: () => void;
  
  // Step management
  step: 'product' | 'variants';
  setStep: (step: 'product' | 'variants') => void;
  
  // Validation
  isProductFormValid: boolean;
  areVariantsValid: boolean;
}

export const useProductForm = (): UseProductFormReturn => {
  const productForm = useForm({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    attribute_value_ids: [] as number[],
  });

  const [variants, setVariants] = useState<ProductVariantForm[]>([]);
  const [step, setStep] = useState<'product' | 'variants'>('product');

  const setProductFormValue = (field: string, value: string | number[]) => {
    const validFields = ['name', 'description', 'category_id', 'brand_id', 'attribute_value_ids'] as const;
    if (validFields.includes(field as any)) {
      productForm.setValue(field as typeof validFields[number], value);
    }
  };

  const resetProductForm = () => {
    productForm.setValue('name', '');
    productForm.setValue('description', '');
    productForm.setValue('category_id', '');
    productForm.setValue('brand_id', '');
    productForm.setValue('attribute_value_ids', []);
  };

  const addVariant = () => {
    setVariants([...variants, {
      sku: '',
      price: '',
      discounted_price: '',
      stock_quantity: '',
      weight_kg: '',
      image_urls: [''],
    }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: string, value: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], [field]: value };
    setVariants(updated);
  };

  const addImageUrl = (variantIndex: number) => {
    const updated = [...variants];
    const currentUrls = updated[variantIndex].image_urls || [''];
    updated[variantIndex] = {
      ...updated[variantIndex],
      image_urls: [...currentUrls, ''],
    };
    setVariants(updated);
  };

  const removeImageUrl = (variantIndex: number, imageIndex: number) => {
    const updated = [...variants];
    const currentUrls = updated[variantIndex].image_urls || [''];
    if (currentUrls.length > 1) {
      updated[variantIndex] = {
        ...updated[variantIndex],
        image_urls: currentUrls.filter((_, i) => i !== imageIndex),
      };
      setVariants(updated);
    }
  };

  const updateImageUrl = (variantIndex: number, imageIndex: number, value: string) => {
    const updated = [...variants];
    const currentUrls = [...(updated[variantIndex].image_urls || [''])];
    currentUrls[imageIndex] = value;
    updated[variantIndex] = {
      ...updated[variantIndex],
      image_urls: currentUrls,
    };
    setVariants(updated);
  };

  const resetVariants = () => {
    setVariants([]);
  };

  // Validation
  const isProductFormValid = Boolean(
    productForm.values.name.trim() &&
    productForm.values.description.trim() &&
    productForm.values.category_id &&
    productForm.values.brand_id
  );

  const areVariantsValid = variants.length > 0 && variants.every(variant => 
    variant.price.trim() &&
    variant.stock_quantity.trim() &&
    (variant.image_urls || []).some(url => url.trim())
  );

  return {
    productForm: productForm.values,
    setProductFormValue,
    resetProductForm,
    variants,
    addVariant,
    removeVariant,
    updateVariant,
    addImageUrl,
    removeImageUrl,
    updateImageUrl,
    resetVariants,
    step,
    setStep,
    isProductFormValid,
    areVariantsValid,
  };
};


import { useState } from 'react';
import { useDialog } from '@/hooks/useDialog';
import { SupplierProduct } from '@/components/supplier/types';
import { useForm } from '@/hooks/useForm';

interface UseProductDialogsReturn {
  // Create product dialog
  isCreateProductOpen: boolean;
  openCreateProduct: () => void;
  closeCreateProduct: () => void;
  
  // Edit product dialog
  isEditProductOpen: boolean;
  editingProduct: SupplierProduct | null;
  openEditProduct: (product: SupplierProduct) => void;
  closeEditProduct: () => void;
  editProductForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
    attribute_value_ids: number[];
  };
  setEditProductFormValue: (field: string, value: string | number[]) => void;
  
  // Add variant dialog
  isAddVariantOpen: boolean;
  selectedProductId: number | null;
  openAddVariant: (productId: number) => void;
  closeAddVariant: () => void;
  newVariantForm: {
    sku: string;
    price: string;
    discounted_price: string;
    stock_quantity: string;
    weight_kg: string;
    image_urls: string[];
    attribute_value_ids: number[];
  };
  setNewVariantValue: (field: string, value: string | string[] | number[]) => void;
  addImageUrlToNewVariant: () => void;
  removeImageUrlFromNewVariant: (index: number) => void;
  updateImageUrlInNewVariant: (index: number, value: string) => void;
}

export const useProductDialogs = (): UseProductDialogsReturn => {
  const createProductDialog = useDialog();
  const editProductDialog = useDialog();
  const addVariantDialog = useDialog();
  
  const [editingProduct, setEditingProduct] = useState<SupplierProduct | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  const editProductForm = useForm({
    name: '',
    description: '',
    category_id: '',
    brand_id: '',
    attribute_value_ids: [] as number[],
  });
  
  const newVariantForm = useForm({
    sku: '',
    price: '',
    discounted_price: '',
    stock_quantity: '',
    weight_kg: '',
    image_urls: [''],
    attribute_value_ids: [] as number[],
  });

  // Create product
  const openCreateProduct = () => {
    createProductDialog.open();
  };

  const closeCreateProduct = () => {
    createProductDialog.close();
  };

  // Edit product
  const openEditProduct = (product: SupplierProduct) => {
    setEditingProduct(product);
    editProductForm.setValue('name', product.name);
    editProductForm.setValue('description', product.description || '');
    editProductForm.setValue('category_id', product.category_id?.toString() || '');
    editProductForm.setValue('brand_id', product.brand_id?.toString() || '');
    editProductForm.setValue('attribute_value_ids', []);
    editProductDialog.open();
  };

  const closeEditProduct = () => {
    setEditingProduct(null);
    editProductForm.setValue('name', '');
    editProductForm.setValue('description', '');
    editProductForm.setValue('category_id', '');
    editProductForm.setValue('brand_id', '');
    editProductForm.setValue('attribute_value_ids', []);
    editProductDialog.close();
  };

  const setEditProductFormValue = (field: string, value: string | number[]) => {
    const validFields = ['name', 'description', 'category_id', 'brand_id', 'attribute_value_ids'] as const;
    if (validFields.includes(field as any)) {
      editProductForm.setValue(field as typeof validFields[number], value);
    }
  };

  // Add variant
  const openAddVariant = (productId: number) => {
    setSelectedProductId(productId);
    newVariantForm.setValue('sku', '');
    newVariantForm.setValue('price', '');
    newVariantForm.setValue('discounted_price', '');
    newVariantForm.setValue('stock_quantity', '');
    newVariantForm.setValue('weight_kg', '');
    newVariantForm.setValue('image_urls', ['']);
    newVariantForm.setValue('attribute_value_ids', []);
    addVariantDialog.open();
  };

  const closeAddVariant = () => {
    setSelectedProductId(null);
    newVariantForm.setValue('sku', '');
    newVariantForm.setValue('price', '');
    newVariantForm.setValue('discounted_price', '');
    newVariantForm.setValue('stock_quantity', '');
    newVariantForm.setValue('weight_kg', '');
    newVariantForm.setValue('image_urls', ['']);
    newVariantForm.setValue('attribute_value_ids', []);
    addVariantDialog.close();
  };

  const setNewVariantValue = (field: string, value: string | string[] | number[]) => {
    const validFields = ['sku', 'price', 'discounted_price', 'stock_quantity', 'weight_kg', 'image_urls', 'attribute_value_ids'] as const;
    if (validFields.includes(field as any)) {
      newVariantForm.setValue(field as typeof validFields[number], value);
    }
  };

  const addImageUrlToNewVariant = () => {
    const currentUrls = newVariantForm.values.image_urls || [''];
    newVariantForm.setValue('image_urls', [...currentUrls, '']);
  };

  const removeImageUrlFromNewVariant = (imageIndex: number) => {
    const currentUrls = newVariantForm.values.image_urls || [''];
    if (currentUrls.length > 1) {
      newVariantForm.setValue('image_urls', currentUrls.filter((_, i) => i !== imageIndex));
    }
  };

  const updateImageUrlInNewVariant = (imageIndex: number, value: string) => {
    const currentUrls = [...(newVariantForm.values.image_urls || [''])];
    currentUrls[imageIndex] = value;
    newVariantForm.setValue('image_urls', currentUrls);
  };

  return {
    isCreateProductOpen: createProductDialog.isOpen,
    openCreateProduct,
    closeCreateProduct,
    isEditProductOpen: editProductDialog.isOpen,
    editingProduct,
    openEditProduct,
    closeEditProduct,
    editProductForm: editProductForm.values,
    setEditProductFormValue,
    isAddVariantOpen: addVariantDialog.isOpen,
    selectedProductId,
    openAddVariant,
    closeAddVariant,
    newVariantForm: newVariantForm.values,
    setNewVariantValue,
    addImageUrlToNewVariant,
    removeImageUrlFromNewVariant,
    updateImageUrlInNewVariant,
  };
};


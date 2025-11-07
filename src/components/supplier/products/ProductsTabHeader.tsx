import React from 'react';
import { CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Upload, Download } from 'lucide-react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ProductCreationDialog from '../ProductCreationDialog';
import BulkUploadDialog from './BulkUploadDialog';
import { Category, Brand, ProductVariantForm } from '../types';
import { productsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

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
  onProductsRefresh?: () => void;
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
  onProductsRefresh,
}) => {
  const { toast } = useToast();
  const [isBulkUploadOpen, setIsBulkUploadOpen] = React.useState(false);

  const handleExportProducts = async () => {
    try {
      const blob = await productsAPI.exportProducts();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `products_export_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      toast({
        title: 'Export Successful',
        description: 'Products exported successfully',
      });
    } catch (error: any) {
      const errorMessage = error?.errors?.[0] || error?.message || 'Failed to export products';
      toast({
        title: 'Export Failed',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  const handleBulkUploadComplete = () => {
    if (onProductsRefresh) {
      onProductsRefresh();
    }
  };

  return (
    <CardHeader>
      <div className="flex justify-between items-center">
        <div>
          <CardTitle>Product Management</CardTitle>
          <CardDescription>Manage your product catalog</CardDescription>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportProducts}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Dialog open={isBulkUploadOpen} onOpenChange={setIsBulkUploadOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Bulk Upload
              </Button>
            </DialogTrigger>
            <BulkUploadDialog
              isOpen={isBulkUploadOpen}
              onOpenChange={setIsBulkUploadOpen}
              onUploadComplete={handleBulkUploadComplete}
            />
          </Dialog>
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
      </div>
    </CardHeader>
  );
};

export default ProductsTabHeader;


import { SupplierProduct } from '@/components/supplier/types';

export const useProductUtils = () => {
  const getProductMinPrice = (product: SupplierProduct): string => {
    // Support both 'variants' and 'product_variants' fields
    const variants = product.variants || product.product_variants || [];
    const prices = variants
      .map((v) => {
        const price = typeof v.price === 'string' ? parseFloat(v.price) : v.price;
        return isNaN(price) ? null : price;
      })
      .filter((p): p is number => p !== null);
    
    return prices.length > 0 ? `$${Math.min(...prices).toFixed(2)}` : 'N/A';
  };

  const getProductTotalStock = (product: SupplierProduct): number => {
    // Support both 'variants' and 'product_variants' fields
    const variants = product.variants || product.product_variants || [];
    return variants.reduce((sum, v) => {
      const stock = typeof v.stock_quantity === 'string' 
        ? parseInt(v.stock_quantity) 
        : v.stock_quantity;
      return sum + (stock || 0);
    }, 0);
  };

  return {
    getProductMinPrice,
    getProductTotalStock,
  };
};


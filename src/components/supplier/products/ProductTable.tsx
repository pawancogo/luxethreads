import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { SupplierProduct } from '../types';
import { attributeTypesAPI } from '@/services/api';

// Color hex code map loaded from backend
let colorHexMap: Record<string, string> = {};

// Load color hex codes from backend
const loadColorHexMap = async () => {
  try {
    const response = await attributeTypesAPI.getAll();
    const attributeTypes = Array.isArray(response) ? response : [];
    
    if (!Array.isArray(attributeTypes) || attributeTypes.length === 0) {
      console.warn('Attribute types API did not return valid data');
      return;
    }
    
    const colorType = attributeTypes.find((at: any) => at.name?.toLowerCase() === 'color');
    if (colorType?.values && Array.isArray(colorType.values)) {
      const map: Record<string, string> = {};
      colorType.values.forEach((value: any) => {
        if (value.hex_code && value.value) {
          map[value.value] = value.hex_code;
        }
      });
      colorHexMap = map;
      console.log('Loaded color hex map:', Object.keys(map).length, 'colors');
    }
  } catch (error) {
    console.error('Failed to load color hex map:', error);
  }
};

// Initialize color map on module load
loadColorHexMap();

// Helper function to get color hex code
const getColorHex = (colorName: string): string | null => {
  return colorHexMap[colorName] || null;
};

interface ProductTableProps {
  products: SupplierProduct[];
  onAddVariant: (productId: number) => void;
  onEditProduct: (product: SupplierProduct) => void;
  onDeleteProduct: (productId: number) => void;
  onEditVariant?: (productId: number, variantId: number) => void;
  onDeleteVariant?: (productId: number, variantId: number) => void;
  getStatusBadge: (status: string) => React.ReactNode;
  getProductMinPrice: (product: SupplierProduct) => string;
  getProductTotalStock: (product: SupplierProduct) => number;
}

const ProductTable: React.FC<ProductTableProps> = ({
  products,
  onAddVariant,
  onEditProduct,
  onDeleteProduct,
  onEditVariant,
  onDeleteVariant,
  getStatusBadge,
  getProductMinPrice,
  getProductTotalStock,
}) => {
  const [expandedProducts, setExpandedProducts] = useState<Set<number>>(new Set());
  const [colorMapLoaded, setColorMapLoaded] = useState(false);

  // Load color hex map when component mounts
  useEffect(() => {
    if (!colorMapLoaded) {
      loadColorHexMap().then(() => setColorMapLoaded(true));
    }
  }, [colorMapLoaded]);

  const toggleExpand = (productId: number) => {
    setExpandedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-10"></TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Category</TableHead>
          <TableHead>Brand</TableHead>
          <TableHead>Variants</TableHead>
          <TableHead>Price Range</TableHead>
          <TableHead>Stock</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
              {products.map((product) => {
                const variants = product.variants || product.product_variants || [];
                const isExpanded = expandedProducts.has(product.id);
                const hasVariants = variants.length > 0;
                
                // Debug: Log variant images
                if (hasVariants && isExpanded) {
                  variants.forEach((variant: any, idx: number) => {
                    console.log(`Product ${product.id} Variant ${idx}:`, {
                      variantId: variant.id,
                      sku: variant.sku,
                      images: variant.images,
                      imagesLength: variant.images?.length || 0,
                      hasImages: !!variant.images && variant.images.length > 0
                    });
                  });
                }
          
          return (
            <React.Fragment key={product.id}>
              <TableRow>
                <TableCell>
                  {hasVariants && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleExpand(product.id)}
                      className="h-8 w-8 p-0"
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  )}
                </TableCell>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.category_name || 'N/A'}</TableCell>
            <TableCell>{product.brand_name || 'N/A'}</TableCell>
                <TableCell>
                  <span className="text-sm">
                    {variants.length} variant{variants.length !== 1 ? 's' : ''}
                  </span>
                </TableCell>
            <TableCell>{getProductMinPrice(product)}</TableCell>
            <TableCell>{getProductTotalStock(product)}</TableCell>
            <TableCell>{getStatusBadge(product.status)}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" onClick={() => onAddVariant(product.id)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Variant
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onEditProduct(product)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => onDeleteProduct(product.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
              {isExpanded && hasVariants && (
                <TableRow>
                  <TableCell colSpan={9} className="bg-gray-50 p-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm mb-3">Product Variants</h4>
                      <div className="grid gap-4">
                        {variants.map((variant) => (
                          <div
                            key={variant.id}
                            className="bg-white p-4 rounded-lg border border-gray-200"
                          >
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                              <div>
                                <p className="text-xs text-gray-500 mb-1">SKU</p>
                                <p className="text-sm font-medium">{variant.sku}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Price</p>
                                <p className="text-sm font-medium">
                                  ${variant.current_price?.toFixed(2) || variant.price?.toFixed(2) || '0.00'}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Stock</p>
                                <p className="text-sm font-medium">{variant.stock_quantity || 0}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500 mb-1">Status</p>
                                <p className="text-sm font-medium">
                                  {variant.available ? (
                                    <span className="text-green-600">Available</span>
                                  ) : (
                                    <span className="text-red-600">Out of Stock</span>
                                  )}
                                </p>
                              </div>
                            </div>
                            {variant.attributes && variant.attributes.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-2">Attributes</p>
                                <div className="flex flex-wrap gap-2">
                                  {variant.attributes.map((attr, idx) => {
                                    const isColor = attr.attribute_type.toLowerCase() === 'color';
                                    // Use hex_code from API response if available, otherwise fallback to colorHexMap
                                    const colorHex = attr.hex_code || getColorHex(attr.attribute_value);
                                    return (
                                      <span
                                        key={idx}
                                        className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                                          isColor && colorHex
                                            ? 'bg-white text-gray-800 border-gray-300'
                                            : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}
                                      >
                                        <span className="font-semibold mr-1">{attr.attribute_type}:</span>
                                        {isColor && colorHex && (
                                          <span
                                            className="w-4 h-4 rounded border border-gray-300 mr-1 inline-block"
                                            style={{ backgroundColor: colorHex }}
                                            title={attr.attribute_value}
                                          />
                                        )}
                                        {attr.attribute_value}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                            {variant.images && variant.images.length > 0 && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-500 mb-2">Images ({variant.images.length})</p>
                                <div className="flex gap-2 flex-wrap">
                                  {(Array.isArray(variant.images) ? variant.images : []).slice(0, 6).map((image, idx) => {
                                    // Handle both string URLs and ProductImage objects
                                    const imageUrl = typeof image === 'string' ? image : (image as any).url || (image as any).image_url;
                                    const imageId = typeof image === 'object' ? (image as any).id : idx;
                                    
                                    if (!imageUrl) return null;
                                    
                                    return (
                                      <div key={imageId || idx} className="relative group">
                                        <img
                                          src={imageUrl}
                                          alt={`Variant ${variant.sku} - Image ${idx + 1}`}
                                          className="w-20 h-20 object-cover rounded-lg border-2 border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                                          onError={(e) => {
                                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IiM5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Ccm9rZW48L3RleHQ+PC9zdmc+';
                                            e.currentTarget.onerror = null;
                                          }}
                                          loading="lazy"
                                          onClick={() => window.open(imageUrl, '_blank')}
                                          title={imageUrl}
                                        />
                                      </div>
                                    );
                                  })}
                                  {variant.images.length > 6 && (
                                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-lg border-2 border-gray-200 text-xs text-gray-500 font-medium">
                                      +{variant.images.length - 6}
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                            {(!variant.images || variant.images.length === 0) && (
                              <div className="mb-3">
                                <p className="text-xs text-gray-400 italic">No images available</p>
                              </div>
                            )}
                            <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                              {onEditVariant && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onEditVariant(product.id, variant.id)}
                                >
                                  <Edit className="h-4 w-4 mr-1" />
                                  Edit
                                </Button>
                              )}
                              {onDeleteVariant && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => onDeleteVariant(product.id, variant.id)}
                                  className="text-red-600 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4 mr-1" />
                                  Delete
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          );
        })}
      </TableBody>
    </Table>
  );
};

export default ProductTable;


import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Plus, X, ChevronUp, ChevronDown } from 'lucide-react';
import { Category, Brand } from '../types';
import { attributeTypesAPI } from '@/services/api';

interface AttributeType {
  id: number;
  name: string;
  level?: 'product' | 'variant';
  values: Array<{ id: number; value: string; hex_code?: string }>;
}

interface SelectedAttribute {
  attributeTypeId: number;
  attributeTypeName: string;
  attributeValueId: number;
  attributeValue: string;
  hexCode?: string;
}

interface ProductFormStepProps {
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
    attribute_value_ids?: number[];
  };
  categories: Category[];
  brands: Brand[];
  onProductFormChange: (field: string, value: string | number[]) => void;
  onCreateProduct: () => void;
  onCancel: () => void;
}

const ProductFormStep: React.FC<ProductFormStepProps> = ({
  productForm,
  categories,
  brands,
  onProductFormChange,
  onCreateProduct,
  onCancel,
}) => {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [showAttributeSelector, setShowAttributeSelector] = useState(false);
  const [newAttributeTypeId, setNewAttributeTypeId] = useState<number | null>(null);
  const [newAttributeValueId, setNewAttributeValueId] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'attributes']));

  useEffect(() => {
    if (productForm.category_id) {
      loadAttributeTypes();
    }
  }, [productForm.category_id]);

  const loadAttributeTypes = async () => {
    if (!productForm.category_id) {
      setAttributeTypes([]);
      return;
    }
    
    try {
      setIsLoadingAttributes(true);
      // Load only product-level attributes (Fabric, Material, etc.)
      const categoryId = parseInt(productForm.category_id);
      const response = await attributeTypesAPI.getAll('product', categoryId);
      
      // API interceptor already extracts data, so response is the data directly
      let data: any[] = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (typeof response === 'object' && response !== null) {
        // If response is an object, check if it has data property or is already the array
        // @ts-ignore - Response format may vary, handled safely
        data = (response as any).data || (response as any).attribute_types || response || [];
      }
      
      // Filter to only include attribute types that have values
      const attributeTypesArray: AttributeType[] = (Array.isArray(data) ? data : [])
        .filter((type: any) => type.values && type.values.length > 0);
      
      setAttributeTypes(attributeTypesArray);
    } catch (error: any) {
      setAttributeTypes([]);
    } finally {
      setIsLoadingAttributes(false);
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(section)) {
        next.delete(section);
      } else {
        next.add(section);
      }
      return next;
    });
  };

  const handleAddAttribute = () => {
    if (!newAttributeTypeId || !newAttributeValueId) return;
    
    const attrType = attributeTypes.find(at => at.id === newAttributeTypeId);
    if (!attrType) return;
    
    const attrValue = attrType.values.find(v => v.id === newAttributeValueId);
    if (!attrValue) return;
    
    // Check if this attribute type already exists (remove old value)
    const updated = selectedAttributes.filter(
      attr => attr.attributeTypeId !== newAttributeTypeId
    );
    
    updated.push({
      attributeTypeId: newAttributeTypeId,
      attributeTypeName: attrType.name,
      attributeValueId: newAttributeValueId,
      attributeValue: attrValue.value,
      hexCode: attrValue.hex_code
    });
    
    setSelectedAttributes(updated);
    
    // Update parent component
    const updatedIds = updated.map(attr => attr.attributeValueId);
    onProductFormChange('attribute_value_ids', updatedIds);
    
    // Reset selector
    setNewAttributeTypeId(null);
    setNewAttributeValueId(null);
    setShowAttributeSelector(false);
  };

  const handleRemoveAttribute = (attributeTypeId: number) => {
    const updated = selectedAttributes.filter(attr => attr.attributeTypeId !== attributeTypeId);
    setSelectedAttributes(updated);
    
    // Update parent component
    const updatedIds = updated.map(attr => attr.attributeValueId);
    onProductFormChange('attribute_value_ids', updatedIds);
  };

  const getAvailableAttributeTypes = () => {
    const selectedTypeIds = selectedAttributes.map(attr => attr.attributeTypeId);
    return attributeTypes.filter(type => !selectedTypeIds.includes(type.id));
  };

  const getAttributeTypeValues = (attributeTypeId: number | null) => {
    if (!attributeTypeId) return [];
    const attrType = attributeTypes.find(at => at.id === attributeTypeId);
    return attrType?.values || [];
  };

  return (
    <>
      <div className="grid gap-4 py-4">
        {/* Basic Information Section */}
        <div className="border rounded-lg p-4">
          <button
            type="button"
            onClick={() => toggleSection('basic')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-semibold text-lg">Basic Information</h3>
            {expandedSections.has('basic') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.has('basic') && (
            <div className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={productForm.name}
                  onChange={(e) => onProductFormChange('name', e.target.value)}
                  placeholder="Enter product name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={productForm.description}
                  onChange={(e) => onProductFormChange('description', e.target.value)}
                  placeholder="Enter product description"
                  rows={4}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={productForm.category_id}
                    onValueChange={(value) => {
                      onProductFormChange('category_id', value);
                      // Clear attributes when category changes
                      setSelectedAttributes([]);
                      onProductFormChange('attribute_value_ids', []);
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id.toString()}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="brand">Brand *</Label>
                  <Select
                    value={productForm.brand_id}
                    onValueChange={(value) => onProductFormChange('brand_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select brand" />
                    </SelectTrigger>
                    <SelectContent>
                      {brands.map((brand) => (
                        <SelectItem key={brand.id} value={brand.id.toString()}>
                          {brand.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Product-Level Attributes Section */}
        <div className="border rounded-lg p-4">
          <button
            type="button"
            onClick={() => toggleSection('attributes')}
            className="flex items-center justify-between w-full mb-4"
          >
            <h3 className="font-semibold text-lg">
              Product Attributes (Fabric, Material, etc.)
              {attributeTypes.length > 0 && (
                <span className="ml-2 text-sm text-gray-500 font-normal">
                  ({attributeTypes.length} available)
                </span>
              )}
            </h3>
            {expandedSections.has('attributes') ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
          {expandedSections.has('attributes') && (
            <div className="space-y-4">
              {!productForm.category_id ? (
                <p className="text-sm text-gray-500">
                  Please select a category first to see available product-level attributes.
                </p>
              ) : isLoadingAttributes ? (
                <p className="text-sm text-gray-500">Loading attributes...</p>
              ) : attributeTypes.length === 0 ? (
                <p className="text-sm text-gray-500">
                  No product-level attributes available for this category.
                </p>
              ) : (
                <>
                  {/* Selected Attributes Tags */}
                  {selectedAttributes.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {selectedAttributes.map((attr) => {
                        return (
                          <div
                            key={`${attr.attributeTypeId}-${attr.attributeValueId}`}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200"
                          >
                            <span className="font-semibold">{attr.attributeTypeName}:</span>
                            <span>{attr.attributeValue}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAttribute(attr.attributeTypeId)}
                              className="ml-1 hover:bg-gray-200 rounded-full p-0.5 transition-colors"
                              title="Remove attribute"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Add Attribute Selector */}
                  {getAvailableAttributeTypes().length > 0 ? (
                    <div className="border rounded-lg p-3 bg-gray-50">
                      {!showAttributeSelector ? (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setShowAttributeSelector(true)}
                          className="w-full"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Attribute
                        </Button>
                      ) : (
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="grid gap-1">
                              <Label className="text-xs">Attribute Type</Label>
                              <Select
                                value={newAttributeTypeId?.toString() || undefined}
                                onValueChange={(value) => {
                                  setNewAttributeTypeId(parseInt(value));
                                  setNewAttributeValueId(null);
                                }}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAvailableAttributeTypes().map((type) => (
                                    <SelectItem key={type.id} value={type.id.toString()}>
                                      {type.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="grid gap-1">
                              <Label className="text-xs">Value</Label>
                              <Select
                                value={newAttributeValueId?.toString() || undefined}
                                onValueChange={(value) => setNewAttributeValueId(parseInt(value))}
                                disabled={!newAttributeTypeId}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Select value" />
                                </SelectTrigger>
                                <SelectContent>
                                  {getAttributeTypeValues(newAttributeTypeId).map((value) => (
                                    <SelectItem key={value.id} value={value.id.toString()}>
                                      {value.value}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              type="button"
                              size="sm"
                              onClick={handleAddAttribute}
                              disabled={!newAttributeTypeId || !newAttributeValueId}
                              className="flex-1"
                            >
                              Add
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                setShowAttributeSelector(false);
                                setNewAttributeTypeId(null);
                                setNewAttributeValueId(null);
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  ) : selectedAttributes.length > 0 ? (
                    <p className="text-xs text-gray-500 italic">
                      All product-level attributes have been added.
                    </p>
                  ) : (
                    <p className="text-xs text-gray-500 italic">
                      No attributes available to add.
                    </p>
                  )}
                </>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={onCreateProduct}>Next: Add Variants</Button>
      </div>
    </>
  );
};

export default ProductFormStep;

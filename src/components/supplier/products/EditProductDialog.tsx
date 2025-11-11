/**
 * EditProductDialog Component - Clean Architecture Implementation
 * Uses AttributeService for attribute operations
 * Follows: UI → Logic (AttributeService) → Data (API Services)
 */

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, ChevronUp, ChevronDown, X } from 'lucide-react';
import { SupplierProduct } from '../types';
import { attributeService } from '@/services/attribute.service';
import type { AttributeType } from '@/services/attribute.mapper';

interface SelectedAttribute {
  attributeTypeId: number;
  attributeTypeName: string;
  attributeValueId: number;
  attributeValue: string;
  hexCode?: string;
}

interface EditProductDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: SupplierProduct | null;
  productForm: {
    name: string;
    description: string;
    category_id: string;
    brand_id: string;
    attribute_value_ids?: number[];
  };
  categories: Array<{ id: number; name: string }>;
  brands: Array<{ id: number; name: string }>;
  onEditingProductChange: (field: string, value: string | number[]) => void;
  onUpdateProduct: () => void;
}

const EditProductDialog: React.FC<EditProductDialogProps> = ({
  isOpen,
  onOpenChange,
  editingProduct,
  productForm,
  categories,
  brands,
  onEditingProductChange,
  onUpdateProduct,
}) => {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [showAttributeSelector, setShowAttributeSelector] = useState(false);
  const [newAttributeTypeId, setNewAttributeTypeId] = useState<number | null>(null);
  const [newAttributeValueId, setNewAttributeValueId] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'attributes']));

  useEffect(() => {
    if (isOpen && editingProduct) {
      loadAttributeTypes();
      // Load existing attributes from backend API response (single source of truth)
      if (editingProduct.attributes && editingProduct.attributes.length > 0) {
        loadSelectedAttributesFromProduct();
      }
    }
  }, [isOpen, editingProduct, productForm.category_id]);

  const loadAttributeTypes = async () => {
    try {
      setIsLoadingAttributes(true);
      // Load only product-level attributes (Fabric, Material, etc.)
      // Pass categoryId if available for any category-specific filtering
      const categoryId = productForm.category_id ? parseInt(productForm.category_id) : editingProduct?.category_id;
      const attributeTypesArray = await attributeService.getAllAttributeTypes({
        level: 'product',
        category_id: categoryId,
      });
      console.log('Parsed product-level attribute types:', attributeTypesArray);
      
      setAttributeTypes(attributeTypesArray);
    } catch (error: any) {
      console.error('Failed to load attribute types:', error);
      setAttributeTypes([]);
    } finally {
      setIsLoadingAttributes(false);
    }
  };

  const loadSelectedAttributes = async () => {
    try {
      const allAttributeTypes = await attributeService.getAllAttributeTypes();
      
      const selected: SelectedAttribute[] = [];
      (productForm.attribute_value_ids || []).forEach((valueId: number) => {
        for (const attrType of allAttributeTypes) {
          const value = attrType.values.find(v => v.id === valueId);
          if (value) {
            selected.push({
              attributeTypeId: attrType.id,
              attributeTypeName: attrType.name,
              attributeValueId: valueId,
              attributeValue: value.value,
              hexCode: value.hex_code
            });
            break;
          }
        }
      });
      
      setSelectedAttributes(selected);
    } catch (error) {
      console.error('Failed to load selected attributes:', error);
    }
  };

  const loadSelectedAttributesFromProduct = async () => {
    if (!editingProduct?.attributes || !Array.isArray(editingProduct.attributes)) return;
    
    try {
      // Load all attribute types to map attribute names to IDs
      const allAttributeTypes = await attributeService.getAllAttributeTypes();
      
      const selected: SelectedAttribute[] = [];
      
      // Map from product.attributes (backend API response) to SelectedAttribute[]
      for (const attr of editingProduct.attributes) {
        const attrType = allAttributeTypes.find(
          at => at.name.toLowerCase() === attr.attribute_type?.toLowerCase()
        );
        
        if (attrType) {
          const attrValue = attrType.values.find(
            v => v.value.toLowerCase() === attr.attribute_value?.toLowerCase()
          );
          
          if (attrValue) {
            selected.push({
              attributeTypeId: attrType.id,
              attributeTypeName: attrType.name,
              attributeValueId: attrValue.id,
              attributeValue: attrValue.value,
              hexCode: attrValue.hex_code
            });
          }
        }
      }
      
      setSelectedAttributes(selected);
      
      // Update parent component with attribute_value_ids
      const attributeValueIds = selected.map(attr => attr.attributeValueId);
      onEditingProductChange('attribute_value_ids', attributeValueIds);
    } catch (error) {
      console.error('Failed to load selected attributes from product:', error);
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
    onEditingProductChange('attribute_value_ids', updatedIds);
    
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
    onEditingProductChange('attribute_value_ids', updatedIds);
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

  if (!editingProduct) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>Update product information</DialogDescription>
        </DialogHeader>
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
                  <Label htmlFor="edit_name">Product Name *</Label>
                  <Input
                    id="edit_name"
                    value={productForm.name}
                    onChange={(e) => onEditingProductChange('name', e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit_description">Description *</Label>
                  <Textarea
                    id="edit_description"
                    value={productForm.description}
                    onChange={(e) => onEditingProductChange('description', e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="edit_category">Category *</Label>
                    <Select
                      value={productForm.category_id}
                      onValueChange={(value) => {
                        onEditingProductChange('category_id', value);
                        // Clear attributes when category changes
                        setSelectedAttributes([]);
                        onEditingProductChange('attribute_value_ids', []);
                      }}
                    >
                      <SelectTrigger id="edit_category">
                        <SelectValue placeholder="Select Category" />
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
                    <Label htmlFor="edit_brand">Brand *</Label>
                    <Select
                      value={productForm.brand_id}
                      onValueChange={(value) => onEditingProductChange('brand_id', value)}
                    >
                      <SelectTrigger id="edit_brand">
                        <SelectValue placeholder="Select Brand" />
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
                {isLoadingAttributes ? (
                  <p className="text-sm text-gray-500">Loading attributes...</p>
                ) : attributeTypes.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No product-level attributes available. Contact admin to add Fabric, Material, etc.
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
                    {getAvailableAttributeTypes().length > 0 && (
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
                    )}

                    {getAvailableAttributeTypes().length === 0 && selectedAttributes.length > 0 && (
                      <p className="text-xs text-gray-500 italic">
                        All product-level attributes have been added.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdateProduct}>Update Product</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;

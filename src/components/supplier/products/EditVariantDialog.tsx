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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronUp, ChevronDown, X } from 'lucide-react';
import { ProductVariant } from '../types';
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

interface EditVariantDialogProps {
  productName: string;
  productId: number;
  categoryId?: number; // Category ID for filtering sizes
  variant: ProductVariant | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  variantForm: {
    price: string;
    discounted_price: string;
    stock_quantity: string;
    weight_kg: string;
    image_urls: string[];
    attribute_value_ids?: number[];
  };
  onVariantFormChange: (field: string, value: string | number[]) => void;
  onAddImageUrl: () => void;
  onRemoveImageUrl: (imageIndex: number) => void;
  onUpdateImageUrl: (imageIndex: number, value: string) => void;
  onUpdateVariant: () => void;
}

const EditVariantDialog: React.FC<EditVariantDialogProps> = ({
  productName,
  productId,
  categoryId,
  variant,
  isOpen,
  onOpenChange,
  variantForm,
  onVariantFormChange,
  onAddImageUrl,
  onRemoveImageUrl,
  onUpdateImageUrl,
  onUpdateVariant,
}) => {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [showAttributeSelector, setShowAttributeSelector] = useState(false);
  const [newAttributeTypeId, setNewAttributeTypeId] = useState<number | null>(null);
  const [newAttributeValueId, setNewAttributeValueId] = useState<number | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'attributes', 'images']));

  useEffect(() => {
    if (isOpen && variant && productId > 0) {
      loadAttributeTypes();
      // Load existing attributes from variant (single source of truth)
      if (variant.attributes && variant.attributes.length > 0) {
        loadSelectedAttributesFromVariant();
      }
    }
  }, [isOpen, variant, productId]);

  const loadAttributeTypes = async () => {
    try {
      setIsLoadingAttributes(true);
      // Load only variant-level attributes (Color, Size)
      // Pass categoryId to filter Size values by category
      const response = await attributeTypesAPI.getAll('variant', categoryId);
      console.log('Loaded variant-level attribute types response:', response);
      
      let data: any[] = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (typeof response === 'object' && response !== null) {
        // API interceptor already extracts data, so response is the data directly
        data = [];
      }
      
      const attributeTypesArray: AttributeType[] = Array.isArray(data) ? data : [];
      console.log('Parsed variant-level attribute types:', attributeTypesArray);
      
      setAttributeTypes(attributeTypesArray);
    } catch (error: any) {
      console.error('Failed to load attribute types:', error);
      setAttributeTypes([]);
    } finally {
      setIsLoadingAttributes(false);
    }
  };

  const loadSelectedAttributesFromVariant = async () => {
    if (!variant?.attributes || !Array.isArray(variant.attributes)) return;
    
    try {
      // Load all attribute types to map attribute names to IDs
      const response = await attributeTypesAPI.getAll();
      const allAttributeTypes: AttributeType[] = Array.isArray(response) ? response : [];
      
      const selected: SelectedAttribute[] = [];
      
      // Map from variant.attributes (backend API response) to SelectedAttribute[]
      for (const attr of variant.attributes) {
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
      onVariantFormChange('attribute_value_ids', attributeValueIds);
    } catch (error) {
      console.error('Failed to load selected attributes from variant:', error);
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
    onVariantFormChange('attribute_value_ids', updatedIds);
    
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
    onVariantFormChange('attribute_value_ids', updatedIds);
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

  if (!variant) return null;

  return (
    <Dialog open={isOpen && variant !== null && productId > 0} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product Variant</DialogTitle>
          <DialogDescription>Edit variant for {productName}</DialogDescription>
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
                {variant.sku && (
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={variant.sku}
                      disabled
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">SKU cannot be changed</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Price *</Label>
                    <Input
                      id="price"
                      type="number"
                      step="0.01"
                      value={variantForm.price}
                      onChange={(e) => onVariantFormChange('price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="discounted_price">Discounted Price</Label>
                    <Input
                      id="discounted_price"
                      type="number"
                      step="0.01"
                      value={variantForm.discounted_price}
                      onChange={(e) => onVariantFormChange('discounted_price', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="stock_quantity">Stock Quantity *</Label>
                    <Input
                      id="stock_quantity"
                      type="number"
                      value={variantForm.stock_quantity}
                      onChange={(e) => onVariantFormChange('stock_quantity', e.target.value)}
                      placeholder="0"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="weight_kg">Weight (kg)</Label>
                    <Input
                      id="weight_kg"
                      type="number"
                      step="0.01"
                      value={variantForm.weight_kg}
                      onChange={(e) => onVariantFormChange('weight_kg', e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Variant Attributes Section */}
          <div className="border rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('attributes')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="font-semibold text-lg">
                Variant Attributes (Color, Size, etc.)
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
                    No variant-level attributes available. Contact admin to add Color, Size, etc.
                  </p>
                ) : (
                  <>
                    {/* Selected Attributes Tags */}
                    {selectedAttributes.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {selectedAttributes.map((attr) => {
                          const isColor = attr.attributeTypeName.toLowerCase() === 'color';
                          return (
                            <div
                              key={`${attr.attributeTypeId}-${attr.attributeValueId}`}
                              className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium border ${
                                isColor && attr.hexCode
                                  ? 'bg-white text-gray-800 border-gray-300'
                                  : 'bg-blue-50 text-blue-700 border-blue-200'
                              }`}
                            >
                              <span className="font-semibold">{attr.attributeTypeName}:</span>
                              {isColor && attr.hexCode && (
                                <span
                                  className="w-4 h-4 rounded-full border border-gray-300 inline-block"
                                  style={{ backgroundColor: attr.hexCode }}
                                  title={attr.attributeValue}
                                />
                              )}
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
                                    {getAttributeTypeValues(newAttributeTypeId).map((value) => {
                                      const isColor = attributeTypes.find(at => at.id === newAttributeTypeId)?.name.toLowerCase() === 'color';
                                      return (
                                        <SelectItem key={value.id} value={value.id.toString()}>
                                          {isColor && value.hex_code ? (
                                            <span className="inline-flex items-center gap-2">
                                              <span
                                                className="w-4 h-4 rounded border border-gray-300 inline-block"
                                                style={{ backgroundColor: value.hex_code }}
                                                title={value.value}
                                              />
                                              {value.value}
                                            </span>
                                          ) : (
                                            value.value
                                          )}
                                        </SelectItem>
                                      );
                                    })}
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
                        All variant-level attributes have been added.
                      </p>
                    )}
                  </>
                )}
              </div>
            )}
          </div>

          {/* Images Section */}
          <div className="border rounded-lg p-4">
            <button
              type="button"
              onClick={() => toggleSection('images')}
              className="flex items-center justify-between w-full mb-4"
            >
              <h3 className="font-semibold text-lg">Images</h3>
              {expandedSections.has('images') ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>
            {expandedSections.has('images') && (
              <div>
                <div className="flex justify-between items-center mb-2">
                  <Label>Image URLs</Label>
                  <Button variant="ghost" size="sm" type="button" onClick={onAddImageUrl}>
                    <Plus className="h-4 w-4 mr-1" />
                    Add Image
                  </Button>
                </div>
                <div className="space-y-2">
                  {variantForm.image_urls.map((url, imageIndex) => (
                    <div key={imageIndex} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => onUpdateImageUrl(imageIndex, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                      />
                      {variantForm.image_urls.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => onRemoveImageUrl(imageIndex)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {variantForm.image_urls.map((url, idx) =>
                    url && url.trim() ? (
                      <img
                        key={idx}
                        src={url}
                        alt={`Preview ${idx + 1}`}
                        className="w-20 h-20 object-cover rounded border"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    ) : null
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onUpdateVariant}>Update Variant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditVariantDialog;

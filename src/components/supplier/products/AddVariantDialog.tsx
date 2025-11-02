import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2, ChevronUp, ChevronDown, Image as ImageIcon, X } from 'lucide-react';
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

interface AddVariantDialogProps {
  productName: string;
  productId: number;
  categoryId?: number; // Category ID for filtering sizes
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newVariant: {
    sku: string;
    price: string;
    discounted_price: string;
    stock_quantity: string;
    weight_kg: string;
    image_urls: string[];
    attribute_value_ids?: number[];
  };
  onNewVariantChange: (field: string, value: string | number[]) => void;
  onAddImageUrl: () => void;
  onRemoveImageUrl: (imageIndex: number) => void;
  onUpdateImageUrl: (imageIndex: number, value: string) => void;
  onCreateVariant: () => void;
}

const AddVariantDialog: React.FC<AddVariantDialogProps> = ({
  productName,
  productId,
  categoryId,
  isOpen,
  onOpenChange,
  newVariant,
  onNewVariantChange,
  onAddImageUrl,
  onRemoveImageUrl,
  onUpdateImageUrl,
  onCreateVariant,
}) => {
  const [attributeTypes, setAttributeTypes] = useState<AttributeType[]>([]);
  const [isLoadingAttributes, setIsLoadingAttributes] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['basic', 'attributes', 'images']));
  const [imageErrors, setImageErrors] = useState<Set<number>>(new Set());
  const [selectedAttributes, setSelectedAttributes] = useState<SelectedAttribute[]>([]);
  const [showAttributeSelector, setShowAttributeSelector] = useState(false);
  const [newAttributeTypeId, setNewAttributeTypeId] = useState<number | null>(null);
  const [newAttributeValueId, setNewAttributeValueId] = useState<number | null>(null);

  useEffect(() => {
    if (isOpen && productId > 0) {
      loadAttributeTypes();
      // Initialize selected attributes from newVariant.attribute_value_ids
      if (newVariant.attribute_value_ids && newVariant.attribute_value_ids.length > 0) {
        loadSelectedAttributes();
      }
    }
  }, [isOpen, productId]);

  const loadAttributeTypes = async () => {
    try {
      setIsLoadingAttributes(true);
      // Load only variant-level attributes (Color, Size)
      // Pass categoryId to filter Size values by category
      const response = await attributeTypesAPI.getAll('variant', categoryId);
      console.log('Loaded variant-level attribute types response:', response);
      
      // Handle different response formats
      let data: any[] = [];
      if (Array.isArray(response)) {
        data = response;
      } else if (response?.data && Array.isArray(response.data)) {
        data = response.data;
      } else if (typeof response === 'object' && response !== null) {
        // Try to extract data from response object
        data = (response as any).data || [];
      }
      
      const attributeTypesArray: AttributeType[] = Array.isArray(data) ? data : [];
      console.log('Parsed variant-level attribute types:', attributeTypesArray);
      
      if (attributeTypesArray.length === 0) {
        console.warn('No variant-level attribute types returned from API. Check if migration ran: rails db:migrate');
      }
      
      setAttributeTypes(attributeTypesArray);
    } catch (error: any) {
      console.error('Failed to load attribute types:', error);
      console.error('Error details:', {
        message: error?.message,
        response: error?.response?.data,
        status: error?.response?.status
      });
      setAttributeTypes([]);
    } finally {
      setIsLoadingAttributes(false);
    }
  };

  const loadSelectedAttributes = async () => {
    // Load all attribute types to map IDs to names
    try {
      const response = await attributeTypesAPI.getAll();
      const allAttributeTypes: AttributeType[] = Array.isArray(response) ? response : [];
      
      const selected: SelectedAttribute[] = [];
      (newVariant.attribute_value_ids || []).forEach((valueId: number) => {
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
    onNewVariantChange('attribute_value_ids', updatedIds);
    
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
    onNewVariantChange('attribute_value_ids', updatedIds);
  };

  const getAvailableAttributeTypes = () => {
    // Return attribute types that don't have a value selected yet
    const selectedTypeIds = selectedAttributes.map(attr => attr.attributeTypeId);
    return attributeTypes.filter(type => !selectedTypeIds.includes(type.id));
  };

  const getAttributeTypeValues = (attributeTypeId: number | null) => {
    if (!attributeTypeId) return [];
    const attrType = attributeTypes.find(at => at.id === attributeTypeId);
    return attrType?.values || [];
  };

  return (
    <Dialog open={isOpen && productId > 0} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add Product Variant</DialogTitle>
          <DialogDescription>Add a variant for {productName}</DialogDescription>
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
                {newVariant.sku && (
                  <div className="grid gap-2">
                    <Label htmlFor="sku">SKU</Label>
                    <Input
                      id="sku"
                      value={newVariant.sku}
                      disabled
                      readOnly
                      className="bg-gray-50"
                    />
                    <p className="text-xs text-gray-500">SKU is auto-generated</p>
                  </div>
                )}
                <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={newVariant.price}
                onChange={(e) => onNewVariantChange('price', e.target.value)}
                placeholder="0.00"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="discounted_price">Discounted Price</Label>
              <Input
                id="discounted_price"
                type="number"
                step="0.01"
                value={newVariant.discounted_price}
                onChange={(e) => onNewVariantChange('discounted_price', e.target.value)}
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
                value={newVariant.stock_quantity}
                onChange={(e) => onNewVariantChange('stock_quantity', e.target.value)}
                placeholder="0"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="weight_kg">Weight (kg)</Label>
              <Input
                id="weight_kg"
                type="number"
                step="0.01"
                value={newVariant.weight_kg}
                onChange={(e) => onNewVariantChange('weight_kg', e.target.value)}
                placeholder="0.00"
              />
            </div>
                </div>
              </div>
            )}
          </div>

          {/* Attributes Section */}
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
                                    setNewAttributeValueId(null); // Reset value when type changes
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
            <div className="space-y-3">
              {newVariant.image_urls.map((url, imageIndex) => (
                <div key={imageIndex} className="flex gap-3 items-start">
                  <div className="flex-1 space-y-2">
                    <Input
                      value={url}
                      onChange={(e) => onUpdateImageUrl(imageIndex, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="pr-4"
                    />
                    {url && url.trim() ? (
                      <div className="relative group">
                        {imageErrors.has(imageIndex) ? (
                          <div className="w-full h-40 border-2 border-dashed border-red-300 rounded-lg flex flex-col items-center justify-center bg-red-50">
                            <ImageIcon className="h-12 w-12 mb-2 text-red-400" />
                            <p className="text-xs text-red-600 font-medium">Invalid Image URL</p>
                            <p className="text-[10px] text-red-500 mt-1 px-2 text-center break-all max-w-full">
                              {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                            </p>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="mt-2 text-xs"
                              onClick={() => {
                                setImageErrors((prev) => {
                                  const next = new Set(prev);
                                  next.delete(imageIndex);
                                  return next;
                                });
                              }}
                            >
                              Retry
                            </Button>
                          </div>
                        ) : (
                          <>
                            <div className="w-full h-40 border-2 border-green-300 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                              <img
                                src={url}
                                alt={`Preview ${imageIndex + 1}`}
                                className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                onError={(e) => {
                                  console.error(`Image failed to load: ${url}`);
                                  setImageErrors((prev) => {
                                    const next = new Set(prev);
                                    next.add(imageIndex);
                                    return next;
                                  });
                                  e.currentTarget.style.display = 'none';
                                }}
                                onLoad={(e) => {
                                  console.log(`Image loaded successfully: ${url}`);
                                  setImageErrors((prev) => {
                                    const next = new Set(prev);
                                    next.delete(imageIndex);
                                    return next;
                                  });
                                }}
                                loading="lazy"
                                crossOrigin="anonymous"
                              />
                            </div>
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                              <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                className="h-8 w-8 p-0 bg-white/90 hover:bg-white"
                                onClick={() => window.open(url, '_blank')}
                                title="Open full size"
                              >
                                <ImageIcon className="h-4 w-4" />
                              </Button>
                            </div>
                            <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity truncate max-w-[calc(100%-4rem)]">
                              {url}
                            </div>
                          </>
                        )}
                      </div>
                    ) : null}
                    {!url && (
                      <div className="w-full h-40 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                        <div className="text-center">
                          <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-2" />
                          <p className="text-xs text-gray-500">No preview available</p>
                        </div>
                      </div>
                    )}
                  </div>
                  {newVariant.image_urls.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveImageUrl(imageIndex)}
                      className="mt-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onCreateVariant}>Create Variant</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddVariantDialog;


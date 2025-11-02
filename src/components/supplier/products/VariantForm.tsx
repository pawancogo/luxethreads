import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus, Trash2 } from 'lucide-react';
import { ProductVariantForm } from '../types';

interface VariantFormProps {
  variant: ProductVariantForm;
  variantIndex: number;
  canRemove: boolean;
  onUpdateVariant: (index: number, field: string, value: string) => void;
  onRemoveVariant: (index: number) => void;
  onAddImageUrl: (variantIndex: number) => void;
  onRemoveImageUrl: (variantIndex: number, imageIndex: number) => void;
  onUpdateImageUrl: (variantIndex: number, imageIndex: number, value: string) => void;
}

const VariantForm: React.FC<VariantFormProps> = ({
  variant,
  variantIndex,
  canRemove,
  onUpdateVariant,
  onRemoveVariant,
  onAddImageUrl,
  onRemoveImageUrl,
  onUpdateImageUrl,
}) => {
  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-semibold">Variant {variantIndex + 1}</h4>
        {canRemove && (
          <Button variant="ghost" size="sm" onClick={() => onRemoveVariant(variantIndex)}>
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {variant.sku && (
          <div>
            <Label>SKU</Label>
            <Input value={variant.sku} disabled readOnly className="bg-gray-50" />
            <p className="text-xs text-gray-500 mt-1">SKU is auto-generated</p>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Stock Quantity *</Label>
            <Input
              type="number"
              value={variant.stock_quantity}
              onChange={(e) => onUpdateVariant(variantIndex, 'stock_quantity', e.target.value)}
              placeholder="0"
            />
          </div>
          <div>
            <Label>Weight (kg)</Label>
            <Input
              type="number"
              step="0.01"
              value={variant.weight_kg}
              onChange={(e) => onUpdateVariant(variantIndex, 'weight_kg', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Price *</Label>
            <Input
              type="number"
              step="0.01"
              value={variant.price}
              onChange={(e) => onUpdateVariant(variantIndex, 'price', e.target.value)}
              placeholder="0.00"
            />
          </div>
          <div>
            <Label>Discounted Price</Label>
            <Input
              type="number"
              step="0.01"
              value={variant.discounted_price}
              onChange={(e) => onUpdateVariant(variantIndex, 'discounted_price', e.target.value)}
              placeholder="0.00"
            />
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Image URLs</Label>
            <Button variant="ghost" size="sm" onClick={() => onAddImageUrl(variantIndex)}>
              <Plus className="h-4 w-4 mr-1" />
              Add Image
            </Button>
          </div>
          <div className="space-y-2">
            {variant.image_urls.map((url, imageIndex) => (
              <div key={imageIndex} className="flex gap-2">
                <Input
                  value={url}
                  onChange={(e) => onUpdateImageUrl(variantIndex, imageIndex, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
                {variant.image_urls.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveImageUrl(variantIndex, imageIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-4 gap-2 mt-2">
            {variant.image_urls.map((url, idx) =>
              url && url.trim() ? (
                <img
                  key={idx}
                  src={url}
                  alt={`Variant ${variantIndex + 1} preview ${idx + 1}`}
                  className="w-20 h-20 object-cover rounded border"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              ) : null
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default VariantForm;


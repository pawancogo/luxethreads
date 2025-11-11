import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// Product type not needed here - component uses props only

interface CartItemProps {
  item: {
    cart_item_id: number;
    quantity: number;
    product_variant: {
      variant_id: number;
      product_id: number;
      product_name: string;
      image_url?: string;
      price: number;
      discounted_price?: number;
    };
    subtotal: number;
  };
  updatingItem: number | null;
  onQuantityChange: (cartItemId: number, newQuantity: number) => void;
  onRemoveItem: (cartItemId: number) => void;
}

const CartItem = memo<CartItemProps>(({ item, updatingItem, onQuantityChange, onRemoveItem }) => {
  const isUpdating = updatingItem === item.cart_item_id;
  const price = item.product_variant.discounted_price || item.product_variant.price;

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <Link to={`/product/${item.product_variant.product_id}`}>
            <img
              src={item.product_variant.image_url || '/placeholder.svg'}
              alt={item.product_variant.product_name}
              className="w-24 h-24 object-cover rounded"
            />
          </Link>
          <div className="flex-1">
            <Link to={`/product/${item.product_variant.product_id}`}>
              <h3 className="font-semibold text-lg hover:text-amber-600 transition-colors">
                {item.product_variant.product_name}
              </h3>
            </Link>
            <p className="text-gray-600 mt-1">₹{price.toFixed(2)}</p>
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.cart_item_id, item.quantity - 1)}
                  disabled={isUpdating || item.quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onQuantityChange(item.cart_item_id, item.quantity + 1)}
                  disabled={isUpdating}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(item.cart_item_id)}
                disabled={isUpdating}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold">₹{item.subtotal.toFixed(2)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

CartItem.displayName = 'CartItem';

export default CartItem;




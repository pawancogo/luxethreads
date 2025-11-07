import React, { useState, useCallback } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { ShoppingBag, X, CheckCircle } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import CartItem from '@/components/cart/CartItem';
import { couponsAPI } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

const Cart = () => {
  const { user } = useUser();
  const { state, removeFromCart, updateQuantity } = useCart();
  const { toast } = useToast();
  
  // Redirect suppliers away from cart
  if (user?.role === 'supplier') {
    return <Navigate to="/supplier" replace />;
  }
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [discountAmount, setDiscountAmount] = useState(0);

  const handleQuantityChange = useCallback(async (cartItemId: number, newQuantity: number) => {
    setUpdatingItem(cartItemId);
    try {
      await updateQuantity(cartItemId, newQuantity);
    } finally {
      setUpdatingItem(null);
    }
  }, [updateQuantity]);

  const handleRemoveItem = useCallback(async (cartItemId: number) => {
    setUpdatingItem(cartItemId);
    try {
      await removeFromCart(cartItemId);
    } finally {
      setUpdatingItem(null);
    }
  }, [removeFromCart]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        title: 'Coupon Code Required',
        description: 'Please enter a coupon code',
        variant: 'destructive',
      });
      return;
    }

    setIsApplyingCoupon(true);
    try {
      // Validate coupon first
      const validation = await couponsAPI.validateCoupon(couponCode.trim());
      
      if (validation && validation.is_valid) {
        // Apply coupon
        const result = await couponsAPI.applyCoupon(couponCode.trim(), state.total);
        setAppliedCoupon(result);
        setDiscountAmount(result.discount_amount || 0);
        toast({
          title: 'Coupon Applied!',
          description: `You saved ₹${result.discount_amount || 0}`,
        });
      } else {
        toast({
          title: 'Invalid Coupon',
          description: validation?.message || 'This coupon code is not valid',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to apply coupon',
        variant: 'destructive',
      });
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode('');
    setDiscountAmount(0);
    toast({
      title: 'Coupon Removed',
      description: 'Coupon has been removed from your cart',
    });
  };

  if (state.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-600 mb-6">Discover our amazing products and add them to your cart!</p>
          <Link to="/products">
            <Button className="bg-amber-600 hover:bg-amber-700">
              Continue Shopping
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {state.isLoading ? (
              <div className="text-center py-8 text-gray-600">Loading cart...</div>
            ) : state.items.length === 0 ? (
              <div className="text-center py-8 text-gray-600">Your cart is empty</div>
            ) : (
              state.items.map((item) => {
                const cartItem = {
                  cart_item_id: item.cartItemId,
                  quantity: item.quantity,
                  product_variant: {
                    variant_id: item.variantId || 0,
                    product_id: parseInt(item.id),
                    product_name: item.name,
                    image_url: item.image,
                    price: item.price,
                    discounted_price: item.originalPrice,
                  },
                  subtotal: item.price * item.quantity,
                };
                return (
                  <CartItem
                    key={item.cartItemId}
                    item={cartItem}
                    updatingItem={updatingItem}
                    onQuantityChange={handleQuantityChange}
                    onRemoveItem={handleRemoveItem}
                  />
                );
              })
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal ({state.itemCount} items)</span>
                    <span className="font-semibold">₹{state.total.toLocaleString()}</span>
                  </div>
                  
                  {appliedCoupon && discountAmount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <div className="flex items-center gap-2">
                        <span>Discount ({appliedCoupon.code})</span>
                        <Badge variant="secondary" className="text-xs">
                          {appliedCoupon.coupon_type === 'percentage' 
                            ? `${appliedCoupon.discount_value}% OFF`
                            : 'Applied'}
                        </Badge>
                      </div>
                      <span className="font-semibold">-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{Math.round((state.total - discountAmount) * 0.18).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{Math.round((state.total - discountAmount) * 1.18).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <Link to="/checkout" className="block">
                    <Button className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
                  <Link to="/products" className="block">
                    <Button variant="outline" className="w-full">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>

                {/* Promo Code */}
                <div className="mt-6 pt-6 border-t">
                  {appliedCoupon ? (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-green-50 rounded-md border border-green-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium text-green-800">
                            {appliedCoupon.code} Applied
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={handleRemoveCoupon}
                          className="h-6 w-6 p-0 text-green-600 hover:text-green-700"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex space-x-2">
                        <Input
                          type="text"
                          placeholder="Enter promo code"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleApplyCoupon();
                            }
                          }}
                        />
                        <Button 
                          variant="outline" 
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                        >
                          {isApplyingCoupon ? 'Applying...' : 'Apply'}
                        </Button>
                      </div>
                      <p className="text-xs text-gray-500">Enter a valid coupon code to get discounts</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
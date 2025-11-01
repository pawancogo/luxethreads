import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Cart = () => {
  const { state, removeFromCart, updateQuantity } = useCart();
  const [updatingItem, setUpdatingItem] = useState<number | null>(null);

  const handleQuantityChange = async (cartItemId: number, newQuantity: number) => {
    setUpdatingItem(cartItemId);
    try {
      await updateQuantity(cartItemId, newQuantity);
    } catch (error) {
      // Error handling done in CartContext
    } finally {
      setUpdatingItem(null);
    }
  };

  const handleRemoveItem = async (cartItemId: number) => {
    setUpdatingItem(cartItemId);
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      // Error handling done in CartContext
    } finally {
      setUpdatingItem(null);
    }
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
              state.items.map((item) => (
                <Card key={item.cartItemId}>
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-md"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        {item.brandName && (
                          <p className="text-sm text-gray-600">{item.brandName}</p>
                        )}
                        {item.selectedColor !== 'Default' && item.selectedSize !== 'Default' && (
                          <p className="text-sm text-gray-600">
                            {item.selectedColor} • {item.selectedSize}
                          </p>
                        )}
                        <p className="text-lg font-bold text-amber-600 mt-1">
                          ₹{item.price.toLocaleString()}
                          {item.originalPrice && (
                            <span className="text-sm text-gray-500 line-through ml-2">
                              ₹{item.originalPrice.toLocaleString()}
                            </span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity - 1)}
                          disabled={updatingItem === item.cartItemId}
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                        <span className="font-semibold w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleQuantityChange(item.cartItemId, item.quantity + 1)}
                          disabled={updatingItem === item.cartItemId}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.cartItemId)}
                        disabled={updatingItem === item.cartItemId}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
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
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-semibold">₹{Math.round(state.total * 0.18).toLocaleString()}</span>
                  </div>
                  
                  <div className="border-t pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-bold text-gray-900">Total</span>
                      <span className="text-lg font-bold text-gray-900">
                        ₹{Math.round(state.total * 1.18).toLocaleString()}
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
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      placeholder="Promo code"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <Button variant="outline">Apply</Button>
                  </div>
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
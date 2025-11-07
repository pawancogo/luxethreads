import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import { cartAPI } from '@/services/api';
import { UserContext } from './UserContext';

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  images?: string[];
  category: string;
  fabric: string;
  colors: string[];
  sizes: string[];
  description: string;
  inStock: boolean;
  featured?: boolean;
}

export interface CartItem {
  cartItemId: number;
  productVariantId: number;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  quantity: number;
  selectedColor: string;
  selectedSize: string;
  brandName?: string;
  categoryName?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
  isLoading: boolean;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; color: string; size: string } }
  | { type: 'REMOVE_FROM_CART'; payload: number } // cart_item_id
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: number; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState }
  | { type: 'SET_LOADING'; payload: boolean };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, color, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.productId === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        return { ...state, items: updatedItems, total, itemCount };
      } else {
        const newItem: CartItem = {
          cartItemId: 0, // Will be set by backend
          productVariantId: 0, // Will be set when adding
          productId: product.id,
          name: product.name,
          price: product.price,
          originalPrice: product.originalPrice,
          image: product.image,
          quantity: 1,
          selectedColor: color,
          selectedSize: size,
        };
        const items = [...state.items, newItem];
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        return { ...state, items, total, itemCount };
      }
    }
    case 'REMOVE_FROM_CART': {
      const items = state.items.filter(item => item.cartItemId !== action.payload);
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items, total, itemCount };
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item =>
        item.cartItemId === action.payload.cartItemId
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return { ...state, items, total, itemCount };
    }
    case 'CLEAR_CART':
      return { ...state, items: [], total: 0, itemCount: 0 };
    case 'LOAD_CART':
      return { ...action.payload, isLoading: false };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addToCart: (product: Product, color: string, size: string) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  updateQuantity: (cartItemId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCart: () => Promise<void>;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Use useContext directly to avoid throwing error if context is not available
  const userContext = useContext(UserContext);
  const user = userContext?.user || null;
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
    isLoading: false,
  });

  // Map backend cart response to CartItem[]
  const mapBackendCartItems = (backendCart: any): CartState => {
    const cartItems = backendCart.cart_items || [];
    const items: CartItem[] = cartItems.map((item: any) => {
      const variant = item.product_variant || {};
      return {
        cartItemId: item.cart_item_id,
        productVariantId: variant.variant_id || variant.id,
        productId: variant.product_id?.toString() || '',
        name: variant.product_name || '',
        price: variant.discounted_price || variant.price || 0,
        originalPrice: variant.discounted_price ? variant.price : undefined,
        image: variant.image_url || '',
        quantity: item.quantity,
        selectedColor: 'Default', // Backend doesn't provide attributes in cart
        selectedSize: 'Default',
        brandName: variant.brand_name,
        categoryName: variant.category_name,
      };
    });

    return {
      items,
      total: backendCart.total_price || 0,
      itemCount: backendCart.item_count || 0,
      isLoading: false,
    };
  };

  const loadCart = useCallback(async () => {
    if (!user) return;
    
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await cartAPI.getCart();
      const cartState = mapBackendCartItems(response);
      dispatch({ type: 'LOAD_CART', payload: cartState });
    } catch (error) {
      console.error('Error loading cart:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [user]);

  // Load cart from backend on mount and when user changes
  useEffect(() => {
    if (user) {
      loadCart();
    } else {
      // Clear cart if user logs out
      dispatch({ type: 'CLEAR_CART' });
    }
  }, [user, loadCart]);

  const addToCart = useCallback(async (product: Product, color: string, size: string) => {
    // Note: This is kept for backward compatibility but should use variant_id directly
    // For now, we'll still use the old flow and sync with backend after
    dispatch({ type: 'ADD_TO_CART', payload: { product, color, size } });
    
    // If user is logged in, cart is synced automatically through ProductDetail
    // which calls cartAPI.addToCart directly
  }, []);

  const removeFromCart = useCallback(async (cartItemId: number) => {
    try {
      await cartAPI.removeFromCart(cartItemId);
      dispatch({ type: 'REMOVE_FROM_CART', payload: cartItemId });
      // Reload cart to get updated totals
      await loadCart();
    } catch (error) {
      console.error('Error removing from cart:', error);
      throw error;
    }
  }, [loadCart]);

  const updateQuantity = useCallback(async (cartItemId: number, quantity: number) => {
    if (quantity <= 0) {
      await removeFromCart(cartItemId);
      return;
    }

    try {
      await cartAPI.updateCartItem(cartItemId, quantity);
      dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
      // Reload cart to get updated totals
      await loadCart();
    } catch (error) {
      console.error('Error updating cart:', error);
      throw error;
    }
  }, [loadCart, removeFromCart]);

  const clearCart = useCallback(async () => {
    try {
      // Remove all items from backend
      for (const item of state.items) {
        if (item.cartItemId > 0) {
          try {
            await cartAPI.removeFromCart(item.cartItemId);
          } catch (error) {
            console.error('Error removing item:', error);
          }
        }
      }
      dispatch({ type: 'CLEAR_CART' });
    } catch (error) {
      console.error('Error clearing cart:', error);
    }
  }, [state.items]);

  const value = useMemo(() => ({
    state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    loadCart,
  }), [state, addToCart, removeFromCart, updateQuantity, clearCart, loadCart]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
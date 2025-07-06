import React, { createContext, useContext, useReducer, useEffect } from 'react';

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

export interface CartItem extends Product {
  quantity: number;
  selectedColor: string;
  selectedSize: string;
}

interface CartState {
  items: CartItem[];
  total: number;
  itemCount: number;
}

type CartAction =
  | { type: 'ADD_TO_CART'; payload: { product: Product; color: string; size: string } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'LOAD_CART'; payload: CartState };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const { product, color, size } = action.payload;
      const existingItemIndex = state.items.findIndex(
        item => item.id === product.id && item.selectedColor === color && item.selectedSize === size
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += 1;
        const total = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
        return { items: updatedItems, total, itemCount };
      } else {
        const newItem: CartItem = {
          ...product,
          quantity: 1,
          selectedColor: color,
          selectedSize: size,
        };
        const items = [...state.items, newItem];
        const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
        return { items, total, itemCount };
      }
    }
    case 'REMOVE_FROM_CART': {
      const items = state.items.filter(item => 
        `${item.id}-${item.selectedColor}-${item.selectedSize}` !== action.payload
      );
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return { items, total, itemCount };
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items.map(item =>
        `${item.id}-${item.selectedColor}-${item.selectedSize}` === action.payload.id
          ? { ...item, quantity: Math.max(0, action.payload.quantity) }
          : item
      ).filter(item => item.quantity > 0);
      const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
      return { items, total, itemCount };
    }
    case 'CLEAR_CART':
      return { items: [], total: 0, itemCount: 0 };
    case 'LOAD_CART':
      return action.payload;
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  addToCart: (product: Product, color: string, size: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
} | null>(null);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
    itemCount: 0,
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      dispatch({ type: 'LOAD_CART', payload: JSON.parse(savedCart) });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state));
  }, [state]);

  const addToCart = (product: Product, color: string, size: string) => {
    dispatch({ type: 'ADD_TO_CART', payload: { product, color, size } });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemId });
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { id: itemId, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };

  return (
    <CartContext.Provider value={{ state, addToCart, removeFromCart, updateQuantity, clearCart }}>
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
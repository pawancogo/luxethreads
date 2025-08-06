export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrices?: string;
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

export interface WishlistItem extends Product {
  selectedColor: string;
  selectedSize: string;
}

type WishlistAction =
  | { type: 'ADD_TO_WISHLIST'; payload: { product: Product; color: string; size: string } }
  | { type: 'REMOVE_FROM_WISHLIST'; payload: string }
  | { type: 'ADD_TO_BAG'; payload: { product: string; color:string; size: string } }

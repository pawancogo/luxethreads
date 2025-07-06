import { Product } from '@/contexts/CartContext';

const mockApiProducts: Omit<Product, 'id'>[] = [
  {
    name: 'Handwoven Cotton Saree',
    price: 3200,
    originalPrice: 4500,
    image: 'https://images.unsplash.com/photo-1583391733975-b8ba0630c7fe?w=400&h=600&fit=crop',
    category: 'saree',
    fabric: 'cotton',
    colors: ['Blue', 'Green', 'Red'],
    sizes: ['Free Size'],
    description: 'Beautiful handwoven cotton saree with traditional patterns.',
    inStock: true,
    featured: false,
  },
  {
    name: 'Designer Silk Kurta',
    price: 1800,
    originalPrice: 2500,
    image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop',
    category: 'kurta',
    fabric: 'silk',
    colors: ['Gold', 'Cream', 'Pink'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Elegant silk kurta with intricate embroidery work.',
    inStock: true,
    featured: false,
  },
  {
    name: 'Casual Cotton Kurti',
    price: 750,
    originalPrice: 1200,
    image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400&h=600&fit=crop',
    category: 'kurti',
    fabric: 'cotton',
    colors: ['White', 'Navy', 'Maroon'],
    sizes: ['S', 'M', 'L'],
    description: 'Comfortable cotton kurti for everyday wear.',
    inStock: true,
    featured: false,
  },
  {
    name: 'Premium Linen Shirt',
    price: 1400,
    image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=600&fit=crop',
    category: 'shirt',
    fabric: 'linen',
    colors: ['White', 'Light Blue', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'Premium quality linen shirt for formal occasions.',
    inStock: true,
    featured: false,
  },
  {
    name: 'Traditional Banarasi Saree',
    price: 9500,
    originalPrice: 12000,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=400&h=600&fit=crop',
    category: 'saree',
    fabric: 'silk',
    colors: ['Royal Blue', 'Golden', 'Red'],
    sizes: ['Free Size'],
    description: 'Authentic Banarasi silk saree with gold zari work.',
    inStock: true,
    featured: true,
  },
];

export const fetchProducts = async (page: number, limit: number = 12): Promise<{
  products: Product[];
  hasMore: boolean;
  total: number;
}> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const startIndex = (page - 1) * limit;
  const totalProducts = 50; // Simulate total products available
  
  // Generate products with unique IDs
  const products: Product[] = [];
  for (let i = 0; i < limit && startIndex + i < totalProducts; i++) {
    const templateIndex = (startIndex + i) % mockApiProducts.length;
    const template = mockApiProducts[templateIndex];
    products.push({
      ...template,
      id: `api-${startIndex + i + 1}`,
      name: `${template.name} ${startIndex + i + 1}`,
    });
  }
  
  return {
    products,
    hasMore: startIndex + limit < totalProducts,
    total: totalProducts
  };
};
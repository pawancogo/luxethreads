/**
 * Products Page
 * Uses Container/Presenter pattern
 * Delegates all logic to ProductsContainer
 */
import ProductsContainer from '@/components/products/ProductsContainer';

const Products = () => {
  return <ProductsContainer />;
};

export default Products;

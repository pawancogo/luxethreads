import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UserContext } from './UserContext';
import { supplierProfileAPI, supplierOrdersAPI, productsAPI } from '@/services/api';
import { SupplierProfile, SupplierProduct, SupplierOrder } from '@/components/supplier/types';

interface SupplierContextType {
  // Profile
  profile: SupplierProfile | null;
  isLoadingProfile: boolean;
  profileError: string | null;
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<SupplierProfile>) => Promise<void>;
  
  // Products
  products: SupplierProduct[];
  isLoadingProducts: boolean;
  productsError: string | null;
  refreshProducts: () => Promise<void>;
  createProduct: (data: any) => Promise<SupplierProduct>;
  updateProduct: (id: number, data: any) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  
  // Orders
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  refreshOrders: () => Promise<void>;
  shipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
  
  // Account status
  isSuspended: boolean;
  isVerified: boolean;
  supplierTier: SupplierProfile['supplier_tier'] | null;
}

const SupplierContext = createContext<SupplierContextType | null>(null);

export const SupplierProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use useContext directly to avoid throwing error if context is not available
  const userContext = useContext(UserContext);
  const user = userContext?.user || null;
  const { toast } = useToast();
  
  // Profile state
  const [profile, setProfile] = useState<SupplierProfile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(false);
  const [profileError, setProfileError] = useState<string | null>(null);
  
  // Products state
  const [products, setProducts] = useState<SupplierProduct[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState<string | null>(null);
  
  // Orders state
  const [orders, setOrders] = useState<SupplierOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  // Load profile
  const refreshProfile = async () => {
    if (!user || user.role !== 'supplier') return;
    
    try {
      setIsLoadingProfile(true);
      setProfileError(null);
      const response = await supplierProfileAPI.getProfile();
      // API interceptor already extracts data, so response is the data directly
      const profileData = response || {};
      setProfile(profileData as SupplierProfile);
    } catch (err: any) {
      if (err?.status !== 404) {
        const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load profile';
        setProfileError(errorMessage);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      }
      setProfile(null);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  // Update profile
  const updateProfile = async (data: Partial<SupplierProfile>) => {
    try {
      await supplierProfileAPI.updateProfile(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
      await refreshProfile();
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to update profile';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Load products
  const refreshProducts = async () => {
    if (!user || user.role !== 'supplier') return;
    
    try {
      setIsLoadingProducts(true);
      setProductsError(null);
      const response = await productsAPI.getSupplierProducts();
      // API interceptor already extracts data, so response is the data directly
      let productsData = Array.isArray(response) ? response : [];
      
      productsData = productsData.map((product: any) => {
        const variants = product.variants || product.product_variants || [];
        return {
          ...product,
          variants: variants,
          product_variants: variants,
        };
      });
      
      setProducts(productsData);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load products';
      setProductsError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingProducts(false);
    }
  };

  // Create product
  const createProduct = async (data: any): Promise<SupplierProduct> => {
    try {
      const response = await productsAPI.createProduct(data);
      await refreshProducts();
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      // Extract product from response (handle different response formats)
      // API interceptor already extracts data
      return (response as any) as SupplierProduct;
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to create product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Update product
  const updateProduct = async (id: number, data: any): Promise<void> => {
    try {
      await productsAPI.updateProduct(id, data);
      await refreshProducts();
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to update product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Delete product
  const deleteProduct = async (id: number): Promise<void> => {
    try {
      await productsAPI.deleteProduct(id);
      await refreshProducts();
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to delete product';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Load orders
  const refreshOrders = async () => {
    if (!user || user.role !== 'supplier') return;
    
    try {
      setIsLoadingOrders(true);
      setOrdersError(null);
      const response = await supplierOrdersAPI.getSupplierOrders();
      // API interceptor already extracts data, so response is the data directly
      const ordersData = Array.isArray(response) ? response : [];
      setOrders(ordersData);
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to load orders';
      setOrdersError(errorMessage);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsLoadingOrders(false);
    }
  };

  // Ship order
  const shipOrder = async (orderItemId: number, trackingNumber: string): Promise<void> => {
    try {
      await supplierOrdersAPI.shipOrderItem(orderItemId, trackingNumber);
      await refreshOrders();
      toast({
        title: 'Success',
        description: 'Order marked as shipped successfully',
      });
    } catch (err: any) {
      const errorMessage = err?.errors?.[0] || err?.message || 'Failed to ship order';
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  // Load initial data when user is a supplier
  useEffect(() => {
    if (user && user.role === 'supplier') {
      refreshProfile();
      refreshProducts();
      refreshOrders();
    } else {
      // Clear data when user is not a supplier
      setProfile(null);
      setProducts([]);
      setOrders([]);
    }
  }, [user?.id, user?.role]);

  // Computed values
  const isSuspended = profile?.is_suspended || false;
  const isVerified = profile?.verified || false;
  const supplierTier = profile?.supplier_tier || null;

  const value: SupplierContextType = useMemo(() => ({
    profile,
    isLoadingProfile,
    profileError,
    refreshProfile,
    updateProfile,
    products,
    isLoadingProducts,
    productsError,
    refreshProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    orders,
    isLoadingOrders,
    ordersError,
    refreshOrders,
    shipOrder,
    isSuspended,
    isVerified,
    supplierTier,
  }), [
    profile,
    isLoadingProfile,
    profileError,
    products,
    isLoadingProducts,
    productsError,
    orders,
    isLoadingOrders,
    ordersError,
    isSuspended,
    isVerified,
    supplierTier,
  ]);

  return (
    <SupplierContext.Provider value={value}>
      {children}
    </SupplierContext.Provider>
  );
};

export const useSupplier = () => {
  const context = useContext(SupplierContext);
  if (!context) {
    throw new Error('useSupplier must be used within SupplierProvider');
  }
  return context;
};


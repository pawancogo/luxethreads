/**
 * Supplier Store - Zustand implementation
 * Performance optimized with selectors
 * Replaces SupplierContext
 */

import { create } from 'zustand';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supplierService } from '@/services/supplier.service';
import { SupplierProfile, SupplierProduct, SupplierOrder } from '@/components/supplier/types';
import { useUser } from './userStore';

interface SupplierState {
  profile: SupplierProfile | null;
  isLoadingProfile: boolean;
  profileError: string | null;
  products: SupplierProduct[];
  isLoadingProducts: boolean;
  productsError: string | null;
  orders: SupplierOrder[];
  isLoadingOrders: boolean;
  ordersError: string | null;
  // Actions
  refreshProfile: () => Promise<void>;
  updateProfile: (data: Partial<SupplierProfile>) => Promise<void>;
  refreshProducts: () => Promise<void>;
  createProduct: (data: any) => Promise<SupplierProduct>;
  updateProduct: (id: number, data: any) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
  refreshOrders: () => Promise<void>;
  shipOrder: (orderItemId: number, trackingNumber: string) => Promise<void>;
}

export const useSupplierStore = create<SupplierState>((set, get) => ({
  profile: null,
  isLoadingProfile: false,
  profileError: null,
  products: [],
  isLoadingProducts: false,
  productsError: null,
  orders: [],
  isLoadingOrders: false,
  ordersError: null,

  refreshProfile: async () => {
    set({ isLoadingProfile: true, profileError: null });
    try {
      const profileData = await supplierService.getProfile();
      set({ profile: profileData });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      set({ profileError: errorMessage, profile: null });
      throw err;
    } finally {
      set({ isLoadingProfile: false });
    }
  },

  updateProfile: async (data: Partial<SupplierProfile>) => {
    try {
      await supplierService.updateProfile(data);
      await get().refreshProfile();
    } catch (err: any) {
      throw err;
    }
  },

  refreshProducts: async () => {
    set({ isLoadingProducts: true, productsError: null });
    try {
      const productsData = await supplierService.getProducts();
      set({ products: productsData });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      set({ productsError: errorMessage });
    } finally {
      set({ isLoadingProducts: false });
    }
  },

  createProduct: async (data: any) => {
    try {
      const product = await supplierService.createProduct(data);
      await get().refreshProducts();
      return product;
    } catch (err: any) {
      throw err;
    }
  },

  updateProduct: async (id: number, data: any) => {
    try {
      await supplierService.updateProduct(id, data);
      await get().refreshProducts();
    } catch (err: any) {
      throw err;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await supplierService.deleteProduct(id);
      await get().refreshProducts();
    } catch (err: any) {
      throw err;
    }
  },

  refreshOrders: async () => {
    set({ isLoadingOrders: true, ordersError: null });
    try {
      const ordersData = await supplierService.getOrders();
      set({ orders: ordersData });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      set({ ordersError: errorMessage });
    } finally {
      set({ isLoadingOrders: false });
    }
  },

  shipOrder: async (orderItemId: number, trackingNumber: string) => {
    try {
      await supplierService.shipOrderItem(orderItemId, trackingNumber);
      await get().refreshOrders();
    } catch (err: any) {
      throw err;
    }
  },

}));

/**
 * Supplier Hook - Provides same API as SupplierContext
 * Auto-initializes when user is supplier
 */
export const useSupplier = () => {
  const user = useUser();
  const store = useSupplierStore();
  const { toast } = useToast();

  useEffect(() => {
    if (user && user.role === 'supplier') {
      store.refreshProfile().catch((err: any) => {
        const errorMessage = supplierService.extractErrorMessage(err);
        toast({
          title: 'Error',
          description: errorMessage,
          variant: 'destructive',
        });
      });
    } else {
      useSupplierStore.setState({
        profile: null,
        products: [],
        orders: [],
      });
    }
  }, [user?.id, user?.role, toast]);

  // Wrap actions with toast notifications
  const updateProfile = async (data: Partial<SupplierProfile>) => {
    try {
      await store.updateProfile(data);
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const createProduct = async (data: any) => {
    try {
      const product = await store.createProduct(data);
      toast({
        title: 'Success',
        description: 'Product created successfully',
      });
      return product;
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const updateProduct = async (id: number, data: any) => {
    try {
      await store.updateProduct(id, data);
      toast({
        title: 'Success',
        description: 'Product updated successfully',
      });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const deleteProduct = async (id: number) => {
    try {
      await store.deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
      });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const shipOrder = async (orderItemId: number, trackingNumber: string) => {
    try {
      await store.shipOrder(orderItemId, trackingNumber);
      toast({
        title: 'Success',
        description: 'Order marked as shipped successfully',
      });
    } catch (err: any) {
      const errorMessage = supplierService.extractErrorMessage(err);
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
      throw err;
    }
  };

  const statusFlags = supplierService.computeStatusFlags(store.profile);

  return {
    ...store,
    updateProfile,
    createProduct,
    updateProduct,
    deleteProduct,
    shipOrder,
    isSuspended: statusFlags.isSuspended,
    isVerified: statusFlags.isVerified,
    supplierTier: statusFlags.supplierTier,
  };
};

/**
 * Performance-optimized selectors
 */
export const useSupplierProfile = () => useSupplierStore((state) => state.profile);
export const useSupplierProducts = () => useSupplierStore((state) => state.products);
export const useSupplierOrders = () => useSupplierStore((state) => state.orders);


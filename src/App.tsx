/**
 * App Component - Main application entry point
 * Modernized with Zustand stores for state management
 * Performance optimized with route-based providers
 */

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useUserInit } from "@/stores/userStore";
import { useRbacInit } from "@/stores/rbacStore";
import { useFilterAutoLoad } from "@/hooks/useFilterAutoLoad";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RootRoute from "@/components/RootRoute";
import Home from "@/pages/Home";
import Products from "@/pages/Products";
import ProductsWithFilters from "@/pages/ProductsWithFilters";
import ProductDetail from "@/pages/ProductDetail";
import Cart from "@/pages/Cart";
import Auth from "@/pages/Auth";
import Checkout from "@/pages/Checkout";
import OrderConfirmation from "@/pages/OrderConfirmation";
import SupplierDashboard from "@/pages/SupplierDashboard";
import Profile from "@/pages/Profile";
import Orders from "@/pages/Orders";
import OrderDetail from "@/pages/OrderDetail";
import Wishlist from "@/pages/Wishlist";
import Notifications from "@/pages/Notifications";
import SupportTickets from "@/pages/SupportTickets";
import LoyaltyPoints from "@/pages/LoyaltyPoints";
import Returns from "@/pages/Returns";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import VerifyEmail from "@/pages/VerifyEmail";
import Addresses from "@/pages/Addresses";
import NotFound from "@/pages/NotFound";

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1,
    },
  },
});

const AppContent = () => {
  const location = useLocation();
  const isSupplierRoute = location.pathname.startsWith('/supplier');
  const isProductsPage = location.pathname.includes('/products');

  // Initialize user on mount
  useUserInit();

  // Initialize RBAC based on user role
  useRbacInit();

  // Auto-load filters on products pages (hook must be called unconditionally)
  useFilterAutoLoad();

  // Clean up session storage on mount
  useEffect(() => {
    sessionStorage.removeItem('requires_verification');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isSupplierRoute && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<RootRoute />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products-filtered" element={<ProductsWithFilters />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route
            path="/cart"
            element={
              <ProtectedRoute allowedRoles="customer">
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route path="/auth" element={<Auth />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/addresses"
            element={
              <ProtectedRoute>
                <Addresses />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/wishlist"
            element={
              <ProtectedRoute allowedRoles="customer">
                <Wishlist />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/support-tickets"
            element={
              <ProtectedRoute>
                <SupportTickets />
              </ProtectedRoute>
            }
          />
          <Route
            path="/loyalty-points"
            element={
              <ProtectedRoute>
                <LoyaltyPoints />
              </ProtectedRoute>
            }
          />
          <Route
            path="/returns"
            element={
              <ProtectedRoute>
                <Returns />
              </ProtectedRoute>
            }
          />
          
          <Route
            path="/supplier"
            element={
              <ProtectedRoute allowedRoles="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/admin/*" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
                  <p className="text-gray-600 mb-4">Admin functionality is available at the backend interface.</p>
                  <a 
                    href={`${import.meta.env.VITE_API_BASE_URL?.replace('/api/v1', '') || 'http://localhost:3000'}/admin/login`}
                    className="text-amber-600 hover:text-amber-700 underline"
                  >
                    Go to Admin Panel
                  </a>
                </div>
              </div>
            } 
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isSupplierRoute && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

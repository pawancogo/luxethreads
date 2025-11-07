import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { UserProvider } from "@/contexts/UserContext";
import { AdminProvider } from "@/contexts/AdminContext";
import { RbacProvider } from "@/contexts/RbacContext";
import { SupplierProvider } from "@/contexts/SupplierContext";
import { ProductProvider } from "@/contexts/ProductContext";
import { FilterProvider } from "@/contexts/FilterContext";
import { NotificationProvider } from "@/contexts/NotificationContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminUsers from "@/pages/admin/Users";
import AdminSuppliers from "@/pages/admin/Suppliers";
import AdminProducts from "@/pages/admin/Products";
import AdminOrders from "@/pages/admin/Orders";
import AdminReports from "@/pages/admin/Reports";
import AdminPromotions from "@/pages/admin/Promotions";
import AdminCoupons from "@/pages/admin/Coupons";
import AdminSettings from "@/pages/admin/Settings";
import AdminEmailTemplates from "@/pages/admin/EmailTemplates";

import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const AppContent = () => {
  const location = useLocation();
  const isSupplierDashboard = location.pathname === '/supplier';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {!isSupplierDashboard && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products-filtered" element={<ProductsWithFilters />} />
          {/* Phase 2: Support slug or ID in route */}
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
          
          {/* User Routes */}
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
          
          {/* Supplier Routes */}
          <Route
            path="/supplier"
            element={
              <ProtectedRoute allowedRoles="supplier">
                <SupplierDashboard />
              </ProtectedRoute>
            } 
          />
          
          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'user_admin']}>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/suppliers"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'supplier_admin']}>
                <AdminSuppliers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'product_admin']}>
                <AdminProducts />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'order_admin']}>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'order_admin', 'product_admin', 'user_admin']}>
                <AdminReports />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/promotions"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'product_admin']}>
                <AdminPromotions />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/coupons"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin', 'product_admin']}>
                <AdminCoupons />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin']}>
                <AdminSettings />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/email-templates"
            element={
              <AdminProtectedRoute allowedRoles={['super_admin']}>
                <AdminEmailTemplates />
              </AdminProtectedRoute>
            }
          />
          
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isSupplierDashboard && <Footer />}
    </div>
  );
};

const App = () => {
  // Determine user type for RBAC context
  const getUserType = (): 'admin' | 'supplier' | 'user' => {
    // This will be determined based on current route or context
    // For now, we'll check localStorage
    if (typeof window !== 'undefined') {
      if (localStorage.getItem('admin_token')) return 'admin';
      if (localStorage.getItem('user')) {
        try {
          const user = JSON.parse(localStorage.getItem('user') || '{}');
          if (user.role === 'supplier') return 'supplier';
        } catch {}
      }
    }
    return 'user';
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <UserProvider>
          <AdminProvider>
            <RbacProvider userType={getUserType()}>
              <SupplierProvider>
                <ProductProvider>
                  <FilterProvider>
                    <CartProvider>
                      <NotificationProvider>
                        <Toaster />
                        <Sonner />
                        <BrowserRouter>
                          <AppContent />
                        </BrowserRouter>
                      </NotificationProvider>
                    </CartProvider>
                  </FilterProvider>
                </ProductProvider>
              </SupplierProvider>
            </RbacProvider>
          </AdminProvider>
        </UserProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;

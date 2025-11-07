/**
 * Legacy API exports for backward compatibility
 * This file re-exports from the new domain-based services
 * Gradually migrate to new services, then remove this file
 */

// Re-export from new services
export { authService as authAPI, adminAuthService as adminAuthAPI } from './api/auth.service';
export { productsService as productsAPI } from './api/products.service';

// Re-export all other APIs from original file (temporary)
// TODO: Split these into domain services
export {
  rbacAPI,
  adminUsersAPI,
  adminSuppliersAPI,
  adminProductsAPI,
  adminOrdersAPI,
  adminReportsAPI,
  adminSettingsAPI,
  adminEmailTemplatesAPI,
  usersAPI,
  categoriesAPI,
  brandsAPI,
  attributeTypesAPI,
  cartAPI,
  wishlistAPI,
  addressesAPI,
  ordersAPI,
  supplierOrdersAPI,
  supplierReturnsAPI,
  supplierAnalyticsAPI,
  supplierProfileAPI,
  supplierDocumentsAPI,
  returnRequestsAPI,
  paymentsAPI,
  paymentRefundsAPI,
  supplierPaymentsAPI,
  shippingAPI,
  couponsAPI,
  promotionsAPI,
  reviewsAPI,
  notificationsAPI,
  notificationPreferencesAPI,
  supportTicketsAPI,
  loyaltyPointsAPI,
  productViewsAPI,
  api,
} from '../api';


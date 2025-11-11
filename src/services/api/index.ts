/**
 * API Services Index
 * Central export point for all API services
 * Follows Clean Architecture - UI → Logic → Data
 */

// Base
export { BaseApiClient, apiClient, api } from './base';

// Authentication
export { authService } from './auth.service';
export type { SignupData, LoginResponse } from './auth.service';

// Products
export { productsService } from './products.service';
export type { ProductFilters, ProductData, VariantData } from './products.service';

// Users
export { usersService } from './users.service';
export type { UserUpdateData, SearchData } from './users.service';

// Email Verification
export { emailVerificationService } from './email-verification.service';

// Referrals
export { referralsService } from './referrals.service';

// Cart
export { cartService } from './cart.service';
export type { CartItemData } from './cart.service';

// Wishlist
export { wishlistService } from './wishlist.service';

// Addresses
export { addressesService } from './addresses.service';
export type { AddressData } from './addresses.service';

// Orders
export { ordersService } from './orders.service';
export type { OrderData } from './orders.service';

// Payments
export { paymentsService } from './payments.service';
export type { PaymentData, RefundData } from './payments.service';

// Shipments
export { shipmentsService } from './shipments.service';

// Returns
export { returnsService } from './returns.service';
export type { ReturnRequestData, PickupScheduleData } from './returns.service';

// Reviews
export { reviewsService } from './reviews.service';
export type { ReviewData } from './reviews.service';

// Product Views
export { productViewsService } from './product-views.service';

// Coupons
export { couponsService } from './coupons.service';

// Promotions
export { promotionsService } from './promotions.service';

// Notifications
export { notificationsService } from './notifications.service';
export type { NotificationPreferences } from './notifications.service';

// Support Tickets
export { supportTicketsService } from './support-tickets.service';
export type { SupportTicketData, TicketMessageData } from './support-tickets.service';

// Loyalty Points
export { loyaltyPointsService } from './loyalty-points.service';

// Supplier Profile
export { supplierProfileService } from './supplier-profile.service';
export type { SupplierProfileData } from './supplier-profile.service';

// Supplier Documents
export { supplierDocumentsService } from './supplier-documents.service';

// Supplier Orders
export { supplierOrdersService } from './supplier-orders.service';
export type { ShipOrderData, UpdateTrackingData } from './supplier-orders.service';

// Supplier Returns
export { supplierReturnsService } from './supplier-returns.service';

// Supplier Shipments
export { supplierShipmentsService } from './supplier-shipments.service';
export type { ShipmentData, TrackingEventData } from './supplier-shipments.service';

// Supplier Payments
export { supplierPaymentsService } from './supplier-payments.service';

// Supplier Analytics
export { supplierAnalyticsService } from './supplier-analytics.service';

// Supplier Reviews
export { supplierReviewsService } from './supplier-reviews.service';

// Supplier Users (Team Management)
export { supplierUsersService } from './supplier-users.service';
export type { SupplierUserData } from './supplier-users.service';

// Categories
export { categoriesService } from './categories.service';

// Brands
export { brandsService } from './brands.service';

// Attribute Types
export { attributeTypesService } from './attribute-types.service';

// Shipping Methods
export { shippingMethodsService } from './shipping-methods.service';

// Search
export { searchService } from './search.service';
export type { SearchParams } from './search.service';



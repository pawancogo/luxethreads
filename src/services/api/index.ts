/**
 * API Services Index
 * Central export point for all API services
 * Follows Clean Architecture - UI → Logic → Data
 */

// Base
export { BaseApiClient, apiClient, api } from './base';

// Authentication
export { authService, adminAuthService } from './auth.service';
export type { SignupData, LoginResponse } from './auth.service';

// Products
export { productsService } from './products.service';
export type { ProductFilters, ProductData, VariantData } from './products.service';

// Legacy API exports (for backward compatibility during migration)
// TODO: Remove after full migration
export * from '../api.legacy';


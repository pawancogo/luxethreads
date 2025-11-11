/**
 * Base API Client
 * Provides common functionality for all API services
 * Follows Single Responsibility Principle
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

/**
 * Base API client class
 * Handles common concerns: authentication, error handling, response transformation
 */
export class BaseApiClient {
  protected api: AxiosInstance;

  constructor(baseURL: string = API_BASE_URL) {
    this.api = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
      withCredentials: true, // Required for cookies to be sent
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   * Note: Tokens are now in httpOnly cookies, so no need to add Authorization header
   * Cookies are automatically sent with requests
   */
  private setupInterceptors(): void {
    // Request interceptor - cookies are sent automatically, no manual token handling needed
    this.api.interceptors.request.use(
      (config) => {
        // Ensure cookies are sent with requests (withCredentials)
        config.withCredentials = true;
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor - handle errors and transform responses
    this.api.interceptors.response.use(
      (response) => this.handleSuccessResponse(response),
      (error) => this.handleErrorResponse(error)
    );
  }

  /**
   * Handle successful responses
   */
  private handleSuccessResponse(response: AxiosResponse): any {
    // Handle 304 Not Modified (cached response)
    // For 304, axios may not include response.data, but if it does, process it normally
    // If response.data is empty/undefined for 304, we'll let it fall through to normal processing

    // Handle backend standardized response format: { success, message, data }
    if (response.data && response.data.success !== undefined) {
      if (response.data.success && response.data.data) {
        return response.data.data;
      }
      // If success is true but data is missing/null, return data anyway
      if (response.data.success && !response.data.data) {
        // Log warning in development only
        if (import.meta.env.DEV) {
          // eslint-disable-next-line no-console
          console.warn('[BaseApiClient] Success response but no data field:', response.data);
        }
        return response.data.data || response.data;
      }
      // If success is false, treat as error
      if (!response.data.success) {
        const message = response.data.message || 'Operation failed';
        const errors = response.data.errors || [];
        const error = new Error(message) as any;
        error.errors = errors;
        return Promise.reject(error);
      }
    }
    // Fallback for non-standard responses
    if (response.data && response.data.data) {
      return response.data.data;
    }
    // If response.data exists and has properties, return it (might already be extracted)
    if (response.data && typeof response.data === 'object' && Object.keys(response.data).length > 0) {
      return response.data;
    }
    return response.data;
  }

  /**
   * Handle error responses
   */
  private handleErrorResponse(error: any): Promise<any> {
    // Handle network errors (connection refused, timeout, etc.) - don't redirect
    if (!error.response) {
      // Network error - server not reachable
      const errorObj = new Error(error.message || 'Network error: Unable to connect to server') as any;
      errorObj.isNetworkError = true;
      errorObj.code = error.code; // e.g., 'ERR_CONNECTION_REFUSED', 'ECONNREFUSED'
      return Promise.reject(errorObj);
    }
    
    if (error.response) {
      const responseData = error.response.data || {};
      const status = error.response.status;
      const message = responseData.message || responseData.error || error.message || 'An error occurred';
      const errorCode = responseData.error_code;
      
      // Handle EMAIL_NOT_VERIFIED - don't store in sessionStorage or show modal
      // Verification status is shown on Profile page instead
      if (status === 401 && errorCode === 'EMAIL_NOT_VERIFIED') {
        // Return error with verification info - don't redirect to login or show modal
        const errorObj = new Error(message) as any;
        errorObj.errors = responseData.errors || [];
        errorObj.status = status;
        errorObj.isAuthError = true;
        errorObj.requiresVerification = true;
        errorObj.errorCode = errorCode;
        return Promise.reject(errorObj);
      }
      
      // Handle 403 Forbidden errors - user is authenticated but lacks permission (e.g., supplier accessing cart)
      // Don't redirect, just return the error
      if (status === 403) {
        const errorObj = new Error(message) as any;
        errorObj.errors = responseData.errors || [];
        errorObj.status = status;
        errorObj.isForbidden = true;
        return Promise.reject(errorObj);
      }
      
      // Handle authentication errors (401) - but not EMAIL_NOT_VERIFIED
      if (status === 401 || message.toLowerCase().includes('deactivated') || message.toLowerCase().includes('account has been')) {
        // Check if this is a public API endpoint that shouldn't require auth
        const requestUrl = error.config?.url || '';
        const isPublicAPI = requestUrl.includes('/public/products') ||
                           requestUrl.includes('/categories') ||
                           requestUrl.includes('/brands') ||
                           requestUrl.includes('/attribute_types') ||
                           requestUrl.includes('/search') ||
                           requestUrl.includes('/signup') ||
                           requestUrl.includes('/login');
        
        // Only redirect if we're not on a public page and not a public API
        const currentPath = window.location.pathname;
        const isPublicPage = currentPath === '/' || 
                            currentPath === '/auth' || 
                            currentPath.startsWith('/products') ||
                            currentPath.startsWith('/product/') ||
                            currentPath.startsWith('/forgot-password') ||
                            currentPath.startsWith('/reset-password') ||
                            currentPath.startsWith('/verify-email');
        
        // Don't redirect for public APIs - they shouldn't require auth
        // Don't redirect for /users/me endpoint - it's used to check auth status
        const isAuthCheckAPI = requestUrl.includes('/users/me');
        
        // Only redirect if not on public page and not a public API and not an auth check
        if (!isPublicPage && !isPublicAPI && !isAuthCheckAPI) {
          this.handleAuthError();
        }
        
        const errorObj = new Error(message) as any;
        errorObj.errors = responseData.errors || [];
        errorObj.status = status;
        errorObj.isAuthError = true;
        return Promise.reject(errorObj);
      }
      
      // Backend error format: { success: false, message, errors }
      if (responseData.success === false) {
        const errors = responseData.errors || [];
        const errorObj = new Error(message) as any;
        errorObj.errors = errors;
        errorObj.status = status;
        return Promise.reject(errorObj);
      }
      
      // Fallback error handling
      const errors = responseData.errors || [];
      const errorObj = new Error(message) as any;
      errorObj.errors = errors;
      errorObj.status = status;
      return Promise.reject(errorObj);
    }
    return Promise.reject(error);
  }

  /**
   * Handle authentication errors - clear tokens and redirect
   */
  private handleAuthError(): void {
    // No localStorage to clear - tokens are in cookies only
    // Cookies are cleared by server on logout
    // Redirect to login page
    if (window.location.pathname !== '/auth') {
      window.location.href = '/auth';
    }
  }

  /**
   * Get the axios instance (for advanced usage)
   */
  getInstance(): AxiosInstance {
    return this.api;
  }
}

/**
 * Default API client instance
 */
export const apiClient = new BaseApiClient();
export const api = apiClient.getInstance();


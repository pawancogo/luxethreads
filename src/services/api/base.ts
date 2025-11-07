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
    });

    this.setupInterceptors();
  }

  /**
   * Setup request and response interceptors
   */
  private setupInterceptors(): void {
    // Request interceptor - add authentication tokens
    this.api.interceptors.request.use(
      (config) => {
        const isAdminRoute = config.url?.includes('/admin/') && !config.url?.includes('/admin/login');
        
        if (isAdminRoute) {
          const adminToken = localStorage.getItem('admin_token');
          if (adminToken) {
            config.headers.Authorization = `Bearer ${adminToken}`;
          }
        } else {
          const token = localStorage.getItem('auth_token');
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
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
    // Handle backend standardized response format: { success, message, data }
    if (response.data && response.data.success !== undefined) {
      if (response.data.success && response.data.data) {
        return response.data.data;
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
    return response.data;
  }

  /**
   * Handle error responses
   */
  private handleErrorResponse(error: any): Promise<any> {
    if (error.response) {
      const responseData = error.response.data || {};
      const status = error.response.status;
      const message = responseData.message || responseData.error || error.message || 'An error occurred';
      
      // Handle authentication errors (401)
      if (status === 401 || message.toLowerCase().includes('deactivated') || message.toLowerCase().includes('account has been')) {
        this.handleAuthError();
        
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
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    
    // Clear cookies
    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });
    
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


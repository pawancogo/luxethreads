/**
 * URL Utilities
 * Centralized URL query parameter handling
 * Follows DRY principle - single source of truth for URL operations
 */

/**
 * Get query parameter from URL search string
 */
export const getQueryParam = (search: string, key: string, defaultValue: string = ''): string => {
  const params = new URLSearchParams(search);
  return params.get(key) || defaultValue;
};

/**
 * Get multiple query parameters
 */
export const getQueryParams = (search: string, keys: string[]): Record<string, string> => {
  const params = new URLSearchParams(search);
  const result: Record<string, string> = {};
  
  keys.forEach(key => {
    const value = params.get(key);
    if (value) {
      result[key] = value;
    }
  });
  
  return result;
};

/**
 * Update query parameter in URL without navigation
 */
export const updateQueryParam = (pathname: string, search: string, key: string, value: string | null): void => {
  const params = new URLSearchParams(search);
  
  if (value) {
    params.set(key, value);
  } else {
    params.delete(key);
  }
  
  const queryString = params.toString();
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
  window.history.replaceState({}, '', newUrl);
};

/**
 * Update multiple query parameters
 */
export const updateQueryParams = (
  pathname: string,
  search: string,
  updates: Record<string, string | null>
): void => {
  const params = new URLSearchParams(search);
  
  Object.entries(updates).forEach(([key, value]) => {
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
  });
  
  const queryString = params.toString();
  const newUrl = queryString ? `${pathname}?${queryString}` : pathname;
  window.history.replaceState({}, '', newUrl);
};

/**
 * Build query string from object
 */
export const buildQueryString = (params: Record<string, string | number | null | undefined>): string => {
  const searchParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== '') {
      searchParams.append(key, String(value));
    }
  });
  
  return searchParams.toString();
};


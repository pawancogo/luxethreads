/**
 * Storage Utility
 * Manages localStorage for non-sensitive data
 * 
 * SECURITY POLICY:
 * - ✅ Store in localStorage: User profile, preferences, UI state, cached data
 * - ❌ NEVER store in localStorage: Tokens, passwords, sensitive data
 * - 🔒 Sensitive data (tokens) stored in httpOnly cookies (handled by backend)
 */

const STORAGE_KEYS = {
  // User data (non-sensitive)
  USER: 'user',
  USER_PREFERENCES: 'user_preferences',
  USER_SETTINGS: 'user_settings',
  
  // Cart & Wishlist (non-sensitive)
  CART: 'cart',
  WISHLIST: 'wishlist',
  
  // UI State (non-sensitive)
  THEME: 'theme',
  LANGUAGE: 'language',
  SIDEBAR_STATE: 'sidebar_state',
  
  // Cached data (non-sensitive)
  PRODUCT_CACHE: 'product_cache',
  CATEGORY_CACHE: 'category_cache',
  
  // Filters & Search (non-sensitive)
  SEARCH_HISTORY: 'search_history',
  FILTER_PREFERENCES: 'filter_preferences',
} as const;

export type StorageKey = typeof STORAGE_KEYS[keyof typeof STORAGE_KEYS];

/**
 * Safe localStorage wrapper with error handling
 */
class StorageManager {
  /**
   * Set item in localStorage
   * @param key Storage key
   * @param value Value to store (will be JSON stringified)
   */
  static set<T>(key: StorageKey | string, value: T): boolean {
    try {
      const serialized = JSON.stringify(value);
      localStorage.setItem(key, serialized);
      return true;
    } catch (error) {
      console.error(`Failed to save to localStorage [${key}]:`, error);
      // Handle quota exceeded error
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        console.warn('localStorage quota exceeded. Clearing old data...');
        this.clearOldData();
        // Retry once
        try {
          localStorage.setItem(key, JSON.stringify(value));
          return true;
        } catch (retryError) {
          console.error('Failed to save after clearing old data:', retryError);
        }
      }
      return false;
    }
  }

  /**
   * Get item from localStorage
   * @param key Storage key
   * @param defaultValue Default value if not found
   */
  static get<T>(key: StorageKey | string, defaultValue: T | null = null): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Failed to read from localStorage [${key}]:`, error);
      return defaultValue;
    }
  }

  /**
   * Remove item from localStorage
   */
  static remove(key: StorageKey | string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove from localStorage [${key}]:`, error);
    }
  }

  /**
   * Clear all localStorage (use with caution)
   */
  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Failed to clear localStorage:', error);
    }
  }

  /**
   * Clear only sensitive data (keeps user preferences, cache, etc.)
   */
  static clearSensitive(): void {
    // Remove user/admin data but keep preferences and cache
    this.remove(STORAGE_KEYS.USER);
    // Note: Tokens are in cookies, not localStorage
  }

  /**
   * Clear old cached data to free up space
   */
  private static clearOldData(): void {
    // Clear cache data first (can be regenerated)
    this.remove(STORAGE_KEYS.PRODUCT_CACHE);
    this.remove(STORAGE_KEYS.CATEGORY_CACHE);
    
    // Clear old search history (keep last 10)
    const searchHistory = this.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []);
    if (searchHistory.length > 10) {
      this.set(STORAGE_KEYS.SEARCH_HISTORY, searchHistory.slice(-10));
    }
  }

  /**
   * Check if localStorage is available
   */
  static isAvailable(): boolean {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get storage size in bytes (approximate)
   */
  static getSize(): number {
    let total = 0;
    for (const key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        total += localStorage[key].length + key.length;
      }
    }
    return total;
  }
}

// User data storage helpers
export const userStorage = {
  set: (user: any) => StorageManager.set(STORAGE_KEYS.USER, user),
  get: () => StorageManager.get(STORAGE_KEYS.USER),
  remove: () => StorageManager.remove(STORAGE_KEYS.USER),
};

// User preferences storage helpers
export const preferencesStorage = {
  set: (preferences: any) => StorageManager.set(STORAGE_KEYS.USER_PREFERENCES, preferences),
  get: () => StorageManager.get(STORAGE_KEYS.USER_PREFERENCES, {}),
  remove: () => StorageManager.remove(STORAGE_KEYS.USER_PREFERENCES),
};

// Cart storage helpers
export const cartStorage = {
  set: (cart: any) => StorageManager.set(STORAGE_KEYS.CART, cart),
  get: () => StorageManager.get(STORAGE_KEYS.CART),
  remove: () => StorageManager.remove(STORAGE_KEYS.CART),
};

// Theme storage helpers
export const themeStorage = {
  set: (theme: string) => StorageManager.set(STORAGE_KEYS.THEME, theme),
  get: () => StorageManager.get<string>(STORAGE_KEYS.THEME, 'light'),
  remove: () => StorageManager.remove(STORAGE_KEYS.THEME),
};

// Search history storage helpers
export const searchHistoryStorage = {
  add: (query: string) => {
    const history = StorageManager.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []);
    const updated = [query, ...history.filter(q => q !== query)].slice(0, 20); // Keep last 20
    StorageManager.set(STORAGE_KEYS.SEARCH_HISTORY, updated);
  },
  get: () => StorageManager.get<string[]>(STORAGE_KEYS.SEARCH_HISTORY, []),
  clear: () => StorageManager.remove(STORAGE_KEYS.SEARCH_HISTORY),
};

export { StorageManager, STORAGE_KEYS };
export default StorageManager;


/**
 * Device Information Utility
 * Captures device, browser, and screen information for login sessions
 */

export interface DeviceInfo {
  screen_resolution: string;
  viewport_size: string;
  connection_type: string;
  platform: string;
  app_version?: string;
}

/**
 * Get screen resolution
 */
export function getScreenResolution(): string {
  if (typeof window === 'undefined') return '';
  return `${window.screen.width}x${window.screen.height}`;
}

/**
 * Get viewport size
 */
export function getViewportSize(): string {
  if (typeof window === 'undefined') return '';
  return `${window.innerWidth}x${window.innerHeight}`;
}

/**
 * Get connection type (if available)
 */
export function getConnectionType(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  
  // @ts-ignore - connection API may not be available in all browsers
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  
  if (connection) {
    // @ts-ignore
    return connection.effectiveType || connection.type || 'unknown';
  }
  
  return 'unknown';
}

/**
 * Get platform
 */
export function getPlatform(): string {
  if (typeof navigator === 'undefined') return 'web';
  
  const userAgent = navigator.userAgent.toLowerCase();
  
  if (/android/.test(userAgent)) return 'android';
  if (/iphone|ipad|ipod/.test(userAgent)) return 'ios';
  if (/mac/.test(userAgent)) return 'macos';
  if (/win/.test(userAgent)) return 'windows';
  if (/linux/.test(userAgent)) return 'linux';
  
  return 'web';
}

/**
 * Get app version from package.json or environment
 */
export function getAppVersion(): string {
  // In Vite, use import.meta.env instead of process.env
  // VITE_APP_VERSION can be set in .env file
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env.VITE_APP_VERSION || '1.0.0';
  }
  // Fallback for non-Vite environments
  return '1.0.0';
}

/**
 * Get all device information
 */
export function getDeviceInfo(): DeviceInfo {
  return {
    screen_resolution: getScreenResolution(),
    viewport_size: getViewportSize(),
    connection_type: getConnectionType(),
    platform: getPlatform(),
    app_version: getAppVersion(),
  };
}

/**
 * Get device info as query params for API requests
 */
export function getDeviceInfoParams(): Record<string, string> {
  const info = getDeviceInfo();
  const params: Record<string, string> = {};
  
  if (info.screen_resolution) params.screen_resolution = info.screen_resolution;
  if (info.viewport_size) params.viewport_size = info.viewport_size;
  if (info.connection_type) params.connection_type = info.connection_type;
  if (info.platform) params.platform = info.platform;
  if (info.app_version) params.app_version = info.app_version;
  
  return params;
}


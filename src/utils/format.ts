/**
 * Formatting Utilities
 * Centralized formatting functions following DRY principle
 */

/**
 * Format currency (INR by default)
 */
export function formatCurrency(
  amount: number | string | null | undefined,
  options?: {
    currency?: string;
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSymbol?: boolean;
  }
): string {
  if (amount === null || amount === undefined) {
    return options?.showSymbol !== false ? '₹0' : '0';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return options?.showSymbol !== false ? '₹0' : '0';
  }

  const {
    currency = 'INR',
    locale = 'en-IN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 0,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numAmount);
}

/**
 * Format price (without currency symbol, with commas)
 */
export function formatPrice(
  amount: number | string | null | undefined,
  options?: {
    locale?: string;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
  }
): string {
  if (amount === null || amount === undefined) {
    return '0';
  }

  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  
  if (isNaN(numAmount)) {
    return '0';
  }

  const {
    locale = 'en-IN',
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
  } = options || {};

  return new Intl.NumberFormat(locale, {
    style: 'decimal',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numAmount);
}

/**
 * Format date
 */
export function formatDate(
  date: Date | string | number | null | undefined,
  options?: {
    locale?: string;
    dateStyle?: 'full' | 'long' | 'medium' | 'short';
    timeStyle?: 'full' | 'long' | 'medium' | 'short';
    format?: string; // Custom format like 'YYYY-MM-DD'
  }
): string {
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const { locale = 'en-IN', dateStyle, timeStyle, format } = options || {};

  // Custom format
  if (format) {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return format
      .replace('YYYY', String(year))
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  }

  // Use Intl.DateTimeFormat
  const formatOptions: Intl.DateTimeFormatOptions = {};
  if (dateStyle) formatOptions.dateStyle = dateStyle;
  if (timeStyle) formatOptions.timeStyle = timeStyle;

  return new Intl.DateTimeFormat(locale, formatOptions).format(dateObj);
}

/**
 * Format relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(
  date: Date | string | number | null | undefined
): string {
  if (!date) {
    return '';
  }

  const dateObj = typeof date === 'string' || typeof date === 'number'
    ? new Date(date)
    : date;

  if (isNaN(dateObj.getTime())) {
    return '';
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? 's' : ''} ago`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} year${diffInYears > 1 ? 's' : ''} ago`;
}

/**
 * Format percentage
 */
export function formatPercentage(
  value: number | string | null | undefined,
  options?: {
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    showSign?: boolean;
  }
): string {
  if (value === null || value === undefined) {
    return '0%';
  }

  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  if (isNaN(numValue)) {
    return '0%';
  }

  const {
    minimumFractionDigits = 0,
    maximumFractionDigits = 1,
    showSign = false,
  } = options || {};

  const formatted = new Intl.NumberFormat('en-IN', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits,
  }).format(numValue / 100);

  if (showSign && numValue > 0) {
    return `+${formatted}`;
  }

  return formatted;
}

/**
 * Format file size
 */
export function formatFileSize(
  bytes: number | string | null | undefined
): string {
  if (bytes === null || bytes === undefined) {
    return '0 B';
  }

  const numBytes = typeof bytes === 'string' ? parseFloat(bytes) : bytes;
  
  if (isNaN(numBytes) || numBytes === 0) {
    return '0 B';
  }

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(numBytes) / Math.log(k));

  return `${parseFloat((numBytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format phone number
 */
export function formatPhoneNumber(
  phone: string | number | null | undefined
): string {
  if (!phone) {
    return '';
  }

  const phoneStr = String(phone).replace(/\D/g, '');
  
  if (phoneStr.length === 10) {
    return `${phoneStr.slice(0, 5)} ${phoneStr.slice(5)}`;
  }
  
  if (phoneStr.length === 11 && phoneStr.startsWith('0')) {
    return `${phoneStr.slice(0, 6)} ${phoneStr.slice(6)}`;
  }

  return phoneStr;
}

/**
 * Truncate text
 */
export function truncate(
  text: string | null | undefined,
  maxLength: number,
  suffix: string = '...'
): string {
  if (!text) {
    return '';
  }

  if (text.length <= maxLength) {
    return text;
  }

  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Format order number
 */
export function formatOrderNumber(
  orderId: number | string | null | undefined,
  prefix: string = 'ORD'
): string {
  if (orderId === null || orderId === undefined) {
    return '';
  }

  const id = typeof orderId === 'string' ? parseInt(orderId, 10) : orderId;
  
  if (isNaN(id)) {
    return '';
  }

  return `${prefix}-${String(id).padStart(8, '0')}`;
}


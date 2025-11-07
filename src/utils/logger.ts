/**
 * Centralized logging utility
 * Logs only in development mode, prevents console logs in production
 */

const isDev = import.meta.env.DEV;
const isProd = import.meta.env.PROD;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log(...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, but format them properly
    if (isDev) {
      console.error(...args);
    } else {
      // In production, send to error tracking service (e.g., Sentry)
      // Sentry.captureException(...args);
      console.error(...args); // Keep for now, but should be replaced with error service
    }
  },

  warn: (...args: any[]) => {
    if (isDev) {
      console.warn(...args);
    }
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug(...args);
    }
  },

  info: (...args: any[]) => {
    if (isDev) {
      console.info(...args);
    }
  },
};


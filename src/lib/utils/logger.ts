const isDevelopment = process.env.NODE_ENV === 'development';

export const logger = {
  error: (message: string, ...args: any[]) => console.error(message, ...args),
  warn: (message: string, ...args: any[]) => console.warn(message, ...args),

  info: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(message, ...args);
    }
  },
  debug: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[DEBUG] ${message}`, ...args);
    }
  },

  security: (message: string, ...args: any[]) => {
    if (isDevelopment) {
      console.log(`[SECURITY] ${message}`, ...args);
    }
  },
};

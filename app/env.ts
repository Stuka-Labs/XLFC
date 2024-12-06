import Constants from 'expo-constants';

const extra = Constants.expoConfig?.extra;

if (!extra) {
  throw new Error("Expo config is not set correctly. Ensure 'extra' is defined in app.config.js.");
}

// Extract NODE_ENV and export it
export const NODE_ENV = extra.NODE_ENV || "development"; // Fallback to development if undefined
export const isDevelopment = NODE_ENV === "development"; // Handy boolean for development checks
export const isProduction = NODE_ENV === "production"; // Handy boolean for production checks

// API configuration. VITE_* values come from SSM (/ujto/<env>/web) via
// scripts/load-env-from-ssm.sh, locally and in the GitHub Pages build.
const configuredApiBaseUrl = import.meta.env.VITE_API_BASE_URL as string | undefined;

if (!configuredApiBaseUrl && import.meta.env.PROD) {
  throw new Error('Missing VITE_API_BASE_URL. Load it from SSM with scripts/load-env-from-ssm.sh.');
}

// Local default: the FastAPI dev server (be/api-be).
export const API_BASE_URL = (configuredApiBaseUrl || 'http://localhost:8000').replace(/\/$/, '');

// Base path configuration for GitHub Pages custom domain deployment
export const BASE_PATH = '';

// Helper function to create proper URLs for the subdirectory deployment
export const createUrl = (path: string) => {
  // Remove leading slash to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return BASE_PATH ? `${BASE_PATH}/${cleanPath}` : `/${cleanPath}`;
};

export const isProduction = import.meta.env.MODE === 'production';
export const isDevelopment = !isProduction;

// Stripe configuration - ONLY public key for frontend
export const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLIC_KEY;

// Graceful handling of missing Stripe key
if (!STRIPE_PUBLIC_KEY) {
  if (import.meta.env.MODE === 'production') {
    console.error('Missing VITE_STRIPE_PUBLIC_KEY environment variable. Stripe payments will not work.');
  } else {
    console.warn('VITE_STRIPE_PUBLIC_KEY not set in development.');
  }
}
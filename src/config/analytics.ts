/**
 * Google Analytics Configuration
 * 
 * To set up Google Analytics:
 * 1. Go to https://analytics.google.com/
 * 2. Create a new property (or use existing)
 * 3. Get your Measurement ID (format: G-XXXXXXXXXX)
 * 4. Replace the value below or set via environment variable
 */

export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-39VJN2GMPQ';

// Enable/disable tracking (useful for development)
export const GA_ENABLED = import.meta.env.VITE_GA_ENABLED !== 'false' && GA_MEASUREMENT_ID !== '';

// Debug mode (logs tracking events to console)
export const GA_DEBUG = import.meta.env.DEV || import.meta.env.VITE_GA_DEBUG === 'true';


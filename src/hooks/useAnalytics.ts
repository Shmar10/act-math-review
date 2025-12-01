import { useEffect } from 'react';
import { initGA, trackPageView, trackEvent } from '../utils/analytics';
import { GA_ENABLED } from '../config/analytics';

/**
 * Hook to initialize Google Analytics on mount
 */
export function useAnalyticsInit() {
  useEffect(() => {
    if (GA_ENABLED) {
      initGA();
      // Track initial page view
      trackPageView(window.location.pathname, document.title);
    }
  }, []);
}

/**
 * Hook to track page views when pathname changes
 */
export function usePageTracking(pathname: string, title?: string) {
  useEffect(() => {
    if (GA_ENABLED) {
      trackPageView(pathname, title);
    }
  }, [pathname, title]);
}

/**
 * Re-export tracking functions for convenience
 */
export { trackEvent, trackPracticeStarted, trackQuestionAnswered, trackPracticeCompleted, trackAdminAccess, trackSettingsChange } from '../utils/analytics';


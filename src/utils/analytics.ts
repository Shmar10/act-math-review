import { GA_MEASUREMENT_ID, GA_ENABLED, GA_DEBUG } from '../config/analytics';

declare global {
  interface Window {
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];
  }
}

/**
 * Initialize Google Analytics
 */
export function initGA() {
  if (!GA_ENABLED) {
    if (GA_DEBUG) {
      console.log('[GA] Analytics disabled');
    }
    return;
  }

  // Add gtag script
  const script1 = document.createElement('script');
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script1);

  // Initialize dataLayer and gtag
  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    if (window.dataLayer) {
      window.dataLayer.push(arguments);
    }
  };
  window.gtag('js', new Date());
  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: window.location.pathname,
  });

  if (GA_DEBUG) {
    console.log('[GA] Initialized with ID:', GA_MEASUREMENT_ID);
  }
}

/**
 * Track a page view
 */
export function trackPageView(path: string, title?: string) {
  if (!GA_ENABLED || !window.gtag) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    page_path: path,
    page_title: title,
  });

  if (GA_DEBUG) {
    console.log('[GA] Page view:', path, title);
  }
}

/**
 * Track an event
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
) {
  if (!GA_ENABLED || !window.gtag) return;

  const eventParams: any = {
    event_category: category,
  };

  if (label) {
    eventParams.event_label = label;
  }

  if (value !== undefined) {
    eventParams.value = value;
  }

  window.gtag('event', action, eventParams);

  if (GA_DEBUG) {
    console.log('[GA] Event:', { action, category, label, value });
  }
}

/**
 * Track practice session started
 */
export function trackPracticeStarted(mode: string, topic: string, difficulty: number) {
  trackEvent('practice_started', 'Practice', `${mode}_${topic}_${difficulty}`);
}

/**
 * Track question answered
 */
export function trackQuestionAnswered(questionId: string, correct: boolean, topic: string) {
  trackEvent(
    correct ? 'question_correct' : 'question_incorrect',
    'Question',
    `${questionId}_${topic}`,
    correct ? 1 : 0
  );
}

/**
 * Track practice session completed
 */
export function trackPracticeCompleted(
  mode: string,
  totalQuestions: number,
  correctAnswers: number
) {
  const accuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;
  trackEvent('practice_completed', 'Practice', mode, Math.round(accuracy));
}

/**
 * Track admin page access
 */
export function trackAdminAccess() {
  trackEvent('admin_access', 'Admin', 'admin_review');
}

/**
 * Track settings change
 */
export function trackSettingsChange(setting: string, value: string | number) {
  trackEvent('settings_changed', 'Settings', setting, typeof value === 'number' ? value : undefined);
}


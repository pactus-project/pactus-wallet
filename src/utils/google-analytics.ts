// Declare global gtag function
declare global {
  interface Window {
    gtag: (command: 'config' | 'event', targetId: string, config?: Record<string, unknown>) => void;
  }
}

// When in development (localhost), we don't want to track
const isDev =
  process.env.NODE_ENV === 'development' ||
  (typeof window !== 'undefined' && window.location.hostname === 'localhost');

// Google Analytics measurement ID
// No tracking in development
export const GA_MEASUREMENT_ID = isDev
  ? undefined // No tracking ID in development
  : process.env.NEXT_PUBLIC_GA_ID;

// Log page views
export const pageview = (url: string) => {
  // Don't track if no measurement ID or in development
  if (!GA_MEASUREMENT_ID || isDev) return;

  window.gtag('config', GA_MEASUREMENT_ID, {
    pagePath: url,
  });
};

// Log specific events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label: string;
  value?: number;
}) => {
  // Don't track if no measurement ID or in development
  if (!GA_MEASUREMENT_ID || isDev) return;

  window.gtag('event', action, {
    eventCategory: category,
    eventLabel: label,
    value,
  });
};

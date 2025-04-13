// Declare global gtag function
declare global {
  interface Window {
    gtag: (command: 'config' | 'event', targetId: string, config?: Record<string, unknown>) => void;
  }
}

// Google Analytics measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

// Log page views
export const pageview = (url: string) => {
  if (!GA_MEASUREMENT_ID) return;

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
  if (!GA_MEASUREMENT_ID) return;

  window.gtag('event', action, {
    eventCategory: category,
    eventLabel: label,
    value,
  });
};

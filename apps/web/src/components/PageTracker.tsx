'use client';

import { usePageTracking } from '@/hooks/usePageTracking';

export default function PageTracker() {
  // Use the tracking hook
  usePageTracking();

  // This component doesn't render anything
  return null;
}

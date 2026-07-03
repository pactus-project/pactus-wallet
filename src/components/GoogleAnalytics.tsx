'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { pageview } from '@/utils/google-analytics';

export default function GoogleAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isDev =
    process.env.NODE_ENV === 'development' ||
    (typeof window !== 'undefined' && window.location.hostname === 'localhost');

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

      // Only call pageview if not in development
      if (!isDev) {
        pageview(url);
      } else {
        console.log('[Analytics] Tracking disabled in development environment');
      }
    }
  }, [pathname, searchParams, isDev]);

  return null;
}

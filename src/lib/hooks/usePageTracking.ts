import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import posthog from 'posthog-js';
import { EVENTS, PROPERTIES } from '@/app/providers';

/**
 * Hook to track page views with PostHog
 * This will help us test the reverse proxy setup
 */
export function usePageTracking() {
  const pathname = usePathname();

  useEffect(() => {
    // Only track if PostHog is initialized
    if (typeof window !== 'undefined' && posthog.__loaded) {
      posthog.capture(EVENTS.PAGE_VIEWED, {
        [PROPERTIES.PAGE_PATH]: pathname,
        [PROPERTIES.PAGE_TITLE]: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname]);
}

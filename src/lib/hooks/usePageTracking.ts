import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { EVENTS, PROPERTIES } from '@/app/providers';

/**
 * Hook to track page views with PostHog
 * This will help us test the reverse proxy setup
 */
export function usePageTracking() {
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog && typeof window !== 'undefined') {
      posthog.capture(EVENTS.PAGE_VIEWED, {
        [PROPERTIES.PAGE_PATH]: pathname,
        [PROPERTIES.PAGE_TITLE]: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname, posthog]);
}

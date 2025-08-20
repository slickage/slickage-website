'use client';

import { usePageTracking } from '@/lib/hooks/usePageTracking';

/**
 * Client component to track page views
 * Used to test PostHog reverse proxy setup
 */
export function PageTracker() {
  usePageTracking();
  return null;
}

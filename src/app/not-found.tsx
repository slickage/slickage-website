'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { useEffect } from 'react';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

export default function NotFound() {
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    trackEvent('NOT_FOUND_PAGE_VIEWED', {
      PAGE_PATH: window.location.pathname,
      REFERRER: document.referrer || 'direct',
    });
  }, [trackEvent]);
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
        <h1 className="text-6xl font-bold text-blue-400 mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-4">Page Not Found</h2>
        <p className="text-gray-400 mb-6">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          href="/"
          onClick={() =>
            trackEvent('NAVIGATION_CLICKED', {
              LINK_TEXT: 'Back to Home',
              DESTINATION: '/',
              MENU_TYPE: '404_page',
            })
          }
          className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}

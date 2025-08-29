'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/utils/logger';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { trackEvent } = useEventTracking();

  useEffect(() => {
    logger.error('Global error:', error);

    trackEvent('ERROR_PAGE_VIEWED', {
      ERROR_TYPE: 'global_error',
      ERROR_MESSAGE: error.message,
      ERROR_STACK: error.stack?.slice(0, 500),
      PAGE_PATH: window.location.pathname,
    });
  }, [error, trackEvent]);

  return (
    <main className="flex-1 py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-200 mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-8">
              We encountered an error while loading this page. Please try again or contact support
              if the problem persists.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button onClick={reset} variant="default">
              Try again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              Go back
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}

'use client';

import { useEffect } from 'react';
import { logger } from '@/lib/utils/logger';
import { useEventTracking } from '@/lib/hooks/useEventTracking';

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
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          We apologize for the inconvenience. Please try again or contact support if the problem
          persists.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

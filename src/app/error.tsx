'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { logger } from '@/lib/utils/logger';
import { usePostHog } from 'posthog-js/react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    setIsRetrying(true);  
    setTimeout(() => {
      reset();
      setIsRetrying(false);
    }, 300);
  };

  const posthog = usePostHog();
  useEffect(() => {
    logger.error('Global error:', error);

    window.scrollTo({ top: 0, behavior: 'smooth' });

    posthog.capture('error_page_view', {
      error_type: 'global_error',
      error_message: error.message,
      error_stack: error.stack?.slice(0, 500),
      page_path: window.location.pathname,
    });
  }, [error, posthog]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-8">
            <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-200 mb-4">Something went wrong</h1>
            <p className="text-gray-400 mb-8">
              We encountered an error while loading this page. Please try again or contact us
              if the problem persists.
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button 
              onClick={handleRetry} 
              variant="default" 
              loading={isRetrying}
              loadingText="Retrying..."
              className="min-w-[120px]"
            >
              Try again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              Go back
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

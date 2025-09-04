'use client';

import { posthog } from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';
import { useClientConfig } from '@/lib/hooks/use-client-config';
import { env } from '@/lib/env';
import { logger } from '@/lib/utils/logger';
import { PostHogPageTracker } from './page-tracker';

export function PostHogProvider({ children }: { children: ReactNode }) {
  const { config } = useClientConfig('posthog');

  const posthogConfig = config?.posthog;

  useEffect(() => {
    if (posthogConfig?.enabled && posthogConfig.key && posthogConfig.host) {
      posthog.init(posthogConfig.key, {
        api_host: '/ingest',
        ui_host: posthogConfig.host,
        debug: env.isDevelopment,
        cookieless_mode: 'on_reject',

        loaded: function () {
          logger.info('PostHog loaded successfully with reverse proxy');
        },

        // TODO: Remove this once we move site to slickage.com
        cross_subdomain_cookie: false,
      });
    }
  }, [posthogConfig]);

  if (posthogConfig?.enabled) {
    return (
      <PHProvider client={posthog}>
        <PostHogPageTracker />
        {children}
      </PHProvider>
    );
  }

  return <>{children}</>;
}

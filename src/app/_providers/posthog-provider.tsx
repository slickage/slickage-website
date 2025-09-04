'use client';

import { posthog } from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';
import dynamic from 'next/dynamic';
import { env } from '@/env';

interface PostHogConfig {
  key: string;
  host: string;
  enabled: boolean;
}

interface PostHogProviderProps {
  config: PostHogConfig;
  children: ReactNode;
}

const SuspensePostHogPageTracker = dynamic(
  () => import('./page-tracker').then(mod => ({ default: mod.PostHogPageTracker })),
  {
    ssr: false,
  },
);

export function PostHogProvider({ config, children }: PostHogProviderProps) {
  useEffect(() => {
    if (config?.enabled && config.key && config.host) {
      posthog.init(config.key, {
        api_host: '/ingest',
        ui_host: config.host,
        debug: env.isDevelopment,
        cookieless_mode: 'on_reject',

        loaded: function () {
          logger.info('PostHog loaded successfully with reverse proxy');
        },

        // TODO: Remove this once we move site to slickage.com
        cross_subdomain_cookie: false,
      });
    }
  }, [config]);

  if (config?.enabled) {
    return (
      <PHProvider client={posthog}>
        <SuspensePostHogPageTracker />
        {children}
      </PHProvider>
    );
  }

  return <>{children}</>;
}

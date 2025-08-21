import { useState, useEffect } from 'react';
import { logger } from '@/lib/utils/logger';

interface RecaptchaConfig {
  siteKey: string;
  enabled: boolean;
}

interface PostHogConfig {
  key: string;
  host: string;
  enabled: boolean;
}

interface ClientConfig {
  recaptcha: RecaptchaConfig;
  posthog: PostHogConfig;
}

export function useClientConfig<T extends keyof ClientConfig>(configKey: T) {
  const [config, setConfig] = useState<ClientConfig[T] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const response = await fetch('/api/client-config');

        if (!response.ok) {
          throw new Error(`Failed to fetch client configuration: ${response.status}`);
        }

        const data: ClientConfig = await response.json();
        setConfig(data[configKey]);
      } catch (err) {
        logger.error(`useClientConfig: Failed to fetch ${configKey} config:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConfig();
  }, [configKey]);

  return {
    config,
    isLoading,
    error,
  };
}

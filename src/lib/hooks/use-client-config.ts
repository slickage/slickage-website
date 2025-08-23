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

type ConfigType = 'recaptcha' | 'posthog';

export function useClientConfig(configType: ConfigType) {
  const [config, setConfig] = useState<Partial<ClientConfig> | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {    
        const response = await fetch(`/api/client-config?config=${configType}`);

        if (!response.ok) {
          throw new Error(`Failed to fetch client configuration: ${response.status}`);
        }

        const data: Partial<ClientConfig> = await response.json();
        setConfig(data);
      } catch (err) {
        logger.error(`useClientConfig: Failed to fetch ${configType} config:`, err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    };

    fetchConfig();
  }, [configType]);

  return {
    config,
    error,
  };
}

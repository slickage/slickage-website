import { env } from '@/env';

interface RecaptchaConfig {
  siteKey: string;
  enabled: boolean;
}

interface PostHogConfig {
  key: string;
  host: string;
  enabled: boolean;
}

export interface ClientConfig {
  recaptcha: RecaptchaConfig;
  posthog: PostHogConfig;
}

export function getClientConfig(): ClientConfig {
  return {
    recaptcha: {
      siteKey: env.RECAPTCHA_SITE_KEY,
      enabled: env.isRecaptchaConfigured,
    },
    posthog: {
      key: env.POSTHOG_KEY,
      host: env.POSTHOG_HOST,
      enabled: env.isPostHogConfigured,
    },
  };
}

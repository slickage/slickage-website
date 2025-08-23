import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

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

function createClientConfig(): ClientConfig {
  return {
    recaptcha: {
      siteKey: env.RECAPTCHA_SITE_KEY,
      enabled: !!env.RECAPTCHA_SITE_KEY,
    },
    posthog: {
      key: env.POSTHOG_KEY,
      host: env.POSTHOG_HOST,
      enabled: !!env.POSTHOG_KEY,
    },
  } satisfies ClientConfig;
}

export async function GET() {
  try {
    const config = createClientConfig();
    
    // Validate critical configuration
    if (!config.recaptcha.siteKey || !config.posthog.key) {
      return NextResponse.json(
        { error: 'Configuration incomplete' },
        { status: 500 }
      );
    }
    
    return NextResponse.json(config);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to load configuration' },
      { status: 500 }
    );
  }
}

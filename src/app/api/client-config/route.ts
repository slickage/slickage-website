import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

const configMap = {
  recaptcha: {
    required: ['RECAPTCHA_SITE_KEY'],
    response: (env: any) => ({
      recaptcha: {
        siteKey: env.RECAPTCHA_SITE_KEY || '',
        enabled: env.isRecaptchaConfigured,
      },
    }),
  },
  posthog: {
    required: ['POSTHOG_KEY', 'POSTHOG_HOST'],
    response: (env: any) => ({
      posthog: {
        key: env.POSTHOG_KEY || '',
        host: env.POSTHOG_HOST || 'https://us.i.posthog.com',
        enabled: env.isPostHogConfigured,
      },
    }),
  },
} as const;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const configType = searchParams.get('config');

  if (!configType) {
    return NextResponse.json({ error: 'Config type is required' }, { status: 400 });
  }

  const config = configMap[configType as keyof typeof configMap];
  if (!config) {
    return NextResponse.json({ error: 'Invalid config type' }, { status: 400 });
  }

  // In development, allow missing environment variables and return fallback config
  if (env.isDevelopment) {
    return NextResponse.json(config.response(env));
  }

  // In production, require all environment variables
  const missingVars = config.required.filter((key) => !env[key]);
  if (missingVars.length > 0) {
    return NextResponse.json({ error: `Missing environment variables` }, { status: 500 });
  }

  return NextResponse.json(config.response(env));
}

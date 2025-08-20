import { NextResponse } from 'next/server';
import { env } from '@/lib/env';

const clientConfig = {
  recaptcha: {
    siteKey: env.RECAPTCHA_SITE_KEY,
    enabled: !!env.RECAPTCHA_SITE_KEY,
  },
  posthog: {
    key: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    enabled: !!process.env.NEXT_PUBLIC_POSTHOG_KEY,
  },
} as const;

export async function GET() {
  return NextResponse.json(clientConfig);
}

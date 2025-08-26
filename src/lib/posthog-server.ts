import { PostHog } from 'posthog-node';
import { env } from '@/lib/env';

// Mock PostHog client for development when not configured
class MockPostHogClient {
  async getAllFlags() {
    return {};
  }
  
  async capture() {
    // No-op in development
  }
  
  async shutdown() {
    // No-op in development
  }
}

export function createPostHogServer() {
  // In development, return mock client if PostHog is not configured
  if (env.isDevelopment && !env.isPostHogConfigured) {
    return new MockPostHogClient() as any;
  }

  const posthogKey = env.POSTHOG_KEY;

  const posthogHost = env.POSTHOG_HOST || 'https://us.i.posthog.com';

  if (!posthogKey) {
    throw new Error('PostHog API key not configured');
  }

  return new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 1,
    flushInterval: 0,
  });
}

export async function getServerFeatureFlags(userId: string, flagKeys?: string[]) {
  const client = createPostHogServer();

  try {
    if (flagKeys) {
      return await client.getAllFlags(userId, { flagKeys });
    } else {
      return await client.getAllFlags(userId);
    }
  } finally {
    await client.shutdown();
  }
}

export async function captureServerEvent(
  userId: string,
  event: string,
  properties?: Record<string, any>,
) {
  const client = createPostHogServer();

  try {
    await client.capture({
      distinctId: userId,
      event,
      properties,
    });
  } finally {
    await client.shutdown();
  }
}

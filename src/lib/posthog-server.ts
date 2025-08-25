import { PostHog } from 'posthog-node';
import { env } from './env';

export function createPostHogServer() {
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

import { PostHog } from 'posthog-node';

// Server-side PostHog client
export function createPostHogServer() {
  const posthogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  
  // Use reverse proxy in production, direct connection in development for easier debugging
  const posthogHost = process.env.NODE_ENV === 'production' 
    ? 'https://beta.slickage.io/ingest'  // Production proxy
    : 'https://us.i.posthog.com';       // Development direct
  
  if (!posthogKey) {
    throw new Error('PostHog API key not configured');
  }
  
  return new PostHog(posthogKey, {
    host: posthogHost,
    flushAt: 1, // Send events immediately for server-side usage
    flushInterval: 0, // Disable batching for server-side
  });
}

// Helper function to get feature flags on the server
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

// Helper function to capture server-side events
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

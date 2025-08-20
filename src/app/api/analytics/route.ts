import { NextRequest, NextResponse } from 'next/server';
import { captureServerEvent, getServerFeatureFlags } from '@/lib/posthog-server';

export async function POST(request: NextRequest) {
  try {
    const { userId, event, properties } = await request.json();

    // Example: Get feature flags for a user on the server
    const flags = await getServerFeatureFlags(userId, ['example-flag']);

    // Example: Capture a server-side event
    await captureServerEvent(userId, event, {
      ...properties,
      source: 'server-api',
      feature_flags: flags,
    });

    return NextResponse.json({
      success: true,
      message: 'Event captured',
      feature_flags: flags,
    });
  } catch (error) {
    console.error('Error capturing server event:', error);
    return NextResponse.json({ success: false, error: 'Failed to capture event' }, { status: 500 });
  }
}

/**
 * Analytics Event Versioning System
 * Following PostHog best practices for event evolution
 */

// Current analytics version
export const ANALYTICS_VERSION = 'v1';

/**
 * Create versioned event name
 * @param category - Event category (e.g., 'contact_flow', 'navigation')
 * @param action - Event action (e.g., 'form_submit', 'page_view')
 * @param version - Version number (defaults to current version)
 * @returns Versioned event name following PostHog format
 */
export function createVersionedEvent(
  category: string,
  action: string,
  version: string = ANALYTICS_VERSION
): string {
  return `${category}_${version}:${action}`;
}

/**
 * Migration utility for event versioning
 * Use when analytics requirements change
 */
export const EVENT_MIGRATIONS = {
  // Example: When we upgrade contact form events
  // 'contact_flow_v1:form_submit': 'contact_flow_v2:form_submit',
} as const;

/**
 * Check if an event should be tracked based on version
 * @param eventName - The event name to check
 * @returns Boolean indicating if event should be tracked
 */
export function shouldTrackEvent(eventName: string): boolean {
  // Always track current version events
  if (eventName.includes(`_${ANALYTICS_VERSION}:`)) {
    return true;
  }
  
  // Check if it's a legacy event we still want to track
  const isLegacyEvent = !eventName.includes('_v') && eventName.includes(':');
  
  return isLegacyEvent;
}

/**
 * Add version metadata to event properties
 * @param properties - Event properties object
 * @returns Properties with version metadata
 */
export function addVersionMetadata(properties: Record<string, any> = {}): Record<string, any> {
  return {
    ...properties,
    analytics_version: ANALYTICS_VERSION,
    event_schema_version: ANALYTICS_VERSION,
  };
}

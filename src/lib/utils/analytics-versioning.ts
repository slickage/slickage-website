/**
 * Analytics Event Versioning System
 * Provides version metadata for PostHog events
 */

// Current analytics version
export const ANALYTICS_VERSION = 'v1';

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

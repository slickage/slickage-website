import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { EVENTS, PROPERTIES } from '@/app/providers';
import { addVersionMetadata } from '@/lib/utils/analytics-versioning';

/**
 * Hook for tracking user interactions with PostHog
 * Provides typed event tracking methods
 */
export function useEventTracking() {
  const posthog = usePostHog();
  const trackEvent = useCallback(
    (
      event: keyof typeof EVENTS,
      properties?: Partial<Record<keyof typeof PROPERTIES, string | number | boolean>>,
    ) => {
      if (typeof window !== 'undefined' && posthog.__loaded) {
        const eventName = EVENTS[event];
        const eventProperties: Record<string, any> = {};

        if (properties) {
          Object.entries(properties).forEach(([key, value]) => {
            const propertyKey = key as keyof typeof PROPERTIES;
            eventProperties[PROPERTIES[propertyKey]] = value;
          });
        }

        const enrichedProperties = addVersionMetadata(eventProperties);

        posthog.capture(eventName, enrichedProperties);
      }
    },
    [],
  );

  const trackCTAClick = useCallback(
    (ctaText: string, location: string, destination?: string) => {
      trackEvent('CTA_CLICKED', {
        CTA_TEXT: ctaText,
        CTA_LOCATION: location,
        DESTINATION: destination,
      });
    },
    [trackEvent],
  );

  const trackNavigation = useCallback(
    (linkText: string, destination: string, menuType: string = 'desktop') => {
      trackEvent('NAVIGATION_CLICKED', {
        LINK_TEXT: linkText,
        DESTINATION: destination,
        MENU_TYPE: menuType,
      });
    },
    [trackEvent],
  );

  const trackFormInteraction = useCallback(
    (
      formType: string,
      action: 'viewed' | 'started' | 'submitted' | 'error',
      details?: { field?: string; error?: string; completionTime?: number },
    ) => {
      const eventMap = {
        viewed: 'CONTACT_FORM_VIEWED',
        started: 'CONTACT_FORM_STARTED',
        submitted: 'CONTACT_FORM_SUBMITTED',
        error: 'CONTACT_FORM_ERROR',
      } as const;

      const properties: Partial<Record<keyof typeof PROPERTIES, string | number>> = {
        FORM_TYPE: formType,
      };

      if (details?.field) properties.FORM_FIELD = details.field;
      if (details?.error) properties.ERROR_MESSAGE = details.error;
      if (details?.completionTime) properties.FORM_COMPLETION_TIME = details.completionTime;

      trackEvent(eventMap[action], properties);
    },
    [trackEvent],
  );

  const trackContentInteraction = useCallback(
    (
      contentType: 'case_study' | 'insight',
      action: string,
      details: { id: string; title?: string; section?: string; imageSrc?: string },
    ) => {
      const properties: Partial<Record<keyof typeof PROPERTIES, string>> = {};

      if (contentType === 'case_study') {
        properties.CASE_STUDY_ID = details.id;
        if (details.title) properties.CASE_STUDY_TITLE = details.title;
        if (details.section) properties.SECTION_NAME = details.section;
        if (details.imageSrc) properties.IMAGE_SRC = details.imageSrc;
      } else if (contentType === 'insight') {
        properties.INSIGHT_ID = details.id;
        if (details.title) properties.INSIGHT_TITLE = details.title;
      }

      const eventKey = action.toUpperCase().replace(/\s+/g, '_') as keyof typeof EVENTS;
      trackEvent(eventKey, properties);
    },
    [trackEvent],
  );

  return {
    trackEvent,
    trackCTAClick,
    trackNavigation,
    trackFormInteraction,
    trackContentInteraction,
  };
}

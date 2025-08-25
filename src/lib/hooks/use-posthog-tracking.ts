import { useCallback, useEffect } from 'react';
import { usePostHog } from 'posthog-js/react';
import { usePathname } from 'next/navigation';
import { EVENTS, PROPERTIES } from '@/app/providers';

// Type Definitions
interface EventProperties {
  [key: string]: string | number | boolean;
}

interface PostHogProperties {
  [key: string]: any;
}

interface FormInteractionDetails {
  field?: string;
  error?: string;
  completionTime?: number;
  submissionId?: string;
}

interface CaseStudyDetails {
  id: string;
  title?: string;
  section?: string;
  imageSrc?: string;
}

interface InsightDetails {
  id: string;
  title?: string;
}

// Helper Functions
function mapPropertiesToPostHogFormat(properties: EventProperties): PostHogProperties {
  const postHogProperties: PostHogProperties = {};
  
  Object.entries(properties).forEach(([key, value]) => {
    const propertyKey = key as keyof typeof PROPERTIES;
    if (PROPERTIES[propertyKey]) {
      postHogProperties[PROPERTIES[propertyKey]] = value;
    }
  });
  
  return postHogProperties;
}

function buildCaseStudyProperties(details: CaseStudyDetails): EventProperties {
  const properties: EventProperties = {
    CASE_STUDY_ID: details.id,
  };
  
  if (details.title) properties.CASE_STUDY_TITLE = details.title;
  if (details.section) properties.SECTION_NAME = details.section;
  if (details.imageSrc) properties.IMAGE_SRC = details.imageSrc;
  
  return properties;
}

function buildInsightProperties(details: InsightDetails): EventProperties {
  const properties: EventProperties = {
    INSIGHT_ID: details.id,
  };
  
  if (details.title) properties.INSIGHT_TITLE = details.title;
  
  return properties;
}

function normalizeEventKey(action: string): keyof typeof EVENTS {
  const normalizedKey = action.toUpperCase().replace(/\s+/g, '_');
  
  if (isValidEventKey(normalizedKey)) {
    return normalizedKey;
  }
  
  // Fallback to a safe default if the key doesn't exist
  return 'PAGE_VIEWED';
}

function isValidEventKey(key: string): key is keyof typeof EVENTS {
  return key in EVENTS;
}

/**
 * Hook to track page views with PostHog
 * This will help us test the reverse proxy setup
 */
export function usePageTracking() {
  const pathname = usePathname();
  const posthog = usePostHog();

  useEffect(() => {
    if (posthog && typeof window !== 'undefined') {
      posthog.capture(EVENTS.PAGE_VIEWED, {
        [PROPERTIES.PAGE_PATH]: pathname,
        [PROPERTIES.PAGE_TITLE]: document.title,
        timestamp: new Date().toISOString(),
      });
    }
  }, [pathname, posthog]);
}

/**
 * Hook for tracking user interactions with PostHog
 * Provides typed event tracking methods with simplified logic
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
        const eventProperties = properties ? mapPropertiesToPostHogFormat(properties) : {};
        
        posthog.capture(eventName, eventProperties);
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
      details?: FormInteractionDetails,
    ) => {
      const eventMap = {
        viewed: 'CONTACT_FORM_VIEWED',
        started: 'CONTACT_FORM_STARTED',
        submitted: 'CONTACT_FORM_SUBMITTED',
        error: 'CONTACT_FORM_ERROR',
      } as const;

      const properties: EventProperties = {
        FORM_TYPE: formType,
      };

      if (details?.field) properties.FORM_FIELD = details.field;
      if (details?.error) properties.ERROR_MESSAGE = details.error;
      if (details?.completionTime) properties.FORM_COMPLETION_TIME = details.completionTime;
      if (details?.submissionId) properties.SUBMISSION_ID = details.submissionId;

      trackEvent(eventMap[action], properties);
    },
    [trackEvent],
  );

  const trackContentInteraction = useCallback(
    (
      contentType: 'case_study' | 'insight',
      action: string,
      details: CaseStudyDetails | InsightDetails,
    ) => {
      let properties: EventProperties;
      
      if (contentType === 'case_study') {
        properties = buildCaseStudyProperties(details as CaseStudyDetails);
      } else {
        properties = buildInsightProperties(details as InsightDetails);
      }

      const eventKey = normalizeEventKey(action);
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

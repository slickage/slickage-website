// app/providers.tsx
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useClientConfig } from '@/lib/hooks/useClientConfig';

// Event tracking constants following cursor rules for TypeScript enums
export const EVENTS = {
  // Page and content events
  PAGE_VIEWED: 'page_viewed',
  SECTION_VIEWED: 'section_viewed',
  
  // Navigation events
  CTA_CLICKED: 'cta_clicked',
  NAVIGATION_CLICKED: 'navigation_clicked',
  MOBILE_MENU_TOGGLED: 'mobile_menu_toggled',
  
  // Contact form events
  CONTACT_FORM_VIEWED: 'contact_form_viewed',
  CONTACT_FORM_STARTED: 'contact_form_started',
  CONTACT_FORM_SUBMITTED: 'contact_form_submitted',
  CONTACT_FORM_ERROR: 'contact_form_error',
  
  // Case study events
  CASE_STUDY_VIEWED: 'case_study_viewed',
  CASE_STUDY_IMAGE_CLICKED: 'case_study_image_clicked',
  CASE_STUDY_SECTION_VIEWED: 'case_study_section_viewed',
  
  // Insights events
  INSIGHT_CARD_CLICKED: 'insight_card_clicked',
  INSIGHTS_SECTION_VIEWED: 'insights_section_viewed',
  
  // External link events
  EXTERNAL_LINK_CLICKED: 'external_link_clicked',
  
  // Error and system events
  ERROR_PAGE_VIEWED: 'error_page_viewed',
  NOT_FOUND_PAGE_VIEWED: 'not_found_page_viewed',
  ERROR_BOUNDARY_TRIGGERED: 'error_boundary_triggered',
  USER_SESSION_STARTED: 'user_session_started',
  
  // User identification events
  LEAD_IDENTIFIED: 'lead_identified',
  RETURNING_VISITOR: 'returning_visitor',
  INTERNAL_USER_DETECTED: 'internal_user_detected',
} as const;

export const PROPERTIES = {
  // Page properties
  PAGE_PATH: 'page_path',
  PAGE_TITLE: 'page_title',
  REFERRER: 'referrer',
  
  // User interaction properties
  CTA_TEXT: 'cta_text',
  CTA_LOCATION: 'cta_location',
  LINK_URL: 'link_url',
  LINK_TEXT: 'link_text',
  
  // Form properties
  FORM_TYPE: 'form_type',
  FORM_FIELD: 'form_field',
  FORM_COMPLETION_TIME: 'form_completion_time',
  
  // Content properties
  CASE_STUDY_ID: 'case_study_id',
  CASE_STUDY_TITLE: 'case_study_title',
  INSIGHT_ID: 'insight_id',
  INSIGHT_TITLE: 'insight_title',
  SECTION_NAME: 'section_name',
  IMAGE_SRC: 'image_src',
  
  // Navigation properties
  MENU_TYPE: 'menu_type',
  DESTINATION: 'destination',
  
  // Error and system properties
  ERROR_TYPE: 'error_type',
  ERROR_MESSAGE: 'error_message',
  ERROR_STACK: 'error_stack',
  SESSION_ID: 'session_id',
  USER_ID: 'user_id',
  USER_AGENT: 'user_agent',
  
  // User identification properties
  LEAD_SOURCE: 'lead_source',
  LEAD_SCORE: 'lead_score',
  FIRST_VISIT: 'first_visit',
  TOTAL_VISITS: 'total_visits',
  IS_INTERNAL: 'is_internal',
  COMPANY_DOMAIN: 'company_domain',
} as const;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { config: posthogConfig, isLoading } = useClientConfig('posthog');

  useEffect(() => {
    if (posthogConfig?.enabled && posthogConfig.key && posthogConfig.host) {
      posthog.init(posthogConfig.key, {
        api_host: '/ingest', // Use reverse proxy to bypass ad blockers
        ui_host: posthogConfig.host, // Keep UI on PostHog domain
        debug: process.env.NODE_ENV === 'development',
        // Enhanced session recording and data collection
        session_recording: {
          collectFonts: true,
          maskAllInputs: false,
        },
        autocapture: {
          // Capture more user interactions
          dom_event_allowlist: ['click', 'change', 'submit'],
        },
      });

      // Track session start with enhanced context
      posthog.capture(EVENTS.USER_SESSION_STARTED, {
        [PROPERTIES.SESSION_ID]: posthog.get_session_id(),
        [PROPERTIES.USER_AGENT]: navigator.userAgent,
        [PROPERTIES.REFERRER]: document.referrer || 'direct',
        [PROPERTIES.IS_INTERNAL]: false, // Default to external, will be updated if internal detected
        visitor_type: 'anonymous',
        session_start_time: new Date().toISOString(),
        page_load_time: performance.now(),
        screen_resolution: `${screen.width}x${screen.height}`,
        timestamp: new Date().toISOString(),
      });
    }
  }, [posthogConfig]);

  if (isLoading || !posthogConfig?.enabled) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

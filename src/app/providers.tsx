// app/providers.tsx
'use client';

import posthog from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { useEffect } from 'react';
import { useClientConfig } from '@/lib/hooks/useClientConfig';
import { addVersionMetadata } from '@/lib/utils/analytics-versioning';
import { logger } from '@/lib/utils/logger';

// Event tracking constants following PostHog best practices
// Format: category:object_action with versioning support
export const EVENTS = {
  // Page and content events - v1
  PAGE_VIEWED: 'navigation:page_view',
  SECTION_VIEWED: 'content:section_view',
  
  // Navigation events - v1
  CTA_CLICKED: 'navigation:cta_click',
  NAVIGATION_CLICKED: 'navigation:menu_click',
  MOBILE_MENU_TOGGLED: 'navigation:mobile_menu_toggle',
  
  // Contact form events - v1
  CONTACT_FORM_VIEWED: 'contact_flow:form_view',
  CONTACT_FORM_STARTED: 'contact_flow:form_start',
  CONTACT_FORM_SUBMITTED: 'contact_flow:form_submit',
  CONTACT_FORM_ERROR: 'contact_flow:form_error',
  
  // Case study events - v1
  CASE_STUDY_VIEWED: 'content:case_study_view',
  CASE_STUDY_IMAGE_CLICKED: 'content:case_study_image_click',
  CASE_STUDY_SECTION_VIEWED: 'content:case_study_section_view',
  
  // Insights events - v1
  INSIGHT_CARD_CLICKED: 'content:insight_click',
  INSIGHTS_SECTION_VIEWED: 'content:insights_section_view',
  
  // External link events - v1
  EXTERNAL_LINK_CLICKED: 'navigation:external_link_click',
  
  // Error and system events - v1
  ERROR_PAGE_VIEWED: 'system:error_page_view',
  NOT_FOUND_PAGE_VIEWED: 'system:not_found_view',
  ERROR_BOUNDARY_TRIGGERED: 'system:error_boundary_trigger',
  USER_SESSION_STARTED: 'system:session_start',
  
  // User identification events - v1
  LEAD_IDENTIFIED: 'user_flow:lead_identify',
  RETURNING_VISITOR: 'user_flow:visitor_return',
  INTERNAL_USER_DETECTED: 'system:internal_user_detect',
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
  PREVIOUS_ID: 'previous_id',
} as const;

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const { config: posthogConfig, isLoading } = useClientConfig('posthog');

  useEffect(() => {
    if (posthogConfig?.enabled && posthogConfig.key && posthogConfig.host) {
      posthog.init(posthogConfig.key, {
        api_host: '/ingest', // Use reverse proxy to bypass ad blockers
        ui_host: posthogConfig.host, // Keep UI on PostHog domain
        debug: process.env.NODE_ENV === 'development',
        
        // Privacy and consent options
        opt_out_capturing_by_default: false, // Users opt-in by default
        respect_dnt: process.env.NODE_ENV === 'production', // Only respect DNT in production
        
        // Enhanced session recording with privacy protection
        session_recording: {
          collectFonts: true,
          maskAllInputs: true, // Mask inputs for privacy
          maskInputOptions: {
            password: true,
            email: true,
          },
        },
        
        // Autocapture configuration
        autocapture: {
          dom_event_allowlist: ['click', 'change', 'submit'],
        },
        
        // Performance optimizations
        loaded: function() {
          // Custom initialization logic
          logger.info('PostHog loaded successfully with reverse proxy');
          
        },
        
        // Cross-domain tracking
        cross_subdomain_cookie: false, // Disable for privacy
      });

      // Track session start with minimal necessary data and version metadata
      posthog.capture(EVENTS.USER_SESSION_STARTED, addVersionMetadata({
        [PROPERTIES.SESSION_ID]: posthog.get_session_id(),
        [PROPERTIES.REFERRER]: document.referrer ? 'referral' : 'direct', // Categorize instead of full URL
        [PROPERTIES.IS_INTERNAL]: false, // Default to external, will be updated if internal detected
        visitor_type: 'anonymous',
        // Removed: user_agent, screen_resolution, exact timestamps for privacy
        // Keep only essential analytics data
      }));
    }
  }, [posthogConfig]);

  if (isLoading || !posthogConfig?.enabled) {
    return <>{children}</>;
  }

  return <PHProvider client={posthog}>{children}</PHProvider>;
}

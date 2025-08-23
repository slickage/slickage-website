'use client';

import { posthog } from 'posthog-js';
import { PostHogProvider as PHProvider } from 'posthog-js/react';
import { ReactNode, useEffect } from 'react';
import { useClientConfig } from '@/lib/hooks/use-client-config';
import { env } from '@/lib/env';
import { logger } from '@/lib/utils/logger';

export const EVENTS = {
  PAGE_VIEWED: 'navigation:page_view',
  SECTION_VIEWED: 'content:section_view',

  CTA_CLICKED: 'navigation:cta_click',
  NAVIGATION_CLICKED: 'navigation:menu_click',
  MOBILE_MENU_TOGGLED: 'navigation:mobile_menu_toggle',

  CONTACT_FORM_VIEWED: 'contact_flow:form_view',
  CONTACT_FORM_STARTED: 'contact_flow:form_start',
  CONTACT_FORM_SUBMITTED: 'contact_flow:form_submit',
  CONTACT_FORM_ERROR: 'contact_flow:form_error',

  CASE_STUDY_VIEWED: 'content:case_study_view',
  CASE_STUDY_IMAGE_CLICKED: 'content:case_study_image_click',
  CASE_STUDY_SECTION_VIEWED: 'content:case_study_section_view',

  INSIGHT_CARD_CLICKED: 'content:insight_click',
  INSIGHTS_SECTION_VIEWED: 'content:insights_section_view',

  EXTERNAL_LINK_CLICKED: 'navigation:external_link_click',

  ERROR_PAGE_VIEWED: 'system:error_page_view',
  NOT_FOUND_PAGE_VIEWED: 'system:not_found_view',
  ERROR_BOUNDARY_TRIGGERED: 'system:error_boundary_trigger',
  USER_SESSION_STARTED: 'system:session_start',

  LEAD_IDENTIFIED: 'user_flow:lead_identify',
  RETURNING_VISITOR: 'user_flow:visitor_return',
  INTERNAL_USER_DETECTED: 'system:internal_user_detect',
} as const;

export const PROPERTIES = {
  PAGE_PATH: 'page_path',
  PAGE_TITLE: 'page_title',
  REFERRER: 'referrer',

  CTA_TEXT: 'cta_text',
  CTA_LOCATION: 'cta_location',
  LINK_URL: 'link_url',
  LINK_TEXT: 'link_text',

  FORM_TYPE: 'form_type',
  FORM_FIELD: 'form_field',
  FORM_COMPLETION_TIME: 'form_completion_time',
  SUBMISSION_ID: 'submission_id',

  CASE_STUDY_ID: 'case_study_id',
  CASE_STUDY_TITLE: 'case_study_title',
  INSIGHT_ID: 'insight_id',
  INSIGHT_TITLE: 'insight_title',
  SECTION_NAME: 'section_name',
  IMAGE_SRC: 'image_src',

  MENU_TYPE: 'menu_type',
  DESTINATION: 'destination',

  ERROR_TYPE: 'error_type',
  ERROR_MESSAGE: 'error_message',
  ERROR_STACK: 'error_stack',
  SESSION_ID: 'session_id',
  USER_ID: 'user_id',
  USER_AGENT: 'user_agent',

  LEAD_SOURCE: 'lead_source',
  LEAD_SCORE: 'lead_score',
  FIRST_VISIT: 'first_visit',
  TOTAL_VISITS: 'total_visits',
  IS_INTERNAL: 'is_internal',
  COMPANY_DOMAIN: 'company_domain',
  PREVIOUS_ID: 'previous_id',
} as const;

export function PostHogProvider({ children }: { children: ReactNode }) {
  const { config } = useClientConfig('posthog');

  const posthogConfig = config?.posthog;
  
  useEffect(() => {
    if (posthogConfig?.enabled && posthogConfig.key && posthogConfig.host) {
      posthog.init(posthogConfig.key, {
        api_host: '/ingest',
        ui_host: posthogConfig.host,
        debug: env.isDevelopment,

        opt_out_capturing_by_default: false,
        respect_dnt: env.isProduction,

        session_recording: {
          collectFonts: true,
          maskAllInputs: true,
          maskInputOptions: {
            password: true,
            email: true,
          },
        },

        autocapture: {
          dom_event_allowlist: ['click', 'change', 'submit'],
        },

        loaded: function () {
          logger.info('PostHog loaded successfully with reverse proxy');
        },

        cross_subdomain_cookie: false,
      });

      posthog.capture(
        EVENTS.USER_SESSION_STARTED,
        {
          [PROPERTIES.SESSION_ID]: posthog.get_session_id(),
          [PROPERTIES.REFERRER]: document.referrer ? 'referral' : 'direct',
          [PROPERTIES.IS_INTERNAL]: false,
          visitor_type: 'anonymous',
        },
      );
    }
  }, [posthogConfig]);

  if (posthogConfig?.enabled) {
    return <PHProvider client={posthog}>{children}</PHProvider>;
  }
  
  return <>{children}</>;
}

import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { EVENTS, PROPERTIES } from '@/app/providers';
import { hashEmail, createSafeDistinctId, extractEmailDomain } from '@/lib/utils/privacy';

interface UserIdentificationData {
  email: string;
  company?: string;
  leadSource: string;
  formType?: string;
}

interface InternalUserCheck {
  isInternal: boolean;
  reason?: string;
}

const INTERNAL_DOMAINS = ['slickage.com', 'slickage.io'] as const;

/**
 * Hook for user identification and internal user filtering
 * Handles lead tracking and removes internal team data
 */
export function useUserIdentification() {
  const posthog = usePostHog();

  const checkInternalUser = useCallback((email: string): InternalUserCheck => {
    if (email) {
      const domain = extractEmailDomain(email);
      if (domain !== 'unknown' && INTERNAL_DOMAINS.includes(domain as any)) {
        return { isInternal: true, reason: 'internal_email_domain' };
      }
    }

    return { isInternal: false };
  }, []);

  const identifyUser = useCallback(
    async (userData: UserIdentificationData) => {
      if (typeof window === 'undefined' || !posthog) {
        return;
      }

      const { email, company, leadSource, formType } = userData;

      const internalCheck = checkInternalUser(email);

      if (internalCheck.isInternal) {
        posthog.capture(
          EVENTS.INTERNAL_USER_DETECTED,
          {
            email_hash: hashEmail(email),
            [PROPERTIES.IS_INTERNAL]: true,
            [PROPERTIES.ERROR_TYPE]: internalCheck.reason,
            [PROPERTIES.LEAD_SOURCE]: leadSource,
            [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
          },
        );

        posthog.setPersonProperties({
          [PROPERTIES.IS_INTERNAL]: true,
          internal_detection_reason: internalCheck.reason,
        });

        return;
      }

      const distinctId = createSafeDistinctId(email);

      const currentDistinctId = posthog.get_distinct_id();
      const isReturning = currentDistinctId && currentDistinctId !== distinctId;

      if (isReturning) {
        posthog.capture(
          EVENTS.RETURNING_VISITOR,
          {
            email_hash: hashEmail(email),
            [PROPERTIES.LEAD_SOURCE]: leadSource,
            [PROPERTIES.PREVIOUS_ID]: currentDistinctId,
            [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
          },
        );
      }

      posthog.identify(distinctId, {
        email_hash: hashEmail(email),
        company: company || userData.company,
        lead_source: leadSource,
        first_contact_form: formType || 'contact',
        first_identified: new Date().toISOString(),
        [PROPERTIES.IS_INTERNAL]: false,
        [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
      });

      posthog.capture(
        EVENTS.LEAD_IDENTIFIED,
        {
          email_hash: hashEmail(email),
          [PROPERTIES.LEAD_SOURCE]: leadSource,
          [PROPERTIES.FORM_TYPE]: formType || 'contact',
          [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
          [PROPERTIES.IS_INTERNAL]: false,
          [PROPERTIES.FIRST_VISIT]: !isReturning,
        },
      );
    },
    [checkInternalUser],
  );

  const identifyAnonymousVisitor = useCallback(() => {
    if (typeof window === 'undefined' || !posthog) {
      return;
    }

    posthog.setPersonProperties({
      [PROPERTIES.IS_INTERNAL]: false,
      visitor_type: 'anonymous',
      first_seen: new Date().toISOString(),
    });
  }, []);

  const resetUserIdentification = useCallback(() => {
    if (typeof window === 'undefined' || !posthog.__loaded) {
      return;
    }

    posthog.reset();
  }, []);

  return {
    identifyUser,
    identifyAnonymousVisitor,
    resetUserIdentification,
    checkInternalUser,
  };
}

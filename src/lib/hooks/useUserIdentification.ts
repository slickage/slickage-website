import { useCallback } from 'react';
import { usePostHog } from 'posthog-js/react';
import { EVENTS, PROPERTIES } from '@/app/providers';
import { hashEmail, createSafeDistinctId, extractEmailDomain } from '@/lib/utils/privacy';
import { addVersionMetadata } from '@/lib/utils/analytics-versioning';

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

const INTERNAL_DOMAINS = [
  'slickage.com',
  'slickage.io',
] as const;

const INTERNAL_IPS = [
  // Add your office/VPN IPs here when known
  // '192.168.1.1',
] as const;

/**
 * Hook for user identification and internal user filtering
 * Handles lead tracking and removes internal team data
 */
export function useUserIdentification() {
  const posthog = usePostHog();
  
  const checkInternalUser = useCallback((email: string, clientIp?: string): InternalUserCheck => {
    // Check email domain
    if (email) {
      const domain = extractEmailDomain(email);
      if (domain !== 'unknown' && INTERNAL_DOMAINS.includes(domain as any)) {
        return { isInternal: true, reason: 'internal_email_domain' };
      }
    }

    // Check IP address
    if (clientIp && INTERNAL_IPS.some(ip => ip === clientIp)) {
      return { isInternal: true, reason: 'internal_ip_address' };
    }

    return { isInternal: false };
  }, []);

  const identifyUser = useCallback(async (userData: UserIdentificationData) => {
    if (typeof window === 'undefined' || !posthog) {
      return;
    }

    const { email, company, leadSource, formType } = userData;
    
    // Check if this is an internal user
    const internalCheck = checkInternalUser(email);
    
    if (internalCheck.isInternal) {
      // Track internal user but don't identify - use anonymized data
      posthog.capture(EVENTS.INTERNAL_USER_DETECTED, addVersionMetadata({
        email_hash: hashEmail(email), // Use hashed email instead of plain text
        [PROPERTIES.IS_INTERNAL]: true,
        [PROPERTIES.ERROR_TYPE]: internalCheck.reason,
        [PROPERTIES.LEAD_SOURCE]: leadSource,
        [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
      }));
      
      // Set internal user property to filter in PostHog
      posthog.setPersonProperties({
        [PROPERTIES.IS_INTERNAL]: true,
        internal_detection_reason: internalCheck.reason,
      });
      
      return;
    }

    // Create privacy-safe distinct ID for lead
    const distinctId = createSafeDistinctId(email);
    
    // Get current user properties to check if returning visitor
    const currentDistinctId = posthog.get_distinct_id();
    const isReturning = currentDistinctId && currentDistinctId !== distinctId;
    
    if (isReturning) {
      posthog.capture(EVENTS.RETURNING_VISITOR, addVersionMetadata({
        email_hash: hashEmail(email), // Use hashed email
        [PROPERTIES.LEAD_SOURCE]: leadSource,
        [PROPERTIES.PREVIOUS_ID]: currentDistinctId,
        [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
      }));
    }

    // Identify the user with privacy-safe data
    posthog.identify(distinctId, {
      email_hash: hashEmail(email), // Store hashed email instead of plain text
      company: company || userData.company,
      lead_source: leadSource,
      first_contact_form: formType || 'contact',
      first_identified: new Date().toISOString(),
      [PROPERTIES.IS_INTERNAL]: false,
      [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
    });

    // Track identification event with anonymized data
    posthog.capture(EVENTS.LEAD_IDENTIFIED, addVersionMetadata({
      email_hash: hashEmail(email), // Use hashed email
      [PROPERTIES.LEAD_SOURCE]: leadSource,
      [PROPERTIES.FORM_TYPE]: formType || 'contact',
      [PROPERTIES.COMPANY_DOMAIN]: extractEmailDomain(email),
      [PROPERTIES.IS_INTERNAL]: false,
      [PROPERTIES.FIRST_VISIT]: !isReturning,
    }));

  }, [checkInternalUser]);

  const identifyAnonymousVisitor = useCallback(() => {
    if (typeof window === 'undefined' || !posthog) {
      return;
    }

    // Set properties for anonymous visitor tracking
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

    // Reset user identification (useful for testing or logout scenarios)
    posthog.reset();
  }, []);

  return {
    identifyUser,
    identifyAnonymousVisitor,
    resetUserIdentification,
    checkInternalUser,
  };
}

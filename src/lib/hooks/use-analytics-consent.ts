import { useCallback, useEffect, useState } from 'react';
import { usePostHog } from 'posthog-js/react';

type ConsentStatus = 'pending' | 'granted' | 'denied';

interface AnalyticsConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_STORAGE_KEY = 'posthog_analytics_consent';

/**
 * Hook for managing user analytics consent
 * Following GDPR and PostHog privacy best practices
 */
export function useAnalyticsConsent() {
  const posthog = usePostHog();
  const [consentStatus, setConsentStatus] = useState<ConsentStatus>('pending');
  const [consent, setConsent] = useState<AnalyticsConsent>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const savedConsent = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (savedConsent) {
      try {
        const parsed = JSON.parse(savedConsent);
        setConsent(parsed.consent);
        setConsentStatus(parsed.status);

        if (posthog && (parsed.status === 'denied' || !parsed.consent.analytics)) {
          posthog.opt_out_capturing();
        } else if (posthog && parsed.status === 'granted' && parsed.consent.analytics) {
          posthog.opt_in_capturing();
        }
      } catch (error) {
        console.warn('Failed to parse analytics consent from storage:', error);
      }
    }
  }, []);

  const grantConsent = useCallback(
    (consentSettings: Partial<AnalyticsConsent>) => {
      const newConsent = { ...consent, ...consentSettings };
      setConsent(newConsent);
      setConsentStatus('granted');

      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          consent: newConsent,
          status: 'granted',
          timestamp: new Date().toISOString(),
        }),
      );

      if (newConsent.analytics && posthog) {
        posthog.opt_in_capturing();

        posthog.capture('system:consent_grant', {
          consent_analytics: newConsent.analytics,
          consent_marketing: newConsent.marketing,
        });
      }
    },
    [consent],
  );

  const denyConsent = useCallback(() => {
    const deniedConsent = {
      essential: true,
      analytics: false,
      marketing: false,
    };

    setConsent(deniedConsent);
    setConsentStatus('denied');

    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        consent: deniedConsent,
        status: 'denied',
        timestamp: new Date().toISOString(),
      }),
    );

    if (posthog) {
      posthog.opt_out_capturing();
    }
  }, []);

  const resetConsent = useCallback(() => {
    setConsentStatus('pending');
    setConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });

    localStorage.removeItem(CONSENT_STORAGE_KEY);
    if (posthog) {
      posthog.opt_out_capturing();
    }
  }, []);

  const updateConsent = useCallback(
    (updates: Partial<AnalyticsConsent>) => {
      const newConsent = { ...consent, ...updates };
      setConsent(newConsent);

      localStorage.setItem(
        CONSENT_STORAGE_KEY,
        JSON.stringify({
          consent: newConsent,
          status: consentStatus,
          timestamp: new Date().toISOString(),
        }),
      );

      if (posthog) {
        if (newConsent.analytics && consentStatus === 'granted') {
          posthog.opt_in_capturing();
        } else {
          posthog.opt_out_capturing();
        }
      }
    },
    [consent, consentStatus],
  );

  return {
    consentStatus,
    consent,
    hasAnalyticsConsent: consent.analytics && consentStatus === 'granted',
    hasMarketingConsent: consent.marketing && consentStatus === 'granted',
    grantConsent,
    denyConsent,
    resetConsent,
    updateConsent,
  };
}

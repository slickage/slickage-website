import { useCallback, useEffect, useState } from 'react';
import { usePostHog } from 'posthog-js/react';

type ConsentStatus = 'pending' | 'granted' | 'denied';

interface AnalyticsConsent {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CONSENT_STORAGE_KEY = 'posthog_analytics_consent';

function saveConsentToStorage(consent: AnalyticsConsent, status: ConsentStatus): void {
  try {
    localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify({
      consent,
      status,
      timestamp: new Date().toISOString(),
    }));
  } catch (error) {
    console.warn('Failed to save analytics consent to storage:', error);
  }
}

function loadConsentFromStorage() {
  try {
    const saved = localStorage.getItem(CONSENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    console.warn('Failed to parse analytics consent from storage:', error);
    return null;
  }
}

function handlePostHogConsent(posthog: any, hasAnalytics: boolean): void {
  if (!posthog) return;
  posthog[hasAnalytics ? 'opt_in_capturing' : 'opt_out_capturing']();
}

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
    const savedConsent = loadConsentFromStorage();

    if (savedConsent) {
      setConsent(savedConsent.consent);
      setConsentStatus(savedConsent.status);

      const hasAnalytics = savedConsent.status === 'granted' && savedConsent.consent.analytics;
      handlePostHogConsent(posthog, hasAnalytics);
    }
  }, [posthog]);

  const grantConsent = useCallback(
    (consentSettings: Partial<AnalyticsConsent>) => {
      const newConsent = { ...consent, ...consentSettings };
      setConsent(newConsent);
      setConsentStatus('granted');

      saveConsentToStorage(newConsent, 'granted');

      if (newConsent.analytics && posthog) {
        posthog.opt_in_capturing();

        posthog.capture('system:consent_grant', {
          consent_analytics: newConsent.analytics,
          consent_marketing: newConsent.marketing,
        });
      }
    },
    [consent, posthog],
  );

  const denyConsent = useCallback(() => {
    const deniedConsent = {
      essential: true,
      analytics: false,
      marketing: false,
    };

    setConsent(deniedConsent);
    setConsentStatus('denied');

    saveConsentToStorage(deniedConsent, 'denied');
    handlePostHogConsent(posthog, false);
  }, [posthog]);

  const resetConsent = useCallback(() => {
    setConsentStatus('pending');
    setConsent({
      essential: true,
      analytics: false,
      marketing: false,
    });

    localStorage.removeItem(CONSENT_STORAGE_KEY);
    handlePostHogConsent(posthog, false);
  }, [posthog]);

  const updateConsent = useCallback(
    (updates: Partial<AnalyticsConsent>) => {
      const newConsent = { ...consent, ...updates };
      setConsent(newConsent);

      saveConsentToStorage(newConsent, consentStatus);

      const hasAnalytics = newConsent.analytics && consentStatus === 'granted';
      handlePostHogConsent(posthog, hasAnalytics);
    },
    [consent, consentStatus, posthog],
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

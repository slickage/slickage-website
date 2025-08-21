'use client';

import { useEffect } from 'react';
import { m } from 'motion/react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';
import { useAnalyticsConsent } from '@/lib/hooks/use-analytics-consent';
import { Button } from '@/components/ui/button';

/**
 * GDPR-compliant analytics consent banner
 * Integrates with useAnalyticsConsent hook and PostHog
 */
export function AnalyticsConsentBanner() {
  const { consentStatus, grantConsent, denyConsent } = useAnalyticsConsent();

  const slideUpVariants = useMotionVariant('slideUp');
  const slideUpTransition = useMotionTransition('contentEntrance');

  useEffect(() => {
    if (consentStatus === 'pending') {
      document.body.classList.add('pb-24');
    } else {
      document.body.classList.remove('pb-24');
    }

    return () => {
      document.body.classList.remove('pb-24');
    };
  }, [consentStatus]);

  if (consentStatus !== 'pending') {
    return null;
  }

  const handleAcceptAll = () => {
    grantConsent({
      analytics: true,
      marketing: false,
    });
  };

  const handleEssentialOnly = () => {
    denyConsent();
  };

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-gray-900/95 backdrop-blur-sm border-t border-gray-700"
      style={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50 }}
    >
      <m.div
        variants={slideUpVariants}
        initial="hidden"
        animate="visible"
        transition={slideUpTransition}
        className="container mx-auto px-4 py-4"
      >
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex-1">
            <h3 className="text-white font-semibold mb-2">Analytics & Privacy</h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              We use analytics to improve our website and understand how visitors interact with our
              content. Your data is anonymized and we respect your privacy. You can change your
              preferences at any time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:ml-6">
            <Button
              variant="outline"
              size="sm"
              onClick={handleEssentialOnly}
              className="text-gray-300 border-gray-600 hover:bg-gray-800"
            >
              Essential Only
            </Button>
            <Button variant="blue" size="sm" onClick={handleAcceptAll} className="shadow-lg">
              Accept Analytics
            </Button>
          </div>
        </div>
      </m.div>
    </div>
  );
}

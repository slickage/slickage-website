import { useState, useEffect, type RefObject } from 'react';
import { useClientConfig } from './use-client-config';
import { logger } from '@/lib/utils/logger';

type RecaptchaLoadStrategy = 'immediate' | 'in-viewport' | 'interaction';

interface UseRecaptchaOptions {
  strategy?: RecaptchaLoadStrategy;
  // Allow null to match common React refs like useRef<HTMLDivElement | null>(null)
  triggerRef?: RefObject<Element | null>;
}

export function useRecaptcha(options?: UseRecaptchaOptions) {
  const { config, error: configError } = useClientConfig('recaptcha');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recaptchaConfig = config?.recaptcha;

  useEffect(() => {
    if (!recaptchaConfig?.enabled || !recaptchaConfig?.siteKey) {
      return;
    }

    const loadRecaptcha = () => {
      if (isLoaded) return; // prevent duplicate loads
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaConfig.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            setIsLoaded(true);
          });
        } else {
          setError('reCAPTCHA object not available');
        }
      };

      script.onerror = (error) => {
        logger.error('useRecaptcha: Failed to load reCAPTCHA script:', error);
        setError('Failed to load reCAPTCHA');
      };

      document.head.appendChild(script);
    };

    const strategy: RecaptchaLoadStrategy = options?.strategy || 'immediate';

    let cleanup: (() => void) | undefined;

    if (strategy === 'in-viewport' && options?.triggerRef?.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              loadRecaptcha();
              observer.disconnect();
              break;
            }
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(options.triggerRef.current);
      cleanup = () => observer.disconnect();
    } else {
      // immediate load
      const timeoutId = setTimeout(loadRecaptcha, 0);
      cleanup = () => clearTimeout(timeoutId);
    }

    return () => {
      try {
        cleanup && cleanup();
      } finally {
        const scripts = document.querySelectorAll('script[src*="recaptcha"]');
        scripts.forEach((script) => script.remove());
      }
    };
  }, [recaptchaConfig, options?.strategy, options?.triggerRef?.current, isLoaded]);

  const siteKey = recaptchaConfig?.siteKey || '';
  const isEnabled = recaptchaConfig?.enabled || false;

  return {
    siteKey,
    isEnabled,
    isLoaded,
    error: error || configError,
  };
}

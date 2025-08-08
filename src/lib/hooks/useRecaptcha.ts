import { useState, useEffect } from 'react';
import { useClientConfig } from './useClientConfig';

export function useRecaptcha() {
  const { config, error: configError } = useClientConfig('recaptcha');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!config?.enabled || !config?.siteKey) {
      return;
    }

    const currentScrollY = window.scrollY;

    const loadRecaptcha = () => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${config.siteKey}`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        if (window.grecaptcha) {
          window.grecaptcha.ready(() => {
            window.scrollTo(0, currentScrollY);
            setIsLoaded(true);
          });
        } else {
          setError('reCAPTCHA object not available');
        }
      };

      script.onerror = (error) => {
        console.error('useRecaptcha: Failed to load reCAPTCHA script:', error);
        setError('Failed to load reCAPTCHA');
      };

      document.head.appendChild(script);
    };

    const timeoutId = setTimeout(loadRecaptcha, 100);

    return () => {
      clearTimeout(timeoutId);
      const scripts = document.querySelectorAll('script[src*="recaptcha"]');
      scripts.forEach((script) => script.remove());
    };
  }, [config]);

  const siteKey = config?.siteKey || '';
  const isEnabled = config?.enabled || false;

  return {
    siteKey,
    isEnabled,
    isLoaded,
    error: error || configError,
  };
}

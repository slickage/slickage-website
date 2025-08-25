import { useState, useEffect, type RefObject } from 'react';
import { useClientConfig } from './use-client-config';
import { logger } from '@/lib/utils/logger';

type RecaptchaLoadStrategy = 'immediate' | 'in-viewport' | 'interaction';

interface UseRecaptchaOptions {
  strategy?: RecaptchaLoadStrategy;
  triggerRef?: RefObject<Element | null>;
}

const INTERSECTION_THRESHOLD = 0.1;
const IMMEDIATE_LOAD_DELAY = 0;

export function useRecaptcha(options?: UseRecaptchaOptions) {
  const { config, error: configError } = useClientConfig('recaptcha');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recaptchaConfig = config?.recaptcha;

  useEffect(() => {
    if (!shouldLoadRecaptcha(recaptchaConfig)) {
      return;
    }

    const strategy = options?.strategy || 'immediate';
    const cleanup = setupLoadingStrategy(strategy, options?.triggerRef);

    return () => {
      cleanup?.();
      cleanupScripts();
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

  function shouldLoadRecaptcha(config: any): boolean {
    return config?.enabled && config?.siteKey;
  }

  function setupLoadingStrategy(
    strategy: RecaptchaLoadStrategy,
    triggerRef?: RefObject<Element | null>,
  ) {
    switch (strategy) {
      case 'in-viewport':
        return triggerRef?.current ? setupInViewportLoading(triggerRef.current) : undefined;
      case 'immediate':
      default:
        return setupImmediateLoading();
    }
  }

  function setupImmediateLoading() {
    const timeoutId = setTimeout(loadRecaptchaScript, IMMEDIATE_LOAD_DELAY);
    return () => clearTimeout(timeoutId);
  }

  function setupInViewportLoading(element: Element) {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            loadRecaptchaScript();
            observer.disconnect();
            break;
          }
        }
      },
      { threshold: INTERSECTION_THRESHOLD },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }

  function loadRecaptchaScript() {
    if (isLoaded) return;

    const script = createRecaptchaScript();
    script.onload = handleScriptLoad;
    script.onerror = handleScriptError;
    document.head.appendChild(script);
  }

  function createRecaptchaScript(): HTMLScriptElement {
    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${recaptchaConfig!.siteKey}`;
    script.async = true;
    script.defer = true;
    return script;
  }

  function handleScriptLoad() {
    if (window.grecaptcha) {
      window.grecaptcha.ready(() => setIsLoaded(true));
    } else {
      setError('reCAPTCHA object not available');
    }
  }

  function handleScriptError(error: any) {
    logger.error('useRecaptcha: Failed to load reCAPTCHA script:', error);
    setError('Failed to load reCAPTCHA');
  }

  function cleanupScripts() {
    const scripts = document.querySelectorAll('script[src*="recaptcha"]');
    scripts.forEach((script) => script.remove());
  }
}

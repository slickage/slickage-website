'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { useRecaptcha } from '@/features/recaptcha/hooks/use-recaptcha';
import { FORM_CONSTANTS } from '@/features/contact/components/config/contact-form-field-config';

interface RecaptchaConfig {
  siteKey: string;
  enabled: boolean;
}

interface RecaptchaWrapperProps {
  config: RecaptchaConfig;
  children: (props: { recaptchaLoaded: boolean }) => ReactNode;
}

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

/**
 * Client component wrapper for reCAPTCHA integration
 * Handles reCAPTCHA token generation and form submission
 */
export function RecaptchaWrapper({ config, children }: RecaptchaWrapperProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const {
    siteKey,
    isEnabled: isRecaptchaEnabled,
    isLoaded: recaptchaLoaded,
  } = useRecaptcha(config, {
    strategy: 'immediate',
  });

  useEffect(() => {
    if (!wrapperRef.current) return;

    const form = wrapperRef.current.querySelector('form');
    if (!form) return;

    const handleSubmit = async (e: SubmitEvent) => {
      if (!isRecaptchaEnabled || !recaptchaLoaded || !window.grecaptcha || !siteKey) {
        e.preventDefault();
        return;
      }

      e.preventDefault();

      try {
        const token = await window.grecaptcha.execute(siteKey, {
          action: FORM_CONSTANTS.RECAPTCHA.ACTION,
        });

        const formData = new FormData(form);
        formData.set('recaptchaToken', token);

        let tokenInput = form.querySelector('input[name="recaptchaToken"]') as HTMLInputElement;
        if (!tokenInput) {
          tokenInput = document.createElement('input');
          tokenInput.type = 'hidden';
          tokenInput.name = 'recaptchaToken';
          form.appendChild(tokenInput);
        }
        tokenInput.value = token;

        form.requestSubmit();
      } catch (error) {
        console.warn('reCAPTCHA execution failed:', error);
        form.requestSubmit();
      }
    };

    form.addEventListener('submit', handleSubmit);

    return () => {
      form.removeEventListener('submit', handleSubmit);
    };
  }, [isRecaptchaEnabled, recaptchaLoaded, siteKey]);

  return (
    <div ref={wrapperRef}>
      {children({ recaptchaLoaded })}
      {isRecaptchaEnabled && (
        <p className="mt-3 text-xs text-gray-500 text-center">
          This site is protected by reCAPTCHA and the Google{' '}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Privacy Policy
          </a>{' '}
          and{' '}
          <a
            href="https://policies.google.com/terms"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 underline"
          >
            Terms of Service
          </a>{' '}
          apply.
        </p>
      )}
    </div>
  );
}

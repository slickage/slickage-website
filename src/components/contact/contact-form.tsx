'use client';

import { useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FormFields } from '@/components/contact/contact-form-fields';

import type { ContactFormData } from '@/components/contact/config/contact-form-field-config';
import { FORM_CONSTANTS } from '@/components/contact/config/contact-form-field-config';
import { ContactSuccess } from '@/components/contact/contact-success';
import { useContactForm } from '@/lib/hooks/use-contact-form';

interface ContactFormProps {
  standalone?: boolean;
}

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

export function ContactForm({ standalone = false }: ContactFormProps) {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  const {
    formData,
    formStatus,
    errors,
    isSubmitting,
    updateFormStatus,
    updateErrors,
    updateFormData,
    clearFieldError,
    submitForm,
    isRecaptchaEnabled,
    recaptchaLoaded,
  } = useContactForm({ standalone, triggerRef: sectionRef });
  const { trackFormInteraction } = useEventTracking();

  useEffect(() => {
    trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'viewed');
  }, [trackFormInteraction, standalone]);

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');
    const { AREA_CODE_LENGTH, PREFIX_LENGTH, LINE_NUMBER_LENGTH } = FORM_CONSTANTS.PHONE;

    if (digits.length <= AREA_CODE_LENGTH) {
      return digits;
    } else if (digits.length <= PREFIX_LENGTH) {
      return `(${digits.slice(0, AREA_CODE_LENGTH)}) ${digits.slice(AREA_CODE_LENGTH)}`;
    } else if (digits.length <= LINE_NUMBER_LENGTH) {
      return `(${digits.slice(0, AREA_CODE_LENGTH)}) ${digits.slice(AREA_CODE_LENGTH, PREFIX_LENGTH)}-${digits.slice(PREFIX_LENGTH)}`;
    } else {
      return `(${digits.slice(0, AREA_CODE_LENGTH)}) ${digits.slice(AREA_CODE_LENGTH, PREFIX_LENGTH)}-${digits.slice(PREFIX_LENGTH, LINE_NUMBER_LENGTH)}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (!formStatus.hasStartedTyping && value.trim().length > 0) {
      updateFormStatus({ hasStartedTyping: true });
      trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'started', { field: name });
    }

    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      updateFormData(name as keyof ContactFormData, formattedPhone);
    } else {
      updateFormData(name as keyof ContactFormData, value);
    }

    if (errors.fields[name]) {
      clearFieldError(name);
    }

    if (errors.general) {
      updateErrors({ general: null });
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await submitForm();
  };

  if (formStatus.isSubmitted) {
    return <ContactSuccess onReset={() => updateFormStatus({ isSubmitted: false })} />;
  }

  return (
    <div
      ref={sectionRef}
      className={
        standalone
          ? 'bg-white/5 backdrop-blur-sm shadow-xl rounded-xl border border-gray-800 p-8 hover:border-blue-500/50 transition-all duration-300'
          : ''
      }
    >
      {errors.general && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div
          style={{
            position: 'absolute',
            left: '-9999px',
            width: '1px',
            height: '1px',
            overflow: 'hidden',
          }}
        >
          <label htmlFor="website">Website</label>
          <Input
            type="text"
            id="website"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={formData.website}
            onChange={handleChange}
          />
        </div>

        <FormFields formData={formData} errors={errors.fields} onChange={handleChange} />

        <Button
          type="submit"
          variant="default"
          size="lg"
          className="w-full group"
          disabled={isSubmitting || !recaptchaLoaded}
        >
          {isSubmitting ? (
            'Sending...'
          ) : !recaptchaLoaded ? (
            'Loading security check...'
          ) : (
            <>
              Send Message
              <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>

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
      </form>
    </div>
  );
}

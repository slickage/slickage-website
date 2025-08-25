import { useState, useCallback } from 'react';
import { useRecaptcha } from '@/lib/hooks/use-recaptcha';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';
import { useUserIdentification } from '@/lib/hooks/use-user-identification';
import { logger } from '@/lib/utils/logger';
import { FORM_CONSTANTS } from '@/components/contact/config/contact-form-field-config';
import type { ContactFormData } from '@/components/contact/config/contact-form-field-config';
import type { ContactFormErrorResponse, ContactFormSuccessResponse } from '@/lib/types/contact-api';

interface FormStatus {
  startTime: number;
  hasStartedTyping: boolean;
  isSubmitted: boolean;
}

interface FormErrors {
  general: string | null;
  fields: Record<string, string>;
}

interface UseContactFormProps {
  standalone: boolean;
  triggerRef?: React.RefObject<HTMLElement | null>;
}

export function useContactForm({ standalone, triggerRef }: UseContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  });

  const [formStatus, setFormStatus] = useState<FormStatus>({
    startTime: Date.now(),
    hasStartedTyping: false,
    isSubmitted: false,
  });

  const [errors, setErrors] = useState<FormErrors>({
    general: null,
    fields: {},
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    siteKey,
    isEnabled: isRecaptchaEnabled,
    isLoaded: recaptchaLoaded,
  } = useRecaptcha({
    strategy: 'in-viewport',
    triggerRef,
  });

  const { trackFormInteraction } = useEventTracking();
  const { identifyUser } = useUserIdentification();

  const updateFormStatus = useCallback((updates: Partial<FormStatus>) => {
    setFormStatus((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateErrors = useCallback((updates: Partial<FormErrors>) => {
    setErrors((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateFormData = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({ name: '', email: '', phone: '', subject: '', message: '', website: '' });
    updateFormStatus({ startTime: Date.now(), hasStartedTyping: false });
    updateErrors({ general: null, fields: {} });
  }, [updateFormStatus, updateErrors]);

  const clearFieldError = useCallback((field: string) => {
    setErrors((prev) => ({
      ...prev,
      fields: { ...prev.fields, [field]: '' },
    }));
  }, []);

  const getRecaptchaToken = useCallback(async (): Promise<string> => {
    if (isRecaptchaEnabled && siteKey && window.grecaptcha && recaptchaLoaded) {
      try {
        return await window.grecaptcha.execute(siteKey, {
          action: FORM_CONSTANTS.RECAPTCHA.ACTION,
        });
      } catch (recaptchaError) {
        logger.warn('reCAPTCHA execution failed:', recaptchaError);
      }
    }
    return '';
  }, [isRecaptchaEnabled, siteKey, recaptchaLoaded]);

  const submitForm = useCallback(async () => {
    setIsSubmitting(true);
    updateErrors({ general: null });

    try {
      const recaptchaToken = await getRecaptchaToken();
      const startTime = Date.now();

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          elapsed: 0,
          recaptchaToken,
        }),
      });

      if (response.ok) {
        await handleSubmissionSuccess(response, startTime);
        updateFormStatus({ isSubmitted: true });
      } else {
        const errorData: ContactFormErrorResponse = await response.json();
        handleSubmissionError(errorData);
      }
    } catch (err) {
      handleNetworkError(err);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, getRecaptchaToken, updateFormStatus, updateErrors]);

  const handleSubmissionSuccess = useCallback(
    async (response: Response, startTime: number) => {
      try {
        const successData: ContactFormSuccessResponse = await response.json();
        const extractedSubmissionId = successData.data?.submissionId;
        const elapsed = Date.now() - startTime;

        if (extractedSubmissionId) {
          logger.info(`Contact form submitted successfully: ID ${extractedSubmissionId}`);
        } else {
          logger.warn('Contact form submitted but no submissionId received');
        }

        trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'submitted', {
          completionTime: elapsed,
          ...(extractedSubmissionId && { submissionId: extractedSubmissionId }),
        });

        await identifyUser({
          email: formData.email,
          company: formData.subject,
          leadSource: standalone ? 'contact_page' : 'homepage_contact_form',
          formType: 'contact',
        });
      } catch (parseError) {
        logger.error('Failed to parse success response:', parseError);
      }
    },
    [formData, standalone, trackFormInteraction, identifyUser],
  );

  const handleSubmissionError = useCallback(
    (errorData: ContactFormErrorResponse) => {
      if (errorData.details && Array.isArray(errorData.details)) {
        const fieldErrors = errorData.details.reduce(
          (acc, detail) => ({
            ...acc,
            [detail.field]: detail.message,
          }),
          {},
        );
        updateErrors({ fields: fieldErrors });
      } else {
        updateErrors({ general: errorData.error || 'Submission failed' });
      }
    },
    [updateErrors],
  );

  const handleNetworkError = useCallback(
    (err: unknown) => {
      logger.error('Form submission error:', err);
      const networkError = 'Network error. Please check your connection and try again.';
      updateErrors({ general: networkError });
    },
    [updateErrors],
  );

  return {
    formData,
    formStatus,
    errors,
    isSubmitting,

    updateFormStatus,
    updateErrors,
    updateFormData,
    resetForm,
    clearFieldError,
    submitForm,

    isRecaptchaEnabled,
    recaptchaLoaded,
  };
}

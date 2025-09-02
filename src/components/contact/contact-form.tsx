'use client';

import { useActionState, useRef, startTransition, useEffect, useCallback } from 'react';
import { useFormStatus } from 'react-dom';
import Form from 'next/form';
import { Send } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FormFields } from '@/components/contact/contact-form-fields';
import { RecaptchaWrapper } from '@/components/contact/recaptcha-wrapper';
import { ContactSuccess } from '@/components/contact/contact-success';

import { submitContactFormAction } from '@/app/actions/contact';
import { initialContactFormState, type ContactFormState } from '@/lib/types/contact-form-state';
import { useEventTracking } from '@/lib/hooks/use-posthog-tracking';
import { useUserIdentification } from '@/lib/hooks/use-user-identification';

interface ContactFormProps {
  standalone?: boolean;
}

/**
 * Client component for the contact form
 * Uses useActionState for form state management and server actions
 * Implements form value persistence, proper state management, and PostHog analytics
 */
export function ContactForm({ standalone = false }: ContactFormProps) {
  const [state, formAction, isPending] = useActionState<ContactFormState, FormData>(
    submitContactFormAction,
    initialContactFormState
  );
  const isLoading = useFormStatus().pending || isPending;

  const { trackFormInteraction } = useEventTracking();
  const { identifyUser } = useUserIdentification();

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'viewed');
  }, [trackFormInteraction, standalone]);

  useEffect(() => {
    if (state.success && state.values) {
      const { email, subject } = state.values;
      
      trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'submitted', {
        ...(state.submissionId && { submissionId: state.submissionId }),
      });

      if (email) {
        identifyUser({
          email,
          company: subject || '',
          leadSource: standalone ? 'contact_page' : 'homepage_contact_form',
          formType: 'contact',
        });
      }
    }
  }, [state.success, state.values, state.submissionId, trackFormInteraction, identifyUser, standalone]);

  const handleFormReset = useCallback(() => {
    if (formRef.current) {
      formRef.current.reset();
    }
    startTransition(() => {
      const resetFormData = new FormData();
      resetFormData.set('reset', 'true');
      formAction(resetFormData);
    });
  }, [formAction]);

  if (state.success) {
    return (
      <div className="animate-in fade-in-0 slide-in-from-bottom-4 duration-500">
        <ContactSuccess onReset={handleFormReset} />
      </div>
    );
  }

  return (
    <div
      className={
        standalone
          ? 'bg-white/5 backdrop-blur-sm shadow-xl rounded-xl border border-gray-800 p-8 hover:border-blue-500/50 transition-all duration-300'
          : ''
      }
    >
      {state.message && !state.success && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm" aria-live="polite" role="alert">
            {state.message}
          </p>
        </div>
      )}

      <Form action={formAction} ref={formRef}>
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
            defaultValue=""
          />
        </div>

        <FormFields 
          errors={state.errors} 
          values={state.values}
        />

        <RecaptchaWrapper>
          {({ recaptchaLoaded }) => (
            <Button
              type="submit"
              variant="default"
              size="lg"
              className="w-full group"
              disabled={isLoading || !recaptchaLoaded}
            >
              {isLoading ? (
                <>
                  Sending...
                  <div className="ml-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                </>
              )
              : (
                <>
                  Send Message
                  <Send className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          )}
        </RecaptchaWrapper>
      </Form>
    </div>
  );
}


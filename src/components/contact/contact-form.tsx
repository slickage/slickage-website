'use client';

import { useState, useRef, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { Send } from 'lucide-react';
import { useRecaptcha } from '@/lib/hooks/use-recaptcha';
import { useEventTracking } from '@/lib/hooks/use-event-tracking';
import { useUserIdentification } from '@/lib/hooks/use-user-identification';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { logger } from '@/lib/utils/logger';

declare global {
  interface Window {
    grecaptcha: {
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      ready: (callback: () => void) => void;
    };
  }
}

interface ValidationError {
  field: string;
  message: string;
}

interface ApiError {
  error: string;
  details?: ValidationError[];
  retryAfter?: number;
}

interface ContactFormProps {
  standalone?: boolean;
}

export function ContactForm({ standalone = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  });
  const [startTime, setStartTime] = useState(Date.now());
  const [hasStartedTyping, setHasStartedTyping] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const {
    siteKey,
    isEnabled,
    isLoaded: recaptchaLoaded,
  } = useRecaptcha({
    strategy: 'in-viewport',
    triggerRef: sectionRef,
  });

  const { trackFormInteraction } = useEventTracking();
  const { identifyUser } = useUserIdentification();

  useEffect(() => {
    trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'viewed');
  }, [trackFormInteraction, standalone]);

  const formatPhoneNumber = (value: string): string => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
    } else if (digits.length <= 10) {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
    } else {
      return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 10)}`;
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (!hasStartedTyping && value.trim().length > 0) {
      setHasStartedTyping(true);
      trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'started', { field: name });
    }

    if (name === 'phone') {
      const formattedPhone = formatPhoneNumber(value);
      setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }

    if (error) {
      setError(null);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setFieldErrors({});

    const elapsed = Date.now() - startTime;

    try {
      let recaptchaToken = '';

      if (isEnabled && siteKey && window.grecaptcha && recaptchaLoaded) {
        try {
          recaptchaToken = await window.grecaptcha.execute(siteKey, { action: 'contact_form' });
        } catch (recaptchaError) {
          logger.warn('reCAPTCHA execution failed:', recaptchaError);
        }
      }

      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          elapsed,
          recaptchaToken,
        }),
      });

      const data: ApiError | { message: string; submissionId: string } = await res.json();

      if (res.ok) {
        await identifyUser({
          email: formData.email,
          company: formData.subject,
          leadSource: standalone ? 'contact_page' : 'homepage_contact_form',
          formType: 'contact',
        });

        trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'submitted', {
          completionTime: elapsed,
        });

        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
          website: '',
        });
        setStartTime(Date.now());
        setHasStartedTyping(false);
      } else {
        const errorData = data as ApiError;

        if (errorData.details && Array.isArray(errorData.details)) {
          const newFieldErrors: Record<string, string> = {};
          errorData.details.forEach((detail) => {
            newFieldErrors[detail.field] = detail.message;
          });
          setFieldErrors(newFieldErrors);
        } else {
          let errorMessage = errorData.error || 'An error occurred while submitting the form.';

          if (
            res.status === 429 &&
            errorData.retryAfter &&
            !errorMessage.includes('try again in')
          ) {
            errorMessage += ` Please try again in ${errorData.retryAfter} minutes.`;
          }

          trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'error', {
            error: errorMessage,
          });

          setError(errorMessage);
        }
      }
    } catch (err) {
      logger.error('Form submission error:', err);
      const networkError = 'Network error. Please check your connection and try again.';

      trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'error', {
        error: networkError,
      });

      setError(networkError);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm rounded-xl border border-green-500/20 p-8 text-center">
        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-green-500/30">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-8 w-8 text-green-400"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-white mb-3 gradient-text">
          Message Sent Successfully!
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Thank you for reaching out. We'll get back to you as soon as possible.
        </p>
        <Button onClick={() => setIsSubmitted(false)} variant="blue" size="lg">
          Send Another Message
        </Button>
      </div>
    );
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
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
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

        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="name"
            name="name"
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
            required
            error={!!fieldErrors.name}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          />
          {fieldErrors.name && <p className="mt-1 text-sm text-red-400">{fieldErrors.name}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email <span className="text-red-400">*</span>
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              required
              error={!!fieldErrors.email}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            />
            {fieldErrors.email && <p className="mt-1 text-sm text-red-400">{fieldErrors.email}</p>}
          </div>
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-1">
              Phone Number <span className="text-gray-500 text-xs">(optional)</span>
            </label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={handleChange}
              maxLength={14}
              autoComplete="tel"
              error={!!fieldErrors.phone}
              className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
            />
            {fieldErrors.phone && <p className="mt-1 text-sm text-red-400">{fieldErrors.phone}</p>}
          </div>
        </div>

        <div className="mb-4">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1">
            Company or Project Name <span className="text-red-400">*</span>
          </label>
          <Input
            id="subject"
            name="subject"
            placeholder="Your Company or Project Name"
            value={formData.subject}
            onChange={handleChange}
            required
            error={!!fieldErrors.subject}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          />
          {fieldErrors.subject && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.subject}</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
            How can we help you? <span className="text-red-400">*</span>
          </label>
          <Textarea
            id="message"
            name="message"
            placeholder="Please describe your company, project or what you need help with. (Maximum 2 links allowed)"
            value={formData.message}
            onChange={handleChange}
            required
            error={!!fieldErrors.message}
            className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400 min-h-[150px]"
          />
          {fieldErrors.message && (
            <p className="mt-1 text-sm text-red-400">{fieldErrors.message}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">{formData.message.length}/5000 characters</p>
        </div>

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

        {isEnabled && (
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

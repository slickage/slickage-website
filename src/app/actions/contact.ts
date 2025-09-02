'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { secureContactSchema } from '@/lib/validation/contact-schema';
import { submitContactForm } from '@/lib/services/contact-service';
import { verifyRecaptcha, validateRecaptchaScore } from '@/lib/security/recaptcha';
import { logger } from '@/lib/utils/logger';
import type { ContactFormData } from '@/lib/validation/contact-schema';
import { initialContactFormState, type ContactFormState } from '@/lib/types/contact-form-state';

/**
 * Extract client IP address from headers (for server actions)
 */
function getClientIpFromHeaders(headersList: Headers): string {
  const forwarded = headersList.get('x-forwarded-for');
  const realIp = headersList.get('x-real-ip');
  const remoteAddr = headersList.get('remote-addr');

  if (forwarded) {
    const firstIp = forwarded.split(',')[0];
    return firstIp ? firstIp.trim() : 'unknown';
  }
  if (realIp) {
    return realIp.trim();
  }
  if (remoteAddr) {
    return remoteAddr.trim();
  }
  return 'unknown';
}

/**
 * Server action for resetting contact form state
 * Returns initial state to reset the form
 */
export async function resetContactFormAction(
  _prevState: ContactFormState,
  _formData: FormData,
): Promise<ContactFormState> {
  return initialContactFormState;
}

/**
 * Server action for contact form submission
 * Handles FormData parsing, validation, and submission processing
 */
export async function submitContactFormAction(
  _prevState: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  // Check if this is a reset request (empty form data with reset flag)
  const isResetRequest = formData.get('reset') === 'true' || 
    (formData.get('name') === '' && formData.get('email') === '' && formData.get('message') === '');
  
  if (isResetRequest) {
    return initialContactFormState;
  }

  const startTime = Date.now();

  try {
    // 1. Parse FormData to ContactFormData structure
    const parsedData = parseFormData(formData);
    
    // 2. Validate form data using existing schema
    const validationResult = await validateFormData(parsedData);
    if (!validationResult.success) {
      return {
        success: false,
        message: validationResult.message,
        errors: validationResult.errors,
        values: parsedData, // Persist form values on validation errors
      };
    }

    // 3. Process submission using existing contact service
    const submissionResult = await processContactSubmission(validationResult.data!, startTime);
    
    if (submissionResult.success) {
      return {
        success: true,
        message: 'Form submitted successfully! We\'ll get back to you soon.',
        submissionId: submissionResult.submissionId,
        values: parsedData, // Include values for potential form reset
      };
    } else {
      return {
        success: false,
        message: submissionResult.message || 'Submission failed. Please try again.',
        errors: submissionResult.errors,
        values: parsedData, // Persist form values on submission errors
      };
    }
  } catch (error) {
    logger.error('Contact form server action error:', error);
    return {
      success: false,
      message: 'An unexpected error occurred. Please try again later.',
      values: parseFormData(formData), // Persist form values even on unexpected errors
    };
  }
}

/**
 * Parse FormData object to ContactFormData structure
 */
function parseFormData(formData: FormData): Partial<ContactFormData> {
  return {
    name: formData.get('name') as string || '',
    email: formData.get('email') as string || '',
    phone: formData.get('phone') as string || '',
    subject: formData.get('subject') as string || '',
    message: formData.get('message') as string || '',
    website: formData.get('website') as string || '', // honeypot field
    elapsed: 0, // Will be calculated client-side if needed
    recaptchaToken: formData.get('recaptchaToken') as string || '',
  };
}

/**
 * Validate form data using existing validation logic
 */
async function validateFormData(
  data: Partial<ContactFormData>,
): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  data?: ContactFormData & { clientIp: string };
}> {
  try {
    // Validate using existing schema
    const validatedData = secureContactSchema.parse(data);

    // Get client IP for rate limiting and analytics
    const headersList = await headers();
    const clientIp = getClientIpFromHeaders(headersList);

    // Validate reCAPTCHA if token is provided
    if (validatedData.recaptchaToken) {
      const recaptchaResult = await validateRecaptcha(validatedData.recaptchaToken, clientIp);
      if (!recaptchaResult.isValid) {
        return {
          success: false,
          message: recaptchaResult.error || 'Security verification failed. Please try again.',
        };
      }
    }

    return {
      success: true,
      data: { ...validatedData, clientIp },
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldErrors = error.issues.reduce(
        (acc, issue) => ({
          ...acc,
          [issue.path[0] as string]: issue.message,
        }),
        {} as Record<string, string>,
      );

      return {
        success: false,
        message: 'Please correct the errors below and try again.',
        errors: fieldErrors,
      };
    }

    logger.error('Form validation error:', error);
    return {
      success: false,
      message: 'Validation failed. Please try again.',
    };
  }
}

/**
 * Validate reCAPTCHA token
 */
async function validateRecaptcha(
  token: string,
  clientIp: string,
): Promise<{ isValid: boolean; error?: string }> {
  try {
    const result = await verifyRecaptcha(token);
    if (!result.success) {
      logger.security(`reCAPTCHA failed: IP ${clientIp}, error: ${result.error}`);
      return { isValid: false, error: 'Security verification failed. Please try again.' };
    }

    if (!validateRecaptchaScore(result.score)) {
      logger.security(`reCAPTCHA low score: IP ${clientIp}, score: ${result.score}`);
      return { isValid: false, error: 'Security validation failed. Please try again.' };
    }

    logger.debug(`reCAPTCHA passed: IP ${clientIp}, score: ${result.score}`);
    return { isValid: true };
  } catch (error) {
    logger.error('reCAPTCHA validation error:', error);
    return { isValid: false, error: 'Security verification failed. Please try again.' };
  }
}

/**
 * Process contact submission using existing service
 */
async function processContactSubmission(
  validatedData: ContactFormData & { clientIp: string },
  startTime: number,
): Promise<{
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  submissionId?: string;
}> {
  try {
    const result = await submitContactForm(validatedData, startTime);
    
    if (result.response.status === 200) {
      const responseData = await result.response.json();
      return {
        success: true,
        submissionId: responseData.data?.submissionId,
      };
    } else {
      const errorData = await result.response.json();
      return {
        success: false,
        message: errorData.error || 'Submission failed. Please try again.',
        errors: errorData.details ? 
          errorData.details.reduce(
            (acc: Record<string, string>, detail: any) => ({
              ...acc,
              [detail.field]: detail.message,
            }),
            {},
          ) : undefined,
      };
    }
  } catch (error) {
    logger.error('Contact submission processing error:', error);
    return {
      success: false,
      message: 'Service temporarily unavailable. Please try again later.',
    };
  }
}

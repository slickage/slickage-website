'use server';

import { headers } from 'next/headers';
import { z } from 'zod';
import { db, form_submissions } from '@/server/db';
import { secureContactSchema, type ContactFormData } from '@/features/contact/lib/contact-schema';
import { verifyRecaptcha, validateRecaptchaScore } from '@/features/recaptcha/utils/recaptcha';
import { checkRateLimit } from '@/features/contact/lib/rate-limiter';
import { sanitizeInput } from '@/features/contact/lib/sanitizers';
import { logger } from '@/lib/logger';
import { captureServerEvent } from '@/services/posthog-service';
import { createSafeDistinctId, extractEmailDomain, anonymizeIp } from '@/features/contact/lib/privacy';
import { createSlackService, type SlackMessage } from '@/services/slack-service';
import { type ContactAnalyticsEvent, type ContactFormState, initialContactFormState } from '../contact-types';

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
 * Process contact submission with all business logic
 * Handles rate limiting, database storage, notifications, and analytics
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
  const { clientIp, ...formData } = validatedData;

  try {
    // 1. Rate limiting check
    const rateLimitResult = await checkRateLimit(clientIp);
    if (rateLimitResult.limited) {
      const minutesUntilReset = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
      logger.security(`Rate limit exceeded for IP ${clientIp}, remaining: ${rateLimitResult.remaining}, reset: ${new Date(rateLimitResult.resetTime).toISOString()}`);
      return {
        success: false,
        message: `Too many submissions. Please try again in ${minutesUntilReset} minutes.`,
      };
    }

    // 2. Process and store submission
    const submissionResult = await storeContactSubmission(formData, clientIp, startTime);
    if (!submissionResult.success) {
      return {
        success: false,
        message: submissionResult.error || 'Failed to save submission',
      };
    }

    // 3. Send notifications
    sendSlackNotification(formData, submissionResult.submissionId!, clientIp, startTime);

    // 4. Track analytics
    trackContactAnalytics(formData, clientIp, startTime);

    return {
      success: true,
      submissionId: submissionResult.submissionId,
    };
  } catch (error) {
    logger.error('Contact submission processing error:', error);
    return {
      success: false,
      message: 'Service temporarily unavailable. Please try again later.',
    };
  }
}

/**
 * Store contact form submission in database
 */
async function storeContactSubmission(
  formData: ContactFormData,
  clientIp: string,
  startTime: number,
): Promise<{ success: boolean; submissionId?: string; error?: string }> {
  try {
    // Sanitize data
    const sanitizedData = sanitizeContactData(formData);

    // Save to database
    const [submission] = await db
      .insert(form_submissions)
      .values(sanitizedData)
      .returning({ id: form_submissions.id });

    if (!submission?.id) {
      throw new Error('Database insertion failed - no submission ID returned');
    }

    const processingTime = Date.now() - startTime;
    logger.info(
      `Form submission successful: ID ${submission.id}, IP ${clientIp}, processing time ${processingTime}ms`,
    );

    return {
      success: true,
      submissionId: submission.id,
    };
  } catch (error) {
    logger.error('Database error during contact submission:', error);
    return {
      success: false,
      error: 'Failed to save submission',
    };
  }
}

/**
 * Sanitize contact form data for database storage
 */
function sanitizeContactData(data: ContactFormData): ContactFormData {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : '',
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
    website: data.website,
    elapsed: data.elapsed,
    recaptchaToken: data.recaptchaToken,
  };
}

/**
 * Send Slack notification (fire-and-forget)
 */
function sendSlackNotification(
  formData: ContactFormData,
  submissionId: string,
  clientIp: string,
  startTime: number,
): void {
  try {
    const slackService = createSlackService();
    if (!slackService) {
      logger.debug('Slack service not available - skipping notification');
      return;
    }

    const processingTime = Date.now() - startTime;
    const slackMessage = createContactFormSlackMessage(
      formData,
      submissionId,
      clientIp,
      processingTime,
    );

    slackService.sendMessage(slackMessage).catch((error) => {
      logger.error('Failed to send Slack notification:', error);
    });
  } catch (error) {
    logger.error('Error setting up Slack notification:', error);
  }
}

/**
 * Create a formatted contact form submission message for Slack
 */
function createContactFormSlackMessage(
  formData: ContactFormData,
  submissionId: string,
  clientIp: string,
  processingTime: number,
): SlackMessage {
  const { name, email, phone, subject, message } = formData;

  return {
    blocks: [
      {
        type: 'header',
        text: {
          type: 'plain_text',
          text: '📧 New Contact Form Submission',
          emoji: true,
        },
      },
      {
        type: 'section',
        fields: [
          {
            type: 'mrkdwn',
            text: `*Name:*\n${name}`,
          },
          {
            type: 'mrkdwn',
            text: `*Email:*\n${email}`,
          },
        ],
      },
      ...(phone
        ? [
            {
              type: 'section' as const,
              fields: [
                {
                  type: 'mrkdwn' as const,
                  text: `*Phone:*\n${phone}`,
                },
                {
                  type: 'mrkdwn' as const,
                  text: `*Subject:*\n${subject}`,
                },
              ],
            },
          ]
        : [
            {
              type: 'section' as const,
              fields: [
                {
                  type: 'mrkdwn' as const,
                  text: `*Subject:*\n${subject}`,
                },
              ],
            },
          ]),
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Message:*\n${message}`,
        },
      },
      {
        type: 'context' as const,
        elements: [
          {
            type: 'mrkdwn' as const,
            text: `🆔 *Submission ID:* ${submissionId} | 🌐 *IP:* ${clientIp} | ⏱️ *Processing:* ${processingTime}ms`,
          },
        ],
      },
      {
        type: 'divider' as const,
      },
    ],
  };
}

/**
 * Track analytics events (fire-and-forget)
 */
function trackContactAnalytics(formData: ContactFormData, clientIp: string, startTime: number): void {
  try {
    const processingTime = Date.now() - startTime;
    const emailDomain = extractEmailDomain(formData.email);
    const isInternalUser = ['slickage.com'].includes(emailDomain);

    const distinctId = isInternalUser
      ? `internal_${anonymizeIp(clientIp)}`
      : createSafeDistinctId(formData.email);

    const analyticsEvent: ContactAnalyticsEvent = {
      form_type: 'contact',
      lead_source: 'website',
      processing_time: processingTime,
      source: 'server_api',
      user_agent: 'server',
      referrer: 'server',
      is_internal: isInternalUser,
      company_domain: emailDomain,
    };

    captureServerEvent(distinctId, 'contact_flow:form_submit', analyticsEvent).catch((error) => {
      logger.error('Failed to track contact submission:', error);
    });

    // Track internal user detection if applicable
    if (isInternalUser) {
      captureServerEvent(distinctId, 'system:internal_user_detect', {
        detection_method: 'email_domain',
        company_domain: emailDomain,
        source: 'contact_form_server',
      }).catch((error) => {
        logger.error('Failed to track internal user detection:', error);
      });
    }
  } catch (error) {
    logger.error('Failed to track contact submission:', error);
  }
}

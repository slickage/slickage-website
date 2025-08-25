import { NextResponse } from 'next/server';
import { db, form_submissions } from '@/db';
import { ContactFormData } from '../validation/contact-schema';
import { sanitizeInput } from '../utils/sanitizers';
import { logger } from '../utils/logger';
import { captureServerEvent } from '../posthog-server';
import { createSafeDistinctId, extractEmailDomain, anonymizeIp } from '../utils/privacy';
import { checkRateLimit, MAX_REQUESTS_PER_WINDOW } from '../security/rate-limiter';
import { createSlackService } from './slack-service';
import type {
  ValidatedContactData,
  ContactSubmissionResult,
  ContactSubmissionResponse,
  ContactAnalyticsEvent,
} from '@/lib/types/contact-api';
import type { SlackMessage } from './slack-service';

/**
 * Complete contact form submission flow
 * Orchestrates: rate limiting, processing, notifications, analytics
 */
export async function submitContactForm(
  validatedData: ValidatedContactData,
  startTime: number = Date.now(),
): Promise<ContactSubmissionResponse> {
  const { clientIp, ...formData } = validatedData;

  try {
    // 1. Rate limiting check
    const rateLimitResult = await validateRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return {
        response: rateLimitResult.response!,
      };
    }

    // 2. Process and store submission
    const submissionResult = await processSubmission(formData, clientIp, startTime);
    if (!submissionResult.success) {
      return {
        response: NextResponse.json({ error: submissionResult.error }, { status: 500 }),
      };
    }

    // 3. Send notifications (fire-and-forget)
    sendNotifications(formData, submissionResult.submissionId!, clientIp, startTime);

    // 4. Track analytics (fire-and-forget)
    trackAnalytics(formData, clientIp, startTime);

    // 5. Return success response
    const headers: Record<string, string> = {
      'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
      'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    };

    return {
      response: NextResponse.json(
        {
          message: 'Form submitted successfully',
          data: { submissionId: submissionResult.submissionId! },
        },
        {
          status: 200,
          headers,
        },
      ),
    };
  } catch (error) {
    logger.error('Contact service error:', error);
    return {
      response: NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 500 },
      ),
    };
  }
}

/**
 * Validate rate limiting for a client IP
 * Returns rate limit result with appropriate error response if limited
 */
async function validateRateLimit(clientIp: string): Promise<{
  allowed: boolean;
  response?: NextResponse;
  remaining?: number;
  resetTime: number;
}> {
  const rateLimitResult = await checkRateLimit(clientIp);

  if (rateLimitResult.limited) {
    const minutesUntilReset = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
    return {
      allowed: false,
      response: NextResponse.json(
        { error: `Too many submissions. Please try again in ${minutesUntilReset} minutes.` },
        {
          status: 429,
          headers: { 'Retry-After': (minutesUntilReset * 60).toString() },
        },
      ),
      resetTime: rateLimitResult.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime,
  };
}

/**
 * Process and store contact form submission
 * Handles sanitization and database storage
 */
async function processSubmission(
  formData: ContactFormData,
  clientIp: string,
  startTime: number,
): Promise<ContactSubmissionResult> {
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
 * Send notifications (fire-and-forget)
 * Handles Slack notifications for form submissions
 */
function sendNotifications(
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
    logger.error('Error setting up notifications:', error);
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
 * Handles PostHog event tracking for form submissions
 */
function trackAnalytics(formData: ContactFormData, clientIp: string, startTime: number): void {
  try {
    const processingTime = Date.now() - startTime;
    const emailDomain = extractEmailDomain(formData.email);
    const isInternalUser = ['slickage.com'].includes(emailDomain);

    const distinctId = isInternalUser
      ? `internal_${anonymizeIp(clientIp)}`
      : createSafeDistinctId(formData.email);

    // Track main contact submission event
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

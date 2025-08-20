import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { logger } from '@/lib/utils/logger';
import { getClientIp } from '@/lib/utils/ip-utils';
import { contactSchema, ContactFormData } from '@/lib/validation/contact-schema';
import {
  validateHoneypot,
  validateFormTiming,
  validatePhoneNumber,
  validateLinkSpam,
} from '@/lib/validation/security-validators';
import { checkRateLimit, MAX_REQUESTS_PER_WINDOW } from '@/lib/security/rate-limiter';
import { verifyRecaptcha, validateRecaptchaScore } from '@/lib/security/recaptcha';
import { sanitizeContactData, saveContactSubmission } from '@/lib/services/contact-service';
import { createSlackService } from '@/lib/services/slack-service';
import { captureServerEvent } from '@/lib/posthog-server';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  let clientIp: string = 'unknown';

  try {
    clientIp = getClientIp(request);
    const body = await request.json();

    const validatedData: ContactFormData = contactSchema.parse(body);

    const honeypotResult = validateHoneypot(validatedData, clientIp);
    if (!honeypotResult.isValid) {
      return NextResponse.json({ error: honeypotResult.error }, { status: 400 });
    }

    const timingResult = validateFormTiming(validatedData, clientIp);
    if (!timingResult.isValid) {
      return NextResponse.json({ error: timingResult.error }, { status: 400 });
    }

    if (validatedData.recaptchaToken) {
      const recaptchaResult = await verifyRecaptcha(validatedData.recaptchaToken);

      if (!recaptchaResult.success) {
        logger.security(`reCAPTCHA failed: IP ${clientIp}, error: ${recaptchaResult.error}`);
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 },
        );
      }

      if (!validateRecaptchaScore(recaptchaResult.score)) {
        logger.security(`reCAPTCHA low score: IP ${clientIp}, score: ${recaptchaResult.score}`);
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 },
        );
      }

      logger.debug(`reCAPTCHA passed: IP ${clientIp}, score: ${recaptchaResult.score}`);
    }

    const phoneResult = validatePhoneNumber(validatedData);
    if (!phoneResult.isValid) {
      return NextResponse.json({ error: phoneResult.error }, { status: 400 });
    }

    const linkSpamResult = validateLinkSpam(validatedData, clientIp);
    if (!linkSpamResult.isValid) {
      return NextResponse.json({ error: linkSpamResult.error }, { status: 400 });
    }

    const rateLimitResult = await checkRateLimit(clientIp);
    if (rateLimitResult.limited) {
      const minutesUntilReset = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);

      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${minutesUntilReset} minutes.`,
          retryAfter: minutesUntilReset,
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          },
        },
      );
    }

    const sanitizedData = sanitizeContactData(validatedData);
    const submissionResult = await saveContactSubmission(sanitizedData, clientIp, startTime);

    if (!submissionResult.success) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 },
      );
    }

    // Track successful contact form submission server-side
    const processingTime = Date.now() - startTime;
    
    // Check if internal user
    const emailDomain = sanitizedData.email.split('@')[1]?.toLowerCase() || '';
    const isInternalUser = ['slickage.com'].includes(emailDomain);
    
    try {
      // Use lead-based identifier for external users, IP for internal
      const distinctId = isInternalUser 
        ? `internal_${clientIp}` 
        : `lead_${sanitizedData.email.toLowerCase()}`;
        
      await captureServerEvent(
        distinctId,
        'contact_form_submitted_server',
        {
          submission_id: submissionResult.submissionId,
          form_type: 'contact',
          processing_time_ms: processingTime,
          subject_category: sanitizedData.subject,
          contact_method: sanitizedData.phone ? 'phone_and_email' : 'email_only',
          form_completion_time_ms: validatedData.elapsed || 0,
          source: 'server_api',
          user_agent: request.headers.get('user-agent') || 'unknown',
          referrer: request.headers.get('referer') || 'direct',
          is_internal: isInternalUser,
          company_domain: emailDomain,
          lead_source: 'contact_form',
        }
      );
      
      // Additional internal user tracking
      if (isInternalUser) {
        await captureServerEvent(
          distinctId,
          'internal_user_detected',
          {
            detection_method: 'email_domain',
            email_domain: emailDomain,
            source: 'contact_form_server',
          }
        );
      }
    } catch (error) {
      logger.error('Failed to track contact submission:', error);
    }

    const slackService = createSlackService();
    if (slackService) {
      const slackMessage = slackService.createContactFormMessage({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || undefined,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        submissionId: submissionResult.submissionId!,
        clientIp,
        processingTime,
      });

      slackService.sendMessage(slackMessage).catch((error) => {
        logger.error('Failed to send Slack notification:', error);
      });
    }

    return NextResponse.json(
      {
        message: 'Form submitted successfully',
        submissionId: submissionResult.submissionId,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        },
      },
    );
  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error(
      `Error processing contact form: IP ${clientIp}, processing time ${processingTime}ms`,
      error,
    );

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (error instanceof Error) {
      logger.error('Database error:', error.message);
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle GET requests (optional - for health check)
export async function GET() {
  return NextResponse.json({ message: 'Contact API endpoint is working' }, { status: 200 });
}

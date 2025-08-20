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
import { createSafeDistinctId, extractEmailDomain, anonymizeIp } from '@/lib/utils/privacy';

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

    const processingTime = Date.now() - startTime;

    const emailDomain = extractEmailDomain(sanitizedData.email);
    const isInternalUser = ['slickage.com'].includes(emailDomain);

    try {
      const distinctId = isInternalUser
        ? `internal_${anonymizeIp(clientIp)}`
        : createSafeDistinctId(sanitizedData.email);

      await captureServerEvent(distinctId, 'contact_flow:form_submit', {
        form_type: 'contact',
        lead_source: 'website',
        processing_time: processingTime,
        source: 'server_api',
        user_agent: request.headers.get('user-agent') || 'unknown',
        referrer: request.headers.get('referer') || 'direct',
        is_internal: isInternalUser,
        company_domain: emailDomain,
      });

      if (isInternalUser) {
        await captureServerEvent(distinctId, 'system_v1:internal_user_detect', {
          detection_method: 'email_domain',
          company_domain: emailDomain,
          source: 'contact_form_server',
        });
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

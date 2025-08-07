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
import { checkRateLimit, MAX_SUBMISSIONS_PER_HOUR } from '@/lib/security/rate-limiter';
import { verifyRecaptcha, validateRecaptchaScore } from '@/lib/security/recaptcha';
import { sanitizeContactData, saveContactSubmission } from '@/lib/services/contact-service';

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
          { status: 400 }
        );
      }

      if (!validateRecaptchaScore(recaptchaResult.score)) {
        logger.security(`reCAPTCHA low score: IP ${clientIp}, score: ${recaptchaResult.score}`);
        return NextResponse.json(
          { error: 'Security verification failed. Please try again.' },
          { status: 400 }
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

    const rateLimitResult = checkRateLimit(clientIp);
    if (rateLimitResult.limited) {
      const minutesUntilReset = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
      
      return NextResponse.json(
        {
          error: `Too many submissions. Please try again in ${minutesUntilReset} minutes.`,
          retryAfter: minutesUntilReset
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Limit': MAX_SUBMISSIONS_PER_HOUR.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
          }
        }
      );
    }

    const sanitizedData = sanitizeContactData(validatedData);
    const submissionResult = await saveContactSubmission(sanitizedData, clientIp, startTime);

    if (!submissionResult.success) {
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        message: 'Form submitted successfully',
        submissionId: submissionResult.submissionId,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Limit': MAX_SUBMISSIONS_PER_HOUR.toString(),
          'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
          'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
        }
      }
    );
  } catch (error) {
    const processingTime = Date.now() - startTime;
    logger.error(
      `Error processing contact form: IP ${clientIp}, processing time ${processingTime}ms`,
      error
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
        { status: 400 }
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (error instanceof Error) {
      logger.error('Database error:', error.message);
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Handle GET requests (optional - for health check)
export async function GET() {
  return NextResponse.json({ message: 'Contact API endpoint is working' }, { status: 200 });
}
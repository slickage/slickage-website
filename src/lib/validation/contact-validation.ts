import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { secureContactSchema } from '@/lib/validation/contact-schema';
import { getClientIp } from '@/lib/utils/ip-utils';
import { verifyRecaptcha, validateRecaptchaScore } from '@/lib/security/recaptcha';
import { logger } from '@/lib/utils/logger';
import type {
  ContactFormRequest,
  ContactValidationResponse,
  ValidationResult,
} from '@/lib/types/contact-api';

export async function validateContactRequest(
  request: NextRequest,
): Promise<ContactValidationResponse> {
  try {
    const clientIp = getClientIp(request);
    const body: ContactFormRequest = await request.json();

    const validatedData = secureContactSchema.parse(body);

    // Only validate reCAPTCHA if token is provided
    if (validatedData.recaptchaToken) {
      const recaptchaResult = await validateRecaptcha(validatedData.recaptchaToken, clientIp);
      if (!recaptchaResult.isValid) {
        return {
          success: false,
          response: NextResponse.json({ error: recaptchaResult.error! }, { status: 400 }),
        };
      }
    }

    return {
      success: true,
      data: { ...validatedData, clientIp },
    };
  } catch (error) {
    return handleValidationError(error);
  }
}

/**
 * Validate reCAPTCHA if token is provided
 */
async function validateRecaptcha(
  token: string | undefined,
  clientIp: string,
): Promise<ValidationResult> {
  if (!token) return { isValid: true }; // reCAPTCHA is optional

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
}

/**
 * Handle validation errors and return appropriate responses
 */
function handleValidationError(error: unknown): ContactValidationResponse {
  if (error instanceof z.ZodError) {
    const details = error.issues.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return {
      success: false,
      response: NextResponse.json({ error: 'Validation failed', details }, { status: 400 }),
    };
  }

  return {
    success: false,
    response: NextResponse.json({ error: 'Internal server error' }, { status: 500 }),
  };
}

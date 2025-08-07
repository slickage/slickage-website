import { logger } from '../utils/logger';

export interface RecaptchaResult {
  success: boolean;
  score: number;
  error?: string;
}

/**
 * Verify reCAPTCHA v3 token
 */
export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  const secretKey = process.env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    logger.warn('RECAPTCHA_SECRET_KEY not configured');
    return { success: true, score: 1.0 };
  }

  if (!token) {
    return { success: false, score: 0, error: 'No reCAPTCHA token provided' };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      logger.debug('reCAPTCHA verification failed:', data['error-codes']);
      return { success: false, score: 0, error: 'reCAPTCHA verification failed' };
    }

    const score = data.score || 0;
    logger.debug(`reCAPTCHA score: ${score} for action: ${data.action}`);

    return { success: true, score };
  } catch (error) {
    logger.error('reCAPTCHA verification error:', error);
    return { success: true, score: 1.0 };
  }
}

/**
 * Validate reCAPTCHA score meets minimum threshold
 */
export function validateRecaptchaScore(score: number, threshold: number = 0.5): boolean {
  return score >= threshold;
}

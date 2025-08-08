import { db, form_submissions } from '@/db';
import { ContactFormData } from '../validation/contact-schema';
import { sanitizeInput } from '../utils/sanitizers';
import { logger } from '../utils/logger';

export interface ProcessedContactData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  submissionId?: string;
  error?: string;
}

/**
 * Sanitize contact form data for database storage
 */
export function sanitizeContactData(data: ContactFormData): ProcessedContactData {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    phone: data.phone ? sanitizeInput(data.phone) : '',
    subject: sanitizeInput(data.subject),
    message: sanitizeInput(data.message),
  };
}

/**
 * Save contact form submission to database
 */
export async function saveContactSubmission(
  sanitizedData: ProcessedContactData,
  clientIp: string,
  startTime: number,
): Promise<ContactSubmissionResult> {
  try {
    const submission = await db.insert(form_submissions).values(sanitizedData).returning();

    if (!submission || submission.length === 0) {
      throw new Error('Failed to insert submission - no data returned');
    }

    const processingTime = Date.now() - startTime;
    const submissionId = submission[0]?.id;

    if (!submissionId) {
      throw new Error('Failed to get submission ID');
    }

    logger.info(
      `Form submission successful: ID ${submissionId}, IP ${clientIp}, processing time ${processingTime}ms`,
    );

    return {
      success: true,
      submissionId,
    };
  } catch (error) {
    logger.error('Database error during contact submission:', error);
    return {
      success: false,
      error: 'Failed to save submission',
    };
  }
}

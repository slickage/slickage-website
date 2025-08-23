import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { validateContactRequest } from '@/lib/validation/contact-validation';
import { submitContactForm } from '@/lib/services/contact-service';
import { logger } from '@/lib/utils/logger';

/**
 * Contact form submission endpoint
 * Handles validation and delegates processing to ContactService
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    const validationResult = await validateContactRequest(request);
    if (!validationResult.success) {
      return validationResult.response!;
    }

    const result = await submitContactForm(validationResult.data!, startTime);
    return result.response;
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    logger.error(`Contact form submission error: processing time ${processingTime}ms`, error);
    
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

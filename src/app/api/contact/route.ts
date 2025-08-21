import type { NextRequest } from 'next/server';
import { validateContactRequest } from '@/lib/validation/contact-validation';
import { submitContactForm } from '@/lib/services/contact-service';
import { handleApiError } from '@/lib/utils/api-responses';

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
    return handleApiError(error, 'Contact form submission', startTime);
  }
}

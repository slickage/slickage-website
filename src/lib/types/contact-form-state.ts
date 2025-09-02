import type { ContactFormData } from '@/lib/validation/contact-schema';

/**
 * State interface for useActionState in contact form
 */
export interface ContactFormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Partial<ContactFormData>; // Persist form values for better UX
  submissionId?: string;
}

/**
 * Initial state for useActionState
 */
export const initialContactFormState: ContactFormState = {
  success: false,
};

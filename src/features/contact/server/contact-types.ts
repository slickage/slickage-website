import { type ContactFormData } from '@/features/contact/lib/contact-schema';

export interface ContactAnalyticsEvent {
  form_type: 'contact';
  lead_source: 'website';
  processing_time: number;
  source: 'server_api';
  user_agent: string;
  referrer: string;
  is_internal: boolean;
  company_domain: string;
}

export interface ContactFormState {
  success: boolean;
  message?: string;
  errors?: Record<string, string>;
  values?: Partial<ContactFormData>; // Persist form values for better UX
  submissionId?: string;
}

export const initialContactFormState: ContactFormState = {
  success: false,
};

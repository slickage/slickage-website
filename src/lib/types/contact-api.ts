import type { NextResponse } from 'next/server';
import type { SecureContactFormData } from '@/lib/validation/contact-schema';

// Contact data processing types
export interface ValidatedContactData extends SecureContactFormData {
  clientIp: string;
}

export interface ContactSubmissionResult {
  success: boolean;
  submissionId?: string;
  error?: string;
}

// Request types
export interface ContactFormRequest {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  website?: string;
  recaptchaToken?: string;
  elapsed?: number;
}

// Validation response types
export interface ContactValidationResponse {
  success: boolean;
  data?: ValidatedContactData;
  response?: NextResponse;
}

// Security validation types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

// Service response types
export interface ContactSubmissionResponse {
  response: NextResponse;
}

// Contact analytics event type
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

// Frontend response types
export interface ContactFormSuccessResponse {
  message: string;
  data: {
    submissionId: string;
  };
}

export interface ContactFormErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  retryAfter?: number;
}

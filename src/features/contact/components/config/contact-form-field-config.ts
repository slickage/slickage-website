import type { ChangeEvent } from 'react';

export const FORM_CONSTANTS = {
  PHONE: {
    AREA_CODE_LENGTH: 3,
    PREFIX_LENGTH: 6,
    LINE_NUMBER_LENGTH: 10,
    MAX_LENGTH: 14,
  },
  MESSAGE: {
    MIN_HEIGHT: 150,
    MAX_LENGTH: 5000,
  },
  HTTP_STATUS: {
    RATE_LIMITED: 429,
  },
  RECAPTCHA: {
    ACTION: 'contact_form',
  },
} as const;

export interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  website: string;
}

export interface FormFieldConfig {
  name: keyof ContactFormData;
  label: string;
  type: 'text' | 'email' | 'tel' | 'textarea';
  placeholder: string;
  required: boolean;
  isGridField: boolean;
  maxLength?: number;
  autoComplete?: string;
  optional?: boolean;
  minHeight?: number;
}

export interface FormFieldProps {
  field: FormFieldConfig;
  value: string;
  error?: string;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const FORM_FIELDS: readonly FormFieldConfig[] = [
  {
    name: 'name',
    label: 'Name',
    type: 'text',
    placeholder: 'Your full name',
    required: true,
    isGridField: false,
  },
  {
    name: 'email',
    label: 'Email',
    type: 'email',
    placeholder: 'your.email@example.com',
    required: true,
    isGridField: true,
  },
  {
    name: 'phone',
    label: 'Phone Number',
    type: 'tel',
    placeholder: '(555) 123-4567',
    required: false,
    maxLength: FORM_CONSTANTS.PHONE.MAX_LENGTH,
    autoComplete: 'tel',
    optional: true,
    isGridField: true,
  },
  {
    name: 'subject',
    label: 'Company or Project Name',
    type: 'text',
    placeholder: 'Your Company or Project Name',
    required: true,
    isGridField: false,
  },
  {
    name: 'message',
    label: 'How can we help you?',
    type: 'textarea',
    placeholder:
      'Please describe your company, project or what you need help with. (Maximum 2 links allowed)',
    required: true,
    minHeight: FORM_CONSTANTS.MESSAGE.MIN_HEIGHT,
    maxLength: FORM_CONSTANTS.MESSAGE.MAX_LENGTH,
    isGridField: false,
  },
] as const;

export type FormFieldName = (typeof FORM_FIELDS)[number]['name'];

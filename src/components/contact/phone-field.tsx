'use client';

import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { FORM_CONSTANTS } from '@/components/contact/config/contact-form-field-config';

interface PhoneFieldProps {
  id: string;
  name: string;
  placeholder: string;
  required: boolean;
  maxLength?: number;
  autoComplete?: string;
  error?: boolean;
  defaultValue?: string;
  className: string;
}

/**
 * Client component for phone field with real-time formatting
 * Handles phone number formatting as user types
 */
export function PhoneField({
  id,
  name,
  placeholder,
  required,
  maxLength,
  autoComplete,
  error,
  defaultValue,
  className,
}: PhoneFieldProps) {
  /**
   * Format phone number as user types
   * Formats: 123 -> (123) -> (123) 456 -> (123) 456-7890
   */
  const formatPhoneNumber = (inputValue: string): string => {
    const digits = inputValue.replace(/\D/g, '');
    const { AREA_CODE_LENGTH, PREFIX_LENGTH, LINE_NUMBER_LENGTH } = FORM_CONSTANTS.PHONE;

    if (digits.length <= AREA_CODE_LENGTH) {
      return digits;
    } else if (digits.length <= PREFIX_LENGTH) {
      return `(${digits.slice(0, AREA_CODE_LENGTH)}) ${digits.slice(AREA_CODE_LENGTH)}`;
    } else if (digits.length <= LINE_NUMBER_LENGTH) {
      return `(${digits.slice(0, AREA_CODE_LENGTH)}) ${digits.slice(AREA_CODE_LENGTH, PREFIX_LENGTH)}-${digits.slice(PREFIX_LENGTH)}`;
    } else {
      return `(${digits.slice(0, AREA_CODE_LENGTH)}) ${digits.slice(AREA_CODE_LENGTH, PREFIX_LENGTH)}-${digits.slice(PREFIX_LENGTH, LINE_NUMBER_LENGTH)}`;
    }
  };

  /**
   * Handle phone field change with formatting
   */
  const handlePhoneChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formattedValue = formatPhoneNumber(e.target.value);
    e.target.value = formattedValue;
  };

  return (
    <Input
      id={id}
      name={name}
      type="tel"
      placeholder={placeholder}
      onChange={handlePhoneChange}
      required={required}
      maxLength={maxLength}
      autoComplete={autoComplete}
      error={error}
      defaultValue={defaultValue}
      className={className}
    />
  );
}

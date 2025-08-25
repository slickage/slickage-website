'use client';

import type { ChangeEvent } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  FORM_FIELDS,
  FORM_CONSTANTS,
  type FormFieldConfig,
  type FormFieldProps,
  type ContactFormData,
} from '@/components/contact/config/contact-form-field-config';

interface FormFieldsProps {
  formData: ContactFormData;
  errors: Record<string, string>;
  onChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export function FormFields({ formData, errors, onChange }: FormFieldsProps) {
  const renderFormFields = () => {
    const elements: React.ReactElement[] = [];
    let currentGridFields: FormFieldConfig[] = [];

    FORM_FIELDS.forEach((field, index) => {
      if (field.isGridField) {
        currentGridFields.push(field);

        const nextField = FORM_FIELDS[index + 1];
        const shouldRenderGrid = !nextField || !nextField.isGridField;

        if (shouldRenderGrid && currentGridFields.length > 0) {
          const firstGridField = currentGridFields[0]!;
          elements.push(
            <div
              key={`grid-${firstGridField.name}`}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            >
              {currentGridFields.map((gridField) => (
                <FormField
                  key={gridField.name}
                  field={gridField}
                  value={formData[gridField.name]}
                  error={errors[gridField.name]}
                  onChange={onChange}
                />
              ))}
            </div>,
          );
          currentGridFields = [];
        }
      } else {
        elements.push(
          <FormField
            key={field.name}
            field={field}
            value={formData[field.name]}
            error={errors[field.name]}
            onChange={onChange}
          />,
        );
      }
    });

    return elements;
  };

  return <>{renderFormFields()}</>;
}

function FormField({ field, value, error, onChange }: FormFieldProps) {
  const isMessageField = field.name === 'message';

  return (
    <div className="mb-4">
      <label htmlFor={field.name} className="block text-sm font-medium text-gray-300 mb-1">
        {field.label}{' '}
        {field.required ? (
          <span className="text-red-400">*</span>
        ) : (
          'optional' in field &&
          field.optional && <span className="text-gray-300 text-xs">(optional)</span>
        )}
      </label>

      {isMessageField ? (
        <Textarea
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          required={field.required}
          error={!!error}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          style={{ minHeight: `${FORM_CONSTANTS.MESSAGE.MIN_HEIGHT}px` }}
        />
      ) : (
        <Input
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={onChange}
          required={field.required}
          maxLength={'maxLength' in field ? field.maxLength : undefined}
          autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
          error={!!error}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
      )}

      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}

      {isMessageField && (
        <p className="mt-1 text-xs text-gray-500">
          {value.length}/{FORM_CONSTANTS.MESSAGE.MAX_LENGTH} characters
        </p>
      )}
    </div>
  );
}

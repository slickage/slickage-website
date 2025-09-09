import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PhoneField } from '@/components/phone-field';
import {
  FORM_FIELDS,
  FORM_CONSTANTS,
  type FormFieldConfig,
} from '@/features/contact/components/config/contact-form-field-config';
import type { ContactFormData } from '@/features/contact/lib/contact-schema';

interface FormFieldsProps {
  errors?: Record<string, string>;
  values?: Partial<ContactFormData>;
}

export function FormFields({ errors, values }: FormFieldsProps) {
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
                  error={errors?.[gridField.name]}
                  value={String(values?.[gridField.name as keyof ContactFormData] || '')}
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
            error={errors?.[field.name]}
            value={String(values?.[field.name as keyof ContactFormData] || '')}
          />,
        );
      }
    });

    return elements;
  };

  return <>{renderFormFields()}</>;
}

interface FormFieldProps {
  field: FormFieldConfig;
  error?: string;
  value?: string;
}

function FormField({ field, error, value }: FormFieldProps) {
  const isMessageField = field.name === 'message';
  const isPhoneField = field.name === 'phone';

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
          required={field.required}
          error={!!error}
          defaultValue={value || ''}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
          style={{ minHeight: `${FORM_CONSTANTS.MESSAGE.MIN_HEIGHT}px` }}
        />
      ) : isPhoneField ? (
        <PhoneField
          id={field.name}
          name={field.name}
          placeholder={field.placeholder}
          required={field.required}
          maxLength={'maxLength' in field ? field.maxLength : undefined}
          autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
          error={!!error}
          defaultValue={value || ''}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
      ) : (
        <Input
          id={field.name}
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          required={field.required}
          maxLength={'maxLength' in field ? field.maxLength : undefined}
          autoComplete={'autoComplete' in field ? field.autoComplete : undefined}
          error={!!error}
          defaultValue={value || ''}
          className="w-full px-4 py-3 rounded-lg bg-gray-800 text-white placeholder-gray-400"
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-red-400" aria-live="polite" role="alert">
          {error}
        </p>
      )}

      {isMessageField && (
        <p className="mt-1 text-xs text-gray-500">
          <span id={`${field.name}-char-count`}>0</span>/{FORM_CONSTANTS.MESSAGE.MAX_LENGTH} characters
        </p>
      )}
    </div>
  );
}

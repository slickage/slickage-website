# Contact Form System

## Overview

The contact form system provides a secure, user-friendly way for visitors to submit inquiries. It includes comprehensive validation, spam protection, and integration with Slack notifications.

## Implementation Details

### Core Components

#### ContactForm Component

Located at `src/components/contact/contact-form.tsx`, this is the main form component that handles user input and submission.

**Key Features:**

- Real-time validation with field-specific error messages
- Phone number formatting with automatic formatting
- reCAPTCHA v3 integration for spam protection
- Form timing validation to prevent rapid submissions
- Comprehensive error handling and user feedback

#### Contact API Route

Located at `src/app/api/contact/route.ts`, this handles form submission processing and validation.

**Security Features:**

- Honeypot field detection
- Form timing validation
- Rate limiting (max 10 submissions per hour per IP)
- reCAPTCHA verification
- Input sanitization and validation

### Form Fields

The contact form includes the following fields:

```typescript
interface ContactFormData {
  name: string; // Required, 1-255 characters
  email: string; // Required, valid email format
  phone?: string; // Optional, formatted phone number
  subject: string; // Required, 1-255 characters
  message: string; // Required, 10-5000 characters
  website?: string; // Honeypot field (hidden from users)
  elapsed?: number; // Form completion time for spam detection
  recaptchaToken?: string; // reCAPTCHA verification token
}
```

### Validation Schema

Form validation is handled using Zod schemas in `src/lib/validation/contact-schema.ts`:

```typescript
export const contactSchema = z.object({
  name: z
    .string()
    .min(1, { message: 'Name is required' })
    .max(255, { message: 'Name too long' })
    .regex(/^[a-zA-Z\s\-.']+$/, { message: 'Name contains invalid characters' }),
  email: z
    .email({ message: 'Invalid email format' })
    .max(255, { message: 'Email too long' })
    .transform((val) => val.toLowerCase()),
  phone: z
    .string()
    .max(255, { message: 'Phone too long' })
    .regex(/^[\d\s\-\+\(\)\.]*$/, { message: 'Phone contains invalid characters' })
    .optional()
    .or(z.literal('')),
  subject: z
    .string()
    .min(1, { message: 'Subject is required' })
    .max(255, { message: 'Subject too long' }),
  message: z
    .string()
    .min(10, { message: 'Message must be at least 10 characters' })
    .max(5000, { message: 'Message too long' }),
  website: z.string().optional(), // Honeypot field
  elapsed: z.number().optional(), // Time elapsed (for spam detection)
  recaptchaToken: z.string().optional(),
});
```

## Security Features

### 1. Honeypot Protection

A hidden `website` field that legitimate users won't fill out, but bots often will:

```typescript
export function validateHoneypot(
  data: ContactFormData,
  clientIp: string,
): SecurityValidationResult {
  if (data.website && data.website.trim() !== '') {
    logger.security(`Spam detected (honeypot): IP ${clientIp}`);
    return { isValid: false, error: 'Invalid submission' };
  }
  return { isValid: true };
}
```

### 2. Form Timing Validation

Prevents rapid form submissions that indicate automated behavior:

```typescript
export function validateFormTiming(
  data: ContactFormData,
  clientIp: string,
): SecurityValidationResult {
  if (data.elapsed && data.elapsed < 2000) {
    // Less than 2 seconds
    logger.security(`Spam detected (too fast): IP ${clientIp}, elapsed ${data.elapsed}ms`);
    return { isValid: false, error: 'Please take more time to fill out the form' };
  }
  return { isValid: true };
}
```

### 3. Rate Limiting

Prevents abuse by limiting submissions per IP address:

```typescript
export function checkRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const windowStart = now - 60 * 60 * 1000; // 1 hour window

  // Clean old entries
  rateLimitMap.forEach((timestamp, key) => {
    if (timestamp < windowStart) {
      rateLimitMap.delete(key);
    }
  });

  const submissions = Array.from(rateLimitMap.entries()).filter(
    ([key, timestamp]) => key.startsWith(ip) && timestamp >= windowStart,
  ).length;

  if (submissions >= MAX_SUBMISSIONS_PER_HOUR) {
    return {
      limited: true,
      remaining: 0,
      resetTime: windowStart + 60 * 60 * 1000,
    };
  }

  return {
    limited: false,
    remaining: MAX_SUBMISSIONS_PER_HOUR - submissions,
    resetTime: windowStart + 60 * 60 * 1000,
  };
}
```

### 4. reCAPTCHA v3 Integration

Uses Google's reCAPTCHA v3 for invisible bot detection:

```typescript
export async function verifyRecaptcha(token: string): Promise<RecaptchaResult> {
  const secretKey = env.RECAPTCHA_SECRET_KEY;

  if (!secretKey) {
    logger.warn('RECAPTCHA_SECRET_KEY not configured');
    return { success: true, score: 1.0 };
  }

  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${secretKey}&response=${token}`,
    });

    const data = await response.json();

    if (!data.success) {
      return { success: false, score: 0, error: 'reCAPTCHA verification failed' };
    }

    const score = data.score || 0;
    return { success: true, score };
  } catch (error) {
    logger.error('reCAPTCHA verification error:', error);
    return { success: true, score: 1.0 };
  }
}
```

## Usage Guidelines

### Basic Implementation

```tsx
import { ContactForm } from '@/components/contact';

export default function ContactPage() {
  return (
    <div className="contact-page">
      <h1>Contact Us</h1>
      <ContactForm standalone={true} />
    </div>
  );
}
```

### Standalone vs Embedded

The `ContactForm` component accepts a `standalone` prop:

- **`standalone={true}`**: Full-page contact form with hero section
- **`standalone={false}`** (default): Embedded form for use in other components

### Custom Styling

The form uses Tailwind CSS classes and can be customized through the `className` prop on individual form elements.

## Configuration Options

### Environment Variables

Required environment variables for full functionality:

```bash
# Google reCAPTCHA
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# Database
DATABASE_URL=your_database_connection_string

# Slack Integration (optional)
SLACK_WEBHOOK_URL=your_slack_webhook_url
```

### reCAPTCHA Configuration

The form automatically loads reCAPTCHA when the form comes into view:

```typescript
const {
  siteKey,
  isEnabled,
  isLoaded: recaptchaLoaded,
} = useRecaptcha({
  strategy: 'in-viewport',
  triggerRef: sectionRef,
});
```

## Best Practices

### 1. Form Validation

- Always validate on both client and server side
- Provide clear, specific error messages
- Use appropriate input types and patterns

### 2. Security

- Implement multiple layers of spam protection
- Log security events for monitoring
- Use rate limiting to prevent abuse
- Sanitize all user inputs

### 3. User Experience

- Provide real-time feedback on validation errors
- Show loading states during submission
- Handle network errors gracefully
- Provide clear success confirmation

### 4. Accessibility

- Use proper form labels and ARIA attributes
- Ensure keyboard navigation works
- Provide clear error messages for screen readers

## Examples

### Custom Validation

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Custom validation
  if (formData.message.length < 10) {
    setError('Message must be at least 10 characters long');
    return;
  }

  // Submit form
  await submitForm(formData);
};
```

### Custom Error Handling

```tsx
try {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.details) {
      // Handle field-specific errors
      setFieldErrors(errorData.details);
    } else {
      setError(errorData.error);
    }
  }
} catch (error) {
  setError('Network error. Please try again.');
}
```

## Troubleshooting

### Common Issues

1. **reCAPTCHA not loading**
   - Check `RECAPTCHA_SITE_KEY` environment variable
   - Verify the domain is registered in Google reCAPTCHA console

2. **Form submission fails**
   - Check browser console for JavaScript errors
   - Verify all required environment variables are set
   - Check server logs for detailed error information

3. **Rate limiting issues**
   - Check if IP address is being blocked
   - Verify rate limit configuration in code

4. **Validation errors**
   - Ensure form data matches the Zod schema
   - Check for special characters in name field
   - Verify email format is valid

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Integration Points

### Slack Notifications

When a form is submitted successfully, a notification is sent to Slack (if configured):

```typescript
const slackService = createSlackService();
if (slackService) {
  await slackService.sendMessage(
    slackService.createContactFormMessage({
      name: data.name,
      email: data.email,
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      submissionId: submissionResult.submissionId,
      clientIp: clientIp,
      processingTime: Date.now() - startTime,
    }),
  );
}
```

### Database Storage

Form submissions are stored in the database for record-keeping and follow-up:

```typescript
export async function saveContactSubmission(
  sanitizedData: ProcessedContactData,
  clientIp: string,
  startTime: number,
): Promise<ContactSubmissionResult> {
  try {
    const result = await db
      .insert(form_submissions)
      .values({
        name: sanitizedData.name,
        email: sanitizedData.email,
        phone: sanitizedData.phone || null,
        subject: sanitizedData.subject,
        message: sanitizedData.message,
        client_ip: clientIp,
        submitted_at: new Date(),
      })
      .returning({ id: form_submissions.id });

    return {
      success: true,
      submissionId: result[0].id,
    };
  } catch (error) {
    logger.error('Failed to save contact submission:', error);
    return {
      success: false,
      error: 'Failed to save submission',
    };
  }
}
```

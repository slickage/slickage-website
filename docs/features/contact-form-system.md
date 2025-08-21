# Contact Form System

## Overview

The contact form system provides a secure, user-friendly way for visitors to submit inquiries. It includes comprehensive validation, spam protection, and integration with Slack notifications. The system has been refactored to use a clean, layered architecture that separates concerns and improves maintainability.

## Architecture Overview

The refactored system follows a clean, layered architecture:

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   API Route     │───▶│  Validation      │───▶│   Service       │
│   (route.ts)    │    │  (contact-       │    │  (contact-      │
│                  │    │   validation.ts) │    │   service.ts)   │
└─────────────────┘    └──────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│  Response       │    │   Schema         │    │   Types         │
│  (api-         │    │  (contact-       │    │  (contact-      │
│   responses.ts) │    │   schema.ts)     │    │   api.ts)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

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
- Submission ID display for user reference

#### Contact API Route

Located at `src/app/api/contact/route.ts`, this is now a thin orchestration layer that delegates to specialized services.

**New Architecture:**

```typescript
export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // 1. Validate request
    const validationResult = await validateContactRequest(request);
    if (!validationResult.success) {
      return validationResult.response!;
    }

    // 2. Submit form through service layer
    const result = await submitContactForm(validationResult.data!, startTime);
    return result.response;
  } catch (error) {
    return handleApiError(error, 'Contact form submission', startTime);
  }
}
```

**Benefits of New Architecture:**

- **Separation of Concerns**: Each layer has a single responsibility
- **Testability**: Individual components can be tested in isolation
- **Maintainability**: Changes to validation logic don't affect the API route
- **Reusability**: Services can be used by other parts of the application
- **Error Handling**: Centralized error handling with consistent responses

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

Form validation is now handled using a two-tier schema system in `src/lib/validation/contact-schema.ts`:

```typescript
// Base schema for form data
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

// Enhanced schema with security validations
export const secureContactSchema = contactSchema
  .refine((data) => !data.website || data.website.trim() === '', {
    message: 'Invalid submission',
  })
  .refine((data) => !data.elapsed || data.elapsed >= MIN_FORM_TIME, {
    message: 'Please take more time to fill out the form',
  })
  .refine((data) => countLinks(data.message) <= MAX_LINKS_IN_MESSAGE, {
    message: 'Message contains too many links',
  });
```

## Security Features

### 1. Honeypot Protection

A hidden `website` field that legitimate users won't fill out, but bots often will:

```typescript
// Now handled in the secureContactSchema
.refine((data) => !data.website || data.website.trim() === '', {
  message: 'Invalid submission'
})
```

### 2. Form Timing Validation

Prevents rapid form submissions that indicate automated behavior:

```typescript
// Now handled in the secureContactSchema with configurable timing
const MIN_FORM_TIME = 3000; // Minimum form completion time

.refine((data) => !data.elapsed || data.elapsed >= MIN_FORM_TIME, {
  message: 'Please take more time to fill out the form',
})
```

### 3. Link Spam Detection

Prevents message spam by limiting the number of links:

```typescript
// Now handled in the secureContactSchema
const MAX_LINKS_IN_MESSAGE = 3;

.refine((data) => countLinks(data.message) <= MAX_LINKS_IN_MESSAGE, {
  message: 'Message contains too many links',
})
```

### 4. Rate Limiting

Prevents abuse by limiting submissions per IP address:

```typescript
// Now handled in the ContactService
async function validateRateLimit(clientIp: string) {
  const rateLimitResult = await checkRateLimit(clientIp);

  if (rateLimitResult.limited) {
    const minutesUntilReset = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
    return {
      allowed: false,
      response: createRateLimitedResponse(
        `Too many submissions. Please try again in ${minutesUntilReset} minutes.`,
        minutesUntilReset * 60,
      ),
      resetTime: rateLimitResult.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: rateLimitResult.remaining,
    resetTime: rateLimitResult.resetTime,
  };
}
```

### 5. reCAPTCHA v3 Integration

Uses Google's reCAPTCHA v3 for invisible bot detection:

```typescript
// Now handled in the validation layer
async function validateRecaptcha(token: string | undefined, clientIp: string) {
  if (!token) return { isValid: true }; // reCAPTCHA is optional

  const result = await verifyRecaptcha(token);
  if (!result.success) {
    logger.security(`reCAPTCHA failed: IP ${clientIp}, error: ${result.error}`);
    return { isValid: false, error: 'Security verification failed. Please try again.' };
  }

  if (!validateRecaptchaScore(result.score)) {
    logger.security(`reCAPTCHA low score: IP ${clientIp}, score: ${result.score}`);
    return { isValid: false, error: 'Security validation failed. Please try again.' };
  }

  return { isValid: true };
}
```

## New Service Layer

### ContactService

Located at `src/lib/services/contact-service.ts`, this orchestrates the complete contact form submission flow:

```typescript
export async function submitContactForm(
  validatedData: ValidatedContactData,
  startTime: number = Date.now(),
): Promise<ContactSubmissionResponse> {
  const { clientIp, ...formData } = validatedData;

  try {
    // 1. Rate limiting check
    const rateLimitResult = await validateRateLimit(clientIp);
    if (!rateLimitResult.allowed) {
      return { response: rateLimitResult.response! };
    }

    // 2. Process and store submission
    const submissionResult = await processSubmission(formData, clientIp, startTime);
    if (!submissionResult.success) {
      return { response: createServerErrorResponse(submissionResult.error) };
    }

    // 3. Send notifications (fire-and-forget)
    sendNotifications(formData, submissionResult.submissionId!, clientIp, startTime);

    // 4. Track analytics (fire-and-forget)
    trackAnalytics(formData, clientIp, startTime);

    // 5. Return success response with rate limit headers
    const headers = {
      'X-RateLimit-Limit': MAX_REQUESTS_PER_WINDOW.toString(),
      'X-RateLimit-Remaining': rateLimitResult.remaining?.toString() || '0',
      'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
    };

    return {
      response: createSuccessResponse(
        'Form submitted successfully',
        { submissionId: submissionResult.submissionId! },
        200,
        headers,
      ),
    };
  } catch (error) {
    logger.error('Contact service error:', error);
    return {
      response: createServerErrorResponse(
        'Service temporarily unavailable. Please try again later.',
      ),
    };
  }
}
```

## Standardized API Responses

### API Response Utilities

Located at `src/lib/utils/api-responses.ts`, this provides consistent response formatting:

```typescript
// Success responses
export function createSuccessResponse<T>(
  message: string,
  data?: T,
  status: number = 200,
  headers?: Record<string, string>,
): NextResponse;

// Error responses
export function createBadRequestResponse(
  message: string,
  details?: ErrorResponse['details'],
): NextResponse;

export function createRateLimitedResponse(message: string, retryAfter: number): NextResponse;

export function createServerErrorResponse(message: string = 'Internal server error'): NextResponse;

// Centralized error handling
export function handleApiError(error: unknown, context: string, startTime?: number): NextResponse;
```

### Response Types

The system now uses strongly-typed response interfaces:

```typescript
// Success response
export interface ContactFormSuccessResponse {
  message: string;
  data: {
    submissionId: string;
  };
}

// Error response
export interface ContactFormErrorResponse {
  error: string;
  details?: Array<{
    field: string;
    message: string;
  }>;
  retryAfter?: number;
}
```

## Enhanced Frontend Features

### Submission ID Display

The form now displays a submission ID to users for reference:

```tsx
{
  isSubmitted && (
    <div className="text-center">
      <h3 className="text-2xl font-bold text-white mb-4">Message Sent Successfully!</h3>
      <p className="text-gray-300 mb-6 leading-relaxed">
        Thank you for reaching out. We'll get back to you as soon as possible.
        {submissionId && (
          <span className="block mt-2 text-sm text-green-400 font-mono">
            Reference: #{submissionId}
          </span>
        )}
      </p>
      <Button
        onClick={() => {
          setIsSubmitted(false);
          setSubmissionId(null);
        }}
        variant="blue"
        size="lg"
      >
        Send Another Message
      </Button>
    </div>
  );
}
```

### Enhanced Analytics Tracking

The system now tracks submission IDs in analytics events:

```typescript
// In useEventTracking hook
trackFormInteraction(standalone ? 'contact_page' : 'homepage', 'submitted', {
  completionTime: elapsed,
  ...(extractedSubmissionId && { submissionId: extractedSubmissionId }),
});
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
- Implement security validations in the schema layer

### 2. Security

- Implement multiple layers of spam protection
- Log security events for monitoring
- Use rate limiting to prevent abuse
- Sanitize all user inputs
- Use honeypot fields and timing validation

### 3. User Experience

- Provide real-time feedback on validation errors
- Show loading states during submission
- Handle network errors gracefully
- Provide clear success confirmation with reference IDs
- Allow users to send multiple messages

### 4. Architecture

- Separate concerns into distinct layers
- Use strongly-typed interfaces
- Implement centralized error handling
- Make services reusable and testable
- Use fire-and-forget for non-critical operations

### 5. Accessibility

- Use proper form labels and ARIA attributes
- Ensure keyboard navigation works
- Provide clear error messages for screen readers
- Include submission reference IDs for user tracking

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
    const errorData: ContactFormErrorResponse = await response.json();
    if (errorData.details) {
      // Handle field-specific errors
      setFieldErrors(errorData.details);
    } else {
      setError(errorData.error);
    }
  } else {
    const successData: ContactFormSuccessResponse = await response.json();
    setSubmissionId(successData.data.submissionId);
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
   - Verify validation schema requirements are met

3. **Rate limiting issues**
   - Check if IP address is being blocked
   - Verify rate limit configuration in code
   - Check response headers for rate limit information

4. **Validation errors**
   - Ensure form data matches the Zod schema
   - Check for special characters in name field
   - Verify email format is valid
   - Ensure form completion time meets minimum requirements

5. **Link spam detection**
   - Check if message contains too many links
   - Verify link counting logic in sanitizers

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## Integration Points

### Slack Notifications

When a form is submitted successfully, a notification is sent to Slack (if configured):

```typescript
// Now handled in the ContactService
function sendNotifications(
  formData: ContactFormData,
  submissionId: string,
  clientIp: string,
  startTime: number,
): void {
  try {
    const slackService = createSlackService();
    if (!slackService) {
      logger.debug('Slack service not available - skipping notification');
      return;
    }

    const processingTime = Date.now() - startTime;
    const slackMessage = createContactFormSlackMessage(
      formData,
      submissionId,
      clientIp,
      processingTime,
    );

    slackService.sendMessage(slackMessage).catch((error) => {
      logger.error('Failed to send Slack notification:', error);
    });
  } catch (error) {
    logger.error('Error setting up notifications:', error);
  }
}
```

### Database Storage

Form submissions are stored in the database for record-keeping and follow-up:

```typescript
// Now handled in the ContactService
async function processSubmission(
  formData: ContactFormData,
  clientIp: string,
  startTime: number,
): Promise<ContactSubmissionResult> {
  try {
    // Sanitize data
    const sanitizedData = sanitizeContactData(formData);

    // Save to database
    const [submission] = await db
      .insert(form_submissions)
      .values(sanitizedData)
      .returning({ id: form_submissions.id });

    if (!submission?.id) {
      throw new Error('Database insertion failed - no submission ID returned');
    }

    const processingTime = Date.now() - startTime;
    logger.info(
      `Form submission successful: ID ${submission.id}, IP ${clientIp}, processing time ${processingTime}ms`,
    );

    return {
      success: true,
      submissionId: submission.id,
    };
  } catch (error) {
    logger.error('Database error during contact submission:', error);
    return {
      success: false,
      error: 'Failed to save submission',
    };
  }
}
```

## Migration Notes

### From Previous Version

If migrating from the previous monolithic API route:

1. **API Response Format**: Response format has changed to include a `data` wrapper
2. **Error Handling**: Errors now use standardized response formats
3. **Validation**: Security validations are now handled in the schema layer
4. **Service Layer**: Business logic has been moved to dedicated services
5. **Type Safety**: All interfaces are now strongly typed

### Breaking Changes

- API responses now include a `data` wrapper for successful submissions
- Error responses use standardized formats with consistent structure
- Some validation error messages may have changed
- Rate limit headers are now consistently included in all responses

## Performance Improvements

### Fire-and-Forget Operations

Non-critical operations like Slack notifications and analytics tracking are now fire-and-forget:

```typescript
// Notifications and analytics don't block the response
sendNotifications(formData, submissionResult.submissionId!, clientIp, startTime);
trackAnalytics(formData, clientIp, startTime);
```

### Optimized Validation

Validation is now more efficient with early returns and optimized schema checks:

```typescript
// Early return for validation failures
if (!validationResult.success) {
  return validationResult.response!;
}
```

### Reduced Database Calls

The system now makes fewer database calls by batching operations and using efficient queries.

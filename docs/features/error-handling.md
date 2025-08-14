# Error Handling

## Overview

The error handling system provides comprehensive error management throughout the application, including React Error Boundaries, global error handling, and graceful fallbacks for various error scenarios.

## Implementation Details

### Core Components

#### ErrorBoundary Component

Located at `src/components/ui/ErrorBoundary.tsx`, this is a reusable React Error Boundary that catches JavaScript errors in component trees.

**Key Features:**

- Catches JavaScript errors in child components
- Provides fallback UI with reset functionality
- Logs errors in development mode
- Prevents entire app crashes

#### Global Error Page

Located at `src/app/error.tsx`, this handles Next.js app-level errors with a user-friendly interface.

**Functionality:**

- Catches unhandled errors in the app
- Provides reset functionality
- Maintains consistent UI during errors
- Logs errors for debugging

#### Error Handling in API Routes

Various API routes implement comprehensive error handling with proper HTTP status codes and user-friendly messages.

### Architecture

```
Component Error → ErrorBoundary → Fallback UI → Reset Option
      ↓
  Global Error → error.tsx → Error Page → App Reset
      ↓
  API Error → Status Code → Error Response → User Feedback
```

## Usage Guidelines

### Basic Error Boundary Implementation

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function MyPage() {
  return (
    <ErrorBoundary>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Custom Fallback UI

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

const customFallback = (
  <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
    <h3 className="text-red-800 font-semibold">Something went wrong</h3>
    <p className="text-red-600">Please try refreshing the page</p>
  </div>
);

export default function MyPage() {
  return (
    <ErrorBoundary fallback={customFallback}>
      <MyComponent />
    </ErrorBoundary>
  );
}
```

### Wrapping Multiple Components

```tsx
import ErrorBoundary from '@/components/ui/ErrorBoundary';

export default function Dashboard() {
  return (
    <div className="dashboard">
      <ErrorBoundary>
        <UserProfile />
      </ErrorBoundary>

      <ErrorBoundary>
        <Analytics />
      </ErrorBoundary>

      <ErrorBoundary>
        <RecentActivity />
      </ErrorBoundary>
    </div>
  );
}
```

## Error Boundary Implementation

### Class Component Structure

```tsx
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    if (env.NODE_ENV !== 'production') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-600">Something went wrong.</h2>
            <p className="mb-4 text-gray-400">An unexpected error occurred. Please try again.</p>
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
            >
              Try Again
            </button>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
```

### Props Interface

```typescript
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}
```

## Global Error Handling

### Next.js Error Page

```tsx
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Global error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-500/10 to-violet-500/10">
      <div className="max-w-md w-full bg-white/5 backdrop-blur-sm rounded-xl p-8 text-center border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-4">Something went wrong!</h2>
        <p className="text-gray-400 mb-6">
          We apologize for the inconvenience. Please try again or contact support if the problem
          persists.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
```

### Error Reset Functionality

The global error page provides a `reset()` function that attempts to recover from the error by re-rendering the component tree.

## API Error Handling

### Contact Form Error Handling

```tsx
export async function POST(request: NextRequest) {
  try {
    // ... form processing logic
  } catch (error) {
    const processingTime = Date.now() - startTime;

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation failed',
          details: error.issues.map((err: z.ZodIssue) => ({
            field: err.path.join('.'),
            message: err.message,
          })),
        },
        { status: 400 },
      );
    }

    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    if (error instanceof Error) {
      logger.error('Database error:', error.message);
      return NextResponse.json(
        { error: 'Service temporarily unavailable. Please try again later.' },
        { status: 503 },
      );
    }

    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
```

### S3 URL Generation Error Handling

```tsx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 });
    }

    // ... S3 logic
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
```

## Error Types and Handling

### 1. Validation Errors

- **Zod Schema Errors**: Field-specific validation failures
- **Input Validation**: Malformed or missing required data
- **Security Validation**: Honeypot, timing, or rate limit violations

### 2. Network Errors

- **Fetch Failures**: Network connectivity issues
- **Timeout Errors**: Request timeouts
- **CORS Errors**: Cross-origin request failures

### 3. Database Errors

- **Connection Failures**: Database connectivity issues
- **Query Errors**: SQL syntax or constraint violations
- **Transaction Failures**: Rollback scenarios

### 4. External Service Errors

- **AWS S3 Errors**: Authentication or permission failures
- **reCAPTCHA Errors**: Verification failures
- **Slack API Errors**: Webhook delivery failures

## Best Practices

### 1. Error Boundary Placement

- Wrap critical components that could fail
- Don't wrap the entire app (use Next.js error.tsx instead)
- Place boundaries at logical component boundaries

### 2. Error Logging

- Log errors with sufficient context
- Include user information when safe
- Use appropriate log levels (error, warn, info)

### 3. User Experience

- Provide clear, actionable error messages
- Offer recovery options when possible
- Maintain consistent error UI patterns

### 4. Security

- Don't expose sensitive information in error messages
- Log security-related errors appropriately
- Implement rate limiting for error-prone endpoints

## Examples

### Form Error Handling

```tsx
export default function ContactForm() {
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Success handling
        setIsSubmitted(true);
      } else {
        if (data.details && Array.isArray(data.details)) {
          // Field-specific errors
          const newFieldErrors: Record<string, string> = {};
          data.details.forEach((detail: any) => {
            newFieldErrors[detail.field] = detail.message;
          });
          setFieldErrors(newFieldErrors);
        } else {
          // General error
          setError(data.error || 'An error occurred');
        }
      }
    } catch (err) {
      setError('Network error. Please check your connection and try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700">{error}</div>
      )}

      {/* Form fields with field-specific errors */}
      <div className="mb-4">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          className={`w-full p-2 border rounded ${
            fieldErrors.name ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {fieldErrors.name && <p className="text-red-500 text-sm mt-1">{fieldErrors.name}</p>}
      </div>

      {/* ... other fields */}
    </form>
  );
}
```

### Async Operation Error Handling

```tsx
export default function DataFetcher() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/data');

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch data';
      setError(errorMessage);
      console.error('Data fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>;

  return <DataDisplay data={data} />;
}
```

### Component-Level Error Recovery

```tsx
export default function ResilientComponent() {
  const [retryCount, setRetryCount] = useState(0);
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const result = await fetchData();
      setData(result);
      setError(null);
    } catch (err) {
      setError('Failed to load data');
      console.error('Data load error:', err);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    setError(null);
    loadData();
  };

  useEffect(() => {
    loadData();
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800 mb-2">{error}</p>
        <button
          onClick={handleRetry}
          className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
        >
          Retry ({retryCount} attempts)
        </button>
      </div>
    );
  }

  return <div>{/* Component content */}</div>;
}
```

## Troubleshooting

### Common Issues

1. **Error boundaries not catching errors**
   - Ensure the component is wrapped in the boundary
   - Check that errors are thrown, not just logged
   - Verify the boundary is not catching errors from its own render method

2. **Global errors not showing error page**
   - Check that `error.tsx` is in the correct location
   - Ensure the error is thrown in a client component
   - Verify the error is not caught by an error boundary

3. **API errors not providing useful information**
   - Check error logging for detailed information
   - Verify error response format matches expected structure
   - Ensure proper HTTP status codes are returned

4. **Error boundaries causing infinite loops**
   - Check that the fallback UI doesn't throw errors
   - Verify the reset function properly clears error state
   - Ensure the boundary doesn't re-render with the same error

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` and checking browser console for detailed error information.

### Error Monitoring

Consider implementing error monitoring services like:

- Sentry for error tracking and performance monitoring
- LogRocket for session replay and error context
- Custom error reporting to your backend

## Integration with Other Systems

### Logging Integration

Errors are logged using the application's logging system for monitoring and debugging:

```typescript
import { logger } from '@/lib/utils/logger';

try {
  // ... operation
} catch (error) {
  logger.error('Operation failed:', error);
  // ... error handling
}
```

### Monitoring Integration

Error rates and types can be monitored through:

- Application performance monitoring (APM) tools
- Error tracking services
- Custom metrics and dashboards

### User Feedback Integration

Errors are communicated to users through:

- Toast notifications for non-critical errors
- Modal dialogs for critical errors
- Inline error messages for form validation
- Fallback UI for component failures

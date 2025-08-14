# Code Style Guide

## Overview

This document outlines the coding standards and best practices for the Slickage website project. Following these guidelines ensures consistency, maintainability, and readability across the codebase.

## General Principles

### 1. Clarity and Readability
- Write code that is self-documenting
- Use descriptive variable and function names
- Prefer clarity over cleverness
- Add comments for complex logic

### 2. Consistency
- Follow established patterns in the codebase
- Use consistent formatting and naming conventions
- Maintain uniform file and folder structures

### 3. Maintainability
- Write code that is easy to modify and extend
- Avoid premature optimization
- Keep functions small and focused
- Use TypeScript for type safety

## TypeScript Guidelines

### Type Definitions
```typescript
// ✅ Good - Clear interface definition
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// ❌ Avoid - Any types
const user: any = getUser();
```

### Function Signatures
```typescript
// ✅ Good - Clear parameter types and return type
function formatUserName(user: UserProfile): string {
  return `${user.name} (${user.email})`;
}

// ✅ Good - Optional parameters with defaults
function createUser(
  name: string,
  email: string,
  avatar?: string
): UserProfile {
  return { id: generateId(), name, email, avatar };
}
```

### Component Props
```typescript
// ✅ Good - Clear interface with optional props
interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
```

## React Component Guidelines

### Component Structure
```typescript
// ✅ Good - Standard component structure
'use client';

import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui';

interface MyComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

export default function MyComponent({ 
  title, 
  description, 
  onAction 
}: MyComponentProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 rounded-lg bg-white shadow-md"
    >
      <h2 className="text-xl font-bold">{title}</h2>
      {description && (
        <p className="text-gray-600 mt-2">{description}</p>
      )}
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          Action
        </Button>
      )}
    </motion.div>
  );
}
```

### Hook Usage
```typescript
// ✅ Good - Custom hooks with clear naming
export function useImageLoader(imageUrl: string | undefined, options: UseImageLoaderOptions = {}) {
  // Implementation
}

// ✅ Good - Destructuring with defaults
const { imageUrl, isLoading, hasError } = useImageLoader(src, {
  lazy: true,
  threshold: 0.1,
  fallbackImage: '/placeholder.svg'
});
```

## File Organization

### File Naming
- Use kebab-case for file names: `lazy-image.tsx`
- Use PascalCase for component names: `LazyImage`
- Use camelCase for function and variable names: `useImageLoader`

### Folder Structure
```
src/
├── components/
│   ├── ui/           # Reusable UI components
│   ├── about/        # Feature-specific components
│   └── contact/      # Feature-specific components
├── lib/
│   ├── hooks/        # Custom React hooks
│   ├── utils/        # Utility functions
│   └── validation/   # Validation schemas
└── types/            # TypeScript type definitions
```

## Styling Guidelines

### Tailwind CSS
```typescript
// ✅ Good - Logical class grouping
className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow"

// ✅ Good - Conditional classes
className={cn(
  "base-classes",
  isActive && "active-classes",
  variant === "primary" && "primary-classes"
)}
```

### CSS Custom Properties
```css
/* ✅ Good - Use CSS custom properties for theming */
:root {
  --primary-color: #3b82f6;
  --secondary-color: #64748b;
  --border-radius: 0.5rem;
}

.component {
  color: var(--primary-color);
  border-radius: var(--border-radius);
}
```

## Error Handling

### Try-Catch Blocks
```typescript
// ✅ Good - Specific error handling
try {
  const result = await processData(data);
  return result;
} catch (error) {
  console.error('Failed to process data:', error);
  throw new Error('Data processing failed');
}
```

### Error Boundaries
```typescript
// ✅ Good - Component error boundaries
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }
}
```

## Performance Guidelines

### Memoization
```typescript
// ✅ Good - Memoize expensive calculations
const expensiveValue = useMemo(() => {
  return computeExpensiveValue(data);
}, [data]);

// ✅ Good - Memoize components
export default React.memo(function MyComponent({ data }: MyComponentProps) {
  return <div>{data}</div>;
});
```

### Lazy Loading
```typescript
// ✅ Good - Lazy load components
const LazyComponent = dynamic(() => import('./LazyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});
```

## Testing Guidelines

### Component Testing
```typescript
// ✅ Good - Test component behavior
describe('MyComponent', () => {
  it('renders with required props', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const mockAction = jest.fn();
    render(<MyComponent title="Test" onAction={mockAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(mockAction).toHaveBeenCalled();
  });
});
```

## Documentation Standards

### Inline Comments
```typescript
// ✅ Good - Explain complex logic
const processedData = rawData
  .filter(item => item.isActive) // Only process active items
  .map(item => ({
    ...item,
    processedAt: new Date().toISOString() // Add timestamp
  }));

// ✅ Good - JSDoc for functions
/**
 * Formats a user's display name
 * @param user - The user object
 * @param includeEmail - Whether to include email in the display name
 * @returns Formatted display name
 */
function formatDisplayName(user: User, includeEmail = false): string {
  // Implementation
}
```

## Common Patterns

### Event Handlers
```typescript
// ✅ Good - Proper event typing
const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
  e.preventDefault();
  onAction?.();
};

// ✅ Good - Form handlers
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  try {
    await submitForm(formData);
  } catch (error) {
    setError('Failed to submit form');
  }
};
```

### State Management
```typescript
// ✅ Good - Use appropriate state types
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string | null>(null);
const [data, setData] = useState<User[]>([]);

// ✅ Good - Complex state with useReducer
interface State {
  isLoading: boolean;
  data: User[];
  error: string | null;
}

type Action = 
  | { type: 'FETCH_START' }
  | { type: 'FETCH_SUCCESS'; payload: User[] }
  | { type: 'FETCH_ERROR'; payload: string };
```

## Best Practices Summary

1. **Use TypeScript** for type safety and better developer experience
2. **Follow React patterns** consistently across components
3. **Write self-documenting code** with clear naming
4. **Handle errors gracefully** with proper error boundaries
5. **Optimize for performance** with memoization and lazy loading
6. **Test your code** with meaningful test cases
7. **Document complex logic** with clear comments
8. **Keep components small** and focused on single responsibilities
9. **Use consistent formatting** with Prettier and ESLint
10. **Follow established patterns** in the existing codebase

## Tools and Configuration

### ESLint Configuration
- Use the provided `.eslintrc.js` configuration
- Run `bun lint` to check code quality
- Run `bun lint:fix` to auto-fix issues

### Prettier Configuration
- Use the provided `.prettierrc` configuration
- Run `bun format` to format code
- Run `bun format:check` to verify formatting

### TypeScript Configuration
- Use strict mode in `tsconfig.json`
- Run `bun run tsc --noEmit` to check types
- Avoid using `any` type unless absolutely necessary

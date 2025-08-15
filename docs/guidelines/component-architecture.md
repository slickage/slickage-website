# Component Architecture Guide

## Overview

This document outlines the component architecture patterns and design principles used in the Slickage website. Understanding these patterns helps maintain consistency and scalability across the application.

## Component Hierarchy

### 1. Page Components

Located in `src/app/` - Next.js App Router pages that define routes and layouts.

```typescript
// Example: src/app/about/page.tsx
export default function AboutPage() {
  return (
    <div>
      <AboutHero />
      <AboutStory />
      <TeamGrid />
      <JoinTeamSection />
    </div>
  );
}
```

### 2. Feature Components

Located in `src/components/[feature]/` - Feature-specific components that combine UI components.

```typescript
// Example: src/components/about/about-hero.tsx
export default function AboutHero() {
  return (
    <section className="hero-section">
      <div className="container">
        <h1>About Slickage</h1>
        <p>Boutique software development in Honolulu</p>
      </div>
    </section>
  );
}
```

### 3. UI Components

Located in `src/components/ui/` - Reusable, atomic components that form the design system.

```typescript
// Example: src/components/ui/button.tsx
export function Button({ variant, size, children, ...props }) {
  return (
    <button className={cn(buttonVariants({ variant, size }))} {...props}>
      {children}
    </button>
  );
}
```

## Component Design Patterns

### 1. Composition Pattern

Use composition to build complex components from simpler ones.

```typescript
// ✅ Good - Composition over inheritance
export default function ContactForm() {
  return (
    <form>
      <Input label="Name" required />
      <Input label="Email" type="email" required />
      <Textarea label="Message" required />
      <Button type="submit">Send Message</Button>
    </form>
  );
}
```

### 2. Container/Presentational Pattern

Separate data logic from presentation logic.

```typescript
// Container Component - Handles data and logic
export default function CaseStudyList() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCaseStudies().then(setCaseStudies);
  }, []);

  return <CaseStudyGrid caseStudies={caseStudies} isLoading={isLoading} />;
}

// Presentational Component - Handles rendering
function CaseStudyGrid({ caseStudies, isLoading }: CaseStudyGridProps) {
  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {caseStudies.map(study => (
        <CaseStudyCard key={study.id} study={study} />
      ))}
    </div>
  );
}
```

### 3. Custom Hook Pattern

Extract reusable logic into custom hooks.

```typescript
// Custom Hook - Reusable logic
export function useImageLoader(imageUrl: string | undefined, options = {}) {
  const [imageUrlState, setImageUrlState] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Image loading logic
  }, [imageUrl]);

  return { imageUrl: imageUrlState, isLoading, hasError };
}

// Component using the hook
export default function LazyImage({ src, alt, ...props }) {
  const { imageUrl, isLoading, hasError } = useImageLoader(src);

  return (
    <div>
      {isLoading && <LoadingSpinner />}
      {!isLoading && <Image src={imageUrl} alt={alt} {...props} />}
    </div>
  );
}
```

## Component Structure Guidelines

### 1. File Organization

```
src/components/
├── ui/                    # Reusable UI components
│   ├── button.tsx
│   ├── input.tsx
│   ├── card.tsx
│   └── index.ts          # Export all UI components
├── about/                 # Feature-specific components
│   ├── about-hero.tsx
│   ├── team-grid.tsx
│   └── index.ts
└── contact/              # Feature-specific components
    ├── contact-form.tsx
    ├── contact-hero.tsx
    └── index.ts
```

### 2. Component File Structure

```typescript
// 1. Imports
'use client';
import React from 'react';
import { motion } from 'motion/react';
import { Button } from '@/components/ui';

// 2. Type definitions
interface ComponentProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

// 3. Component definition
export default function Component({ title, description, onAction }: ComponentProps) {
  // 4. State and effects
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // 5. Event handlers
  const handleClick = () => {
    onAction?.();
  };

  // 6. Render
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      className="component-classes"
    >
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {onAction && <Button onClick={handleClick}>Action</Button>}
    </motion.div>
  );
}
```

## State Management Patterns

### 1. Local State

Use `useState` for component-specific state.

```typescript
export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitForm(formData);
    } finally {
      setIsSubmitting(false);
    }
  };
}
```

### 2. Shared State

Use context for state that needs to be shared across components.

```typescript
// Context definition
interface AppContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Provider component
export function AppProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  return (
    <AppContext.Provider value={{ theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook for using context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

## Performance Optimization Patterns

### 1. Memoization

Use `React.memo` for components that receive stable props.

```typescript
export default React.memo(function TeamMember({ name, role, image }: TeamMemberProps) {
  return (
    <div className="team-member">
      <Image src={image} alt={name} />
      <h3>{name}</h3>
      <p>{role}</p>
    </div>
  );
});
```

### 2. Lazy Loading

Use dynamic imports for code splitting.

```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false
});

// Lazy load with preloading
const PreloadedComponent = dynamic(() => import('./PreloadedComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: true
});
```

### 3. Virtual Scrolling

For large lists, consider virtual scrolling.

```typescript
import { FixedSizeList as List } from 'react-window';

export default function VirtualizedList({ items }: { items: Item[] }) {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ListItem item={items[index]} />
    </div>
  );

  return (
    <List
      height={400}
      itemCount={items.length}
      itemSize={50}
      width="100%"
    >
      {Row}
    </List>
  );
}
```

## Error Handling Patterns

### 1. Error Boundaries

Wrap components with error boundaries for graceful error handling.

```typescript
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

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false })}>
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### 2. Try-Catch in Async Functions

Handle errors in async operations.

```typescript
export default function DataFetcher() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const result = await fetch('/api/data');
        const json = await result.json();
        setData(json);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      }
    }

    fetchData();
  }, []);

  if (error) return <ErrorMessage message={error} />;
  if (!data) return <LoadingSpinner />;

  return <DataDisplay data={data} />;
}
```

## Accessibility Patterns

### 1. Semantic HTML

Use proper HTML elements for accessibility.

```typescript
export default function Navigation() {
  return (
    <nav aria-label="Main navigation">
      <ul role="menubar">
        <li role="none">
          <a href="/" role="menuitem">Home</a>
        </li>
        <li role="none">
          <a href="/about" role="menuitem">About</a>
        </li>
      </ul>
    </nav>
  );
}
```

### 2. Keyboard Navigation

Ensure components are keyboard accessible.

```typescript
export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      tabIndex={-1}
      className="modal-overlay"
      onClick={onClose}
    >
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}
```

## Testing Patterns

### 1. Component Testing

Test component behavior and user interactions.

```typescript
describe('ContactForm', () => {
  it('submits form data correctly', async () => {
    const mockSubmit = jest.fn();
    render(<ContactForm onSubmit={mockSubmit} />);

    fireEvent.change(screen.getByLabelText('Name'), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'user@example.com' }
    });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'user@example.com'
      });
    });
  });
});
```

### 2. Hook Testing

Test custom hooks in isolation.

```typescript
describe('useImageLoader', () => {
  it('loads image successfully', async () => {
    const { result } = renderHook(() => useImageLoader('/test-image.jpg'));

    expect(result.current.isLoading).toBe(true);

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.imageUrl).toBe('/test-image.jpg');
  });
});
```

## Best Practices Summary

1. **Keep components small and focused** on single responsibilities
2. **Use composition** over inheritance for component reuse
3. **Extract reusable logic** into custom hooks
4. **Handle errors gracefully** with error boundaries
5. **Optimize for performance** with memoization and lazy loading
6. **Ensure accessibility** with semantic HTML and keyboard navigation
7. **Test components thoroughly** with meaningful test cases
8. **Follow consistent naming** and file organization patterns
9. **Document complex components** with clear comments and examples
10. **Use TypeScript** for better type safety and developer experience

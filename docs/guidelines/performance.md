# Performance Guidelines

## Overview

This document outlines performance optimization practices and guidelines for the Slickage website project. The guidelines focus on Next.js best practices, image optimization, and component performance to ensure fast loading times and smooth user experiences.

## Core Performance Principles

### 1. Core Web Vitals

- **LCP (Largest Contentful Paint)**: Optimize above-the-fold content loading
- **FID (First Input Delay)**: Ensure interactive elements respond quickly
- **CLS (Cumulative Layout Shift)**: Prevent layout shifts during page load

### 2. Progressive Enhancement

- Load critical content first
- Enhance with non-essential features progressively
- Graceful degradation for slower connections

### 3. Resource Optimization

- Minimize bundle sizes
- Optimize images and assets
- Implement efficient caching strategies

## Next.js Performance Features

### 1. Built-in Image Optimization

The project leverages Next.js Image component for automatic optimization:

```tsx
import Image from 'next/image';

export default function OptimizedImage() {
  return (
    <Image
      src="/images/hero.jpg"
      alt="Hero image"
      width={800}
      height={600}
      priority={true} // For above-the-fold images
      className="w-full h-auto"
    />
  );
}
```

**Key Benefits:**

- Automatic WebP/AVIF conversion
- Responsive image generation
- Lazy loading for below-the-fold images
- Automatic priority handling

### 2. Automatic Code Splitting

Next.js automatically splits code by route and component:

```tsx
// Lazy load heavy components
import dynamic from 'next/dynamic';

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: false, // Disable SSR for client-only components
});

// Preload critical components
const CriticalComponent = dynamic(() => import('./CriticalComponent'), {
  loading: () => <LoadingSpinner />,
  ssr: true, // Enable SSR for SEO-critical components
});
```

### 3. Route Optimization

The project uses route groups and file disabling to optimize builds:

```typescript
// Route structure optimization
src/app/
├── (unused-routes)/          # Route group - not included in build
│   ├── about/
│   │   └── page.tsx.disabled # Disabled to prevent build inclusion
│   └── projects/
│       └── page.tsx.disabled
├── api/                      # Active API routes
├── contact/                  # Active contact page
└── case-studies/            # Active case studies
```

## Image Performance Optimization

### 1. Lazy Loading Implementation

The project implements comprehensive lazy loading using Next.js best practices:

```tsx
// LazyImage component with automatic optimization
export default function LazyImage({
  src,
  alt,
  priority = false,
  className = '',
  ...imageProps
}: LazyImageProps) {
  const { imageUrl, isLoading, hasError } = useImageLoader(src, {
    placeholderImage: '/placeholder.svg',
  });

  // Auto-set priority for placeholder images to fix LCP warning
  const isPlaceholderImage = imageUrl === '/placeholder.svg';
  const finalPriority = isPlaceholderImage ? true : priority;

  return (
    <div className="relative">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <LoadingSpinner size="md" />
        </div>
      )}

      <Image
        src={imageUrl}
        alt={alt}
        className={`transition-opacity duration-300 ${className}`}
        priority={finalPriority}
        loading={finalPriority ? 'eager' : 'lazy'}
        {...imageProps}
      />
    </div>
  );
}
```

### 2. S3 Image Optimization

Efficient S3 image loading with presigned URLs:

```typescript
// Optimized S3 image loading
export async function getS3ImageUrl(
  path: string,
  fallbackUrl: string = '/placeholder.svg',
): Promise<string> {
  if (!path || path === '/placeholder.svg' || path === fallbackUrl) {
    return fallbackUrl;
  }

  try {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const response = await fetch(`/api/s3-url?key=${encodeURIComponent(normalizedPath)}`);

    if (!response.ok) {
      return fallbackUrl;
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    return fallbackUrl;
  }
}
```

### 3. Image Loading Strategies

```typescript
// useImageLoader hook for optimized image loading
export function useImageLoader(imageUrl: string | undefined, options: UseImageLoaderOptions = {}) {
  const [imageUrlState, setImageUrlState] = useState<string>(
    options.placeholderImage || '/placeholder.svg',
  );
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const loadImage = useCallback(
    async (url: string) => {
      if (!url || url === '/placeholder.svg') {
        setImageUrlState('/placeholder.svg');
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setHasError(false);

      try {
        const processedUrl = await getS3ImageUrl(url);
        setImageUrlState(processedUrl);
      } catch (error) {
        setImageUrlState(options.placeholderImage || '/placeholder.svg');
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [options.placeholderImage],
  );

  useEffect(() => {
    if (imageUrl !== undefined) {
      loadImage(imageUrl);
    }
  }, [imageUrl, loadImage]);

  return { imageUrl: imageUrlState, isLoading, hasError };
}
```

## Component Performance Optimization

### 1. React.memo for Stable Components

Use React.memo for components that receive stable props:

```tsx
// Memoized team member component
export default React.memo(function TeamMember({ name, role, image }: TeamMemberProps) {
  return (
    <div className="team-member">
      <LazyImage
        src={image}
        alt={name}
        width={128}
        height={128}
        className="rounded-full"
        showLoadingSpinner={false}
      />
      <h3 className="text-lg font-semibold">{name}</h3>
      <p className="text-gray-600">{role}</p>
    </div>
  );
});
```

### 2. Custom Hook Optimization

Optimize custom hooks with useCallback and useMemo:

```tsx
// Optimized useRecaptcha hook
export function useRecaptcha(options?: UseRecaptchaOptions) {
  const { config, error: configError } = useClientConfig('recaptcha');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadRecaptcha = useCallback(() => {
    if (isLoaded) return; // Prevent duplicate loads

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${config.siteKey}`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.grecaptcha) {
        window.grecaptcha.ready(() => setIsLoaded(true));
      }
    };

    document.head.appendChild(script);
  }, [config.siteKey, isLoaded]);

  // Strategy-based loading
  useEffect(() => {
    const strategy: RecaptchaLoadStrategy = options?.strategy || 'immediate';

    if (strategy === 'in-viewport' && options?.triggerRef?.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              loadRecaptcha();
              observer.disconnect();
              break;
            }
          }
        },
        { threshold: 0.1 },
      );

      observer.observe(options.triggerRef.current);
      return () => observer.disconnect();
    } else {
      // Immediate load
      const timeoutId = setTimeout(loadRecaptcha, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [loadRecaptcha, options?.strategy, options?.triggerRef]);

  return { siteKey: config?.siteKey, isEnabled: config?.enabled, isLoaded, error };
}
```

### 3. Event Handler Optimization

Optimize event handlers to prevent unnecessary re-renders:

```tsx
// Optimized contact form with stable handlers
export default function ContactForm({ standalone = false }: ContactFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    website: '',
  });

  // Memoized handlers
  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;

      if (name === 'phone') {
        const formattedPhone = formatPhoneNumber(value);
        setFormData((prev) => ({ ...prev, [name]: formattedPhone }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: value }));
      }
    },
    [],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      // ... submission logic
    },
    [formData, startTime, isEnabled, siteKey, recaptchaLoaded],
  );

  return (
    <form onSubmit={handleSubmit} onChange={handleChange}>
      {/* Form fields */}
    </form>
  );
}
```

## Bundle Size Optimization

### 1. Tree Shaking

Ensure proper tree shaking by using named exports:

```typescript
// Good: Named exports for tree shaking
export { Button } from './button';
export { Card, CardHeader, CardContent } from './card';
export { Input } from './input';
export { Label } from './label';

// Avoid: Default exports that can't be tree shaken
export default Button; // ❌
```

### 2. Dynamic Imports

Use dynamic imports for code splitting:

```tsx
// Dynamic imports for heavy components
const ImageLightbox = dynamic(() => import('./ImageLightbox'), {
  loading: () => <LoadingSpinner size="sm" />,
  ssr: false,
});

const ProjectCarousel = dynamic(() => import('./ProjectCarousel'), {
  loading: () => <LoadingSpinner />,
  ssr: true,
});
```

### 3. Library Optimization

Choose lightweight alternatives and optimize imports:

```typescript
// Optimize icon imports
import { Send, Mail, Phone, MapPin } from 'lucide-react';

// Instead of importing entire icon library
import * as Icons from 'lucide-react'; // ❌
```

## Caching Strategies

### 1. Static Generation

Leverage Next.js static generation for performance:

```typescript
// Static generation for case studies
export async function generateStaticParams() {
  const caseStudies = getAllCaseStudies();

  return caseStudies.map((study) => ({
    id: study.id,
  }));
}

// Revalidate every hour
export const revalidate = 3600;
```

### 2. API Response Caching

Implement caching for API responses:

```typescript
// Cache S3 presigned URLs
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');

    if (!key) {
      return NextResponse.json({ error: 'No key provided' }, { status: 400 });
    }

    const bucketName = env.S3_BUCKET_URL.split('.')[0];
    const command = new GetObjectCommand({
      Bucket: bucketName,
      Key: key,
    });

    // Generate presigned URL with 1-hour expiration
    const url = await getSignedUrl(s3, command, { expiresIn: 3600 });

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate URL' }, { status: 500 });
  }
}
```

### 3. Browser Caching

Optimize browser caching with proper headers:

```typescript
// Next.js config for static asset caching
const nextConfig = {
  async headers() {
    return [
      {
        source: '/images/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/s3-url',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, s-maxage=3600',
          },
        ],
      },
    ];
  },
};
```

## Performance Monitoring

### 1. Core Web Vitals Monitoring

Monitor performance metrics in production:

```typescript
// Performance monitoring hook
export function usePerformanceMonitoring() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      // Monitor LCP
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        console.log('LCP:', lastEntry.startTime);
      });

      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Monitor FID
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          console.log('FID:', entry.processingStart - entry.startTime);
        });
      });

      fidObserver.observe({ entryTypes: ['first-input'] });

      return () => {
        lcpObserver.disconnect();
        fidObserver.disconnect();
      };
    }
  }, []);
}
```

### 2. Bundle Analysis

Regular bundle analysis to identify optimization opportunities:

```json
{
  "scripts": {
    "analyze": "ANALYZE=true bun run build",
    "bundle-report": "bunx @next/bundle-analyzer .next/analyze"
  }
}
```

## Best Practices Summary

### 1. Image Optimization

- Use Next.js Image component for automatic optimization
- Implement lazy loading for below-the-fold images
- Set priority for above-the-fold images
- Use appropriate image formats (WebP, AVIF)

### 2. Component Optimization

- Use React.memo for stable components
- Optimize event handlers with useCallback
- Implement proper loading states
- Avoid unnecessary re-renders

### 3. Bundle Optimization

- Leverage Next.js automatic code splitting
- Use dynamic imports for heavy components
- Implement proper tree shaking
- Monitor bundle sizes regularly

### 4. Caching Strategy

- Use static generation where possible
- Implement appropriate cache headers
- Cache API responses when appropriate
- Use CDN for static assets

### 5. Performance Monitoring

- Monitor Core Web Vitals
- Track bundle sizes
- Analyze performance regressions
- Set performance budgets

## Performance Checklist

### Development

- [ ] Use Next.js Image component for all images
- [ ] Implement lazy loading for below-the-fold content
- [ ] Use React.memo for stable components
- [ ] Optimize event handlers with useCallback
- [ ] Implement proper loading states

### Build

- [ ] Enable tree shaking
- [ ] Use dynamic imports for heavy components
- [ ] Optimize bundle splitting
- [ ] Implement proper caching headers

### Monitoring

- [ ] Track Core Web Vitals
- [ ] Monitor bundle sizes
- [ ] Analyze performance regressions
- [ ] Set performance budgets

### Optimization

- [ ] Optimize images and assets
- [ ] Implement efficient caching
- [ ] Use CDN for static content
- [ ] Monitor and optimize API performance

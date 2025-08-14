# Lazy Loading Implementation

This document describes the lazy loading implementation for images throughout the application, now using Next.js best practices.

## Overview

The lazy loading system has been refactored to use Next.js's built-in lazy loading capabilities while maintaining enhanced functionality:

1. **Simplified `useImageLoader` Hook** - Core image processing and error handling
2. **`LazyImage` Component** - Basic lazy loading image component using Next.js Image
3. **`LazyImageLightbox` Component** - Lazy loading image with lightbox functionality

## Components

### useImageLoader Hook

The simplified `useImageLoader` hook now focuses on S3 URL processing and error handling:

```typescript
interface UseImageLoaderOptions {
  defaultImage?: string;
  fallbackImage?: string;
}
```

**Returns:**

- `imageUrl` - The processed image URL
- `isLoading` - Loading state
- `hasError` - Error state

### LazyImage Component

A lazy loading image component that leverages Next.js's built-in lazy loading with enhanced loading states and error handling.

```tsx
import { LazyImage } from '@/components/ui';

<LazyImage
  src="path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  showLoadingSpinner={true}
  fallbackImage="/placeholder.svg"
  className="rounded-lg"
  containerClassName="relative"
  onLoad={() => console.log('Image loaded')}
  onError={() => console.log('Image failed to load')}
/>;
```

**Props:**

- `src` - Image source URL
- `alt` - Alt text (required)
- `showLoadingSpinner` - Show loading spinner (default: true)
- `fallbackImage` - Fallback image URL (default: "/placeholder.svg")
- `className` - CSS classes for the image
- `containerClassName` - CSS classes for the container
- `onLoad` - Callback when image loads
- `onError` - Callback when image fails to load
- All standard Next.js Image props

**Next.js Lazy Loading Features:**

- **Automatic lazy loading** - Uses `loading="lazy"` for below-the-fold images
- **Priority loading** - Uses `loading="eager"` for above-the-fold images
- **Built-in optimization** - Automatic WebP/AVIF conversion and responsive images
- **Performance optimization** - Next.js handles viewport detection automatically

### LazyImageLightbox Component

A lazy loading image component with lightbox functionality for expanded viewing.

```tsx
import { LazyImageLightbox } from '@/components/ui';

<LazyImageLightbox
  src="path/to/image.jpg"
  alt="Description"
  width={900}
  height={500}
  showLoadingSpinner={true}
  fallbackImage="/placeholder.svg"
  className="rounded-lg"
  containerClassName="relative"
  modalClassName="backdrop-blur-sm"
/>;
```

**Additional Props:**

- `modalClassName` - CSS classes for the lightbox modal
- All props from LazyImage component

## Usage Examples

### Basic Lazy Loading

```tsx
import { LazyImage } from '@/components/ui';

function MyComponent() {
  return (
    <LazyImage
      src="/images/hero.jpg"
      alt="Hero image"
      width={1200}
      height={600}
      className="w-full h-auto"
    />
  );
}
```

### Hero Images (Priority Loading)

```tsx
<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={0}
  height={0}
  sizes="100vw"
  priority={true}
  showLoadingSpinner={false}
  className="object-cover w-full h-full"
/>
```

### Gallery Images (Automatic Lazy Loading)

```tsx
<LazyImage
  src="/images/gallery.jpg"
  alt="Gallery image"
  width={400}
  height={300}
  showLoadingSpinner={true}
  fallbackImage="/custom-placeholder.svg"
  onLoad={() => console.log('Image loaded successfully')}
  onError={() => console.log('Image failed to load')}
/>
```

### Lightbox Images

```tsx
import { LazyImageLightbox } from '@/components/ui';

<LazyImageLightbox
  src="/images/case-study.jpg"
  alt="Case study screenshot"
  width={900}
  height={500}
  className="object-fill w-full h-auto"
  modalClassName="backdrop-blur-md"
/>;
```

### Using Fill Prop

When using the `fill` prop, ensure the parent container has a defined height:

```tsx
// ✅ Good - Parent container has defined height
<div className="relative w-28 h-28 overflow-hidden rounded-full">
  <LazyImage
    src="/images/avatar.jpg"
    alt="User avatar"
    fill
    className="object-cover"
  />
</div>

// ✅ Good - Using aspect ratio container
<div className="relative aspect-video">
  <LazyImage
    src="/images/hero.jpg"
    alt="Hero image"
    fill
    className="object-cover"
  />
</div>

// ❌ Avoid - No height defined
<div className="relative">
  <LazyImage
    src="/images/hero.jpg"
    alt="Hero image"
    fill
    className="object-cover"
  />
</div>
```

## Performance Benefits

1. **Next.js Built-in Optimization** - Automatic lazy loading, WebP/AVIF conversion, and responsive images
2. **Reduced Bundle Size** - No custom intersection observer code
3. **Better Performance** - Framework-level optimizations
4. **Automatic Viewport Detection** - Next.js handles when to load images
5. **SEO Friendly** - Proper alt text and semantic markup maintained
6. **LCP Optimization** - Automatic priority handling for above-the-fold content

## LCP (Largest Contentful Paint) Optimization

The lazy loading components automatically optimize for LCP performance:

### Automatic Priority Handling

- **Placeholder Images** - Automatically set `priority={true}` for placeholder images
- **Above-the-Fold Images** - Use `priority={true}` for critical images
- **Below-the-Fold Images** - Automatic lazy loading with `loading="lazy"`

### Best Practices for LCP

```tsx
// ✅ Good - Above-the-fold images with priority
<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  priority={true}
  className="object-cover w-full h-full"
/>

// ✅ Good - Placeholder images automatically get priority
<LazyImage
  src="/placeholder.svg"
  alt="Placeholder"
  // priority automatically set to true
/>

// ✅ Good - Below-the-fold images with automatic lazy loading
<LazyImage
  src="/images/gallery.jpg"
  alt="Gallery image"
  priority={false}
  // loading="lazy" automatically applied
/>
```

## Next.js Lazy Loading Features

### Automatic Loading Behavior

- **Above-the-fold images** - Load immediately with `loading="eager"`
- **Below-the-fold images** - Load when entering viewport with `loading="lazy"`
- **Priority images** - Always load immediately regardless of position

### Built-in Optimizations

- **Format conversion** - Automatic WebP/AVIF when supported
- **Responsive images** - Automatic `srcset` generation
- **Quality optimization** - Automatic quality adjustments
- **Placeholder support** - Built-in blur placeholder generation

## Migration Guide

### From Custom Lazy Loading

**Before (Custom Implementation):**

```tsx
<LazyImage
  src={src}
  alt={alt}
  lazy={true}
  threshold={0.1}
  rootMargin="50px"
/>
```

**After (Next.js Built-in):**

```tsx
<LazyImage
  src={src}
  alt={alt}
  // Next.js handles lazy loading automatically
/>
```

### From Next.js Image

**Before:**

```tsx
import Image from 'next/image';

<Image src={src} alt={alt} width={400} height={300} />;
```

**After:**

```tsx
import { LazyImage } from '@/components/ui';

<LazyImage
  src={src}
  alt={alt}
  width={400}
  height={300}
  // Enhanced loading states and error handling
/>;
```

## Best Practices

1. **Hero Images** - Use `priority={true}` for above-the-fold images
2. **Gallery Images** - Let Next.js handle lazy loading automatically
3. **Thumbnails** - Use standard lazy loading with appropriate sizes
4. **Large Images** - Leverage Next.js's automatic optimization
5. **Error Handling** - Always provide meaningful fallback images
6. **Accessibility** - Ensure proper alt text for all images
7. **Fill Prop Usage** - Always ensure parent container has defined height when using `fill`

## Troubleshooting

### Common Issues

#### 1. Fill Prop Height Error

**Error:** "Image with src has 'fill' and a height value of 0"

**Solution:** Ensure the parent container has a defined height:

```tsx
// ✅ Correct usage
<div className="relative w-full h-64">
  <LazyImage src="/image.jpg" alt="Description" fill className="object-cover" />
</div>
```

#### 2. Images Not Loading

- Check if the image URL is valid
- Verify S3 credentials and permissions
- Check browser console for network errors
- Ensure fallback image exists

#### 3. Performance Issues

- Use `priority={true}` for critical above-the-fold images
- Let Next.js handle lazy loading automatically
- Ensure proper image dimensions and formats

#### 4. Loading Spinner Not Showing

- Ensure `showLoadingSpinner={true}` (default)
- Check if LoadingSpinner component is properly imported
- Verify CSS classes are not hiding the spinner

## Browser Support

The lazy loading implementation now uses Next.js's built-in lazy loading, which is supported in:

- Chrome 76+
- Firefox 75+
- Safari 15.4+
- Edge 79+

For older browsers, Next.js automatically falls back to immediate loading.

## Benefits of Next.js Built-in Lazy Loading

1. **Framework Integration** - Seamless integration with Next.js ecosystem
2. **Automatic Optimization** - WebP/AVIF conversion, responsive images
3. **Performance Monitoring** - Built-in performance metrics
4. **SEO Optimization** - Automatic image optimization for search engines
5. **Accessibility** - Built-in accessibility features
6. **Maintenance** - No custom code to maintain or debug

# Lazy Loading Implementation

This document describes the lazy loading implementation for images throughout the application.

## Overview

The lazy loading system consists of three main components:

1. **Enhanced `useImageLoader` Hook** - Core lazy loading logic with Intersection Observer
2. **`LazyImage` Component** - Basic lazy loading image component
3. **`LazyImageLightbox` Component** - Lazy loading image with lightbox functionality

## Components

### useImageLoader Hook

The enhanced `useImageLoader` hook now supports lazy loading with the following options:

```typescript
interface UseImageLoaderOptions {
  defaultImage?: string;
  fallbackImage?: string;
  lazy?: boolean;           // Enable/disable lazy loading
  threshold?: number;        // Intersection Observer threshold (0-1)
  rootMargin?: string;      // Intersection Observer root margin
}
```

**Returns:**
- `imageUrl` - The processed image URL
- `isLoading` - Loading state
- `isInView` - Whether the image is in viewport
- `hasError` - Error state
- `imageRef` - Ref for the container element

### LazyImage Component

A basic lazy loading image component with loading states and error handling.

```tsx
import { LazyImage } from '@/components/ui';

<LazyImage
  src="path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  lazy={true}
  threshold={0.1}
  rootMargin="50px"
  showLoadingSpinner={true}
  fallbackImage="/placeholder.svg"
  className="rounded-lg"
  containerClassName="relative"
  onLoad={() => console.log('Image loaded')}
  onError={() => console.log('Image failed to load')}
/>
```

**Props:**
- `src` - Image source URL
- `alt` - Alt text (required)
- `lazy` - Enable lazy loading (default: true)
- `threshold` - Intersection Observer threshold (default: 0.1)
- `rootMargin` - Intersection Observer root margin (default: "50px")
- `fallbackImage` - Fallback image URL (default: "/placeholder.svg")
- `showLoadingSpinner` - Show loading spinner (default: true)
- `className` - CSS classes for the image
- `containerClassName` - CSS classes for the container
- `onLoad` - Callback when image loads
- `onError` - Callback when image fails to load
- All standard Next.js Image props

### LazyImageLightbox Component

A lazy loading image component with lightbox functionality for expanded viewing.

```tsx
import { LazyImageLightbox } from '@/components/ui';

<LazyImageLightbox
  src="path/to/image.jpg"
  alt="Description"
  width={400}
  height={300}
  lazy={true}
  threshold={0.1}
  rootMargin="50px"
  showLoadingSpinner={true}
  fallbackImage="/placeholder.svg"
  className="rounded-lg"
  containerClassName="relative"
  modalClassName="backdrop-blur-sm"
/>
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

### Lazy Loading with Custom Settings

```tsx
<LazyImage
  src="/images/gallery.jpg"
  alt="Gallery image"
  width={400}
  height={300}
  lazy={true}
  threshold={0.5}        // Load when 50% visible
  rootMargin="100px"     // Start loading 100px before entering viewport
  showLoadingSpinner={false}
  fallbackImage="/custom-placeholder.svg"
  onLoad={() => console.log('Image loaded successfully')}
  onError={() => console.log('Image failed to load')}
/>
```

### Hero Images (No Lazy Loading)

```tsx
<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  width={0}
  height={0}
  sizes="100vw"
  priority={true}
  lazy={false}           // Disable lazy loading for hero images
  showLoadingSpinner={false}
  className="object-cover w-full h-full"
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
  lazy={true}
  threshold={0.1}
  rootMargin="100px"
  className="object-fill w-full h-auto"
  modalClassName="backdrop-blur-md"
/>
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

1. **Reduced Initial Load Time** - Images only load when they're about to enter the viewport
2. **Bandwidth Savings** - Users don't download images they don't see
3. **Better User Experience** - Smooth loading with placeholders and spinners
4. **SEO Friendly** - Proper alt text and semantic markup maintained
5. **LCP Optimization** - Automatic priority handling for placeholder images and above-the-fold content

## LCP (Largest Contentful Paint) Optimization

The lazy loading components automatically optimize for LCP performance:

### Automatic Priority Handling
- **Placeholder Images** - Automatically set `priority={true}` for placeholder images
- **Above-the-Fold Cards** - First 3 insight cards get priority loading
- **Hero Images** - Use `lazy={false}` and `priority={true}` for critical images

### Best Practices for LCP
```tsx
// ✅ Good - Above-the-fold images with priority
<LazyImage
  src="/images/hero.jpg"
  alt="Hero image"
  priority={true}
  lazy={false}
  className="object-cover w-full h-full"
/>

// ✅ Good - Placeholder images automatically get priority
<LazyImage
  src="/placeholder.svg"
  alt="Placeholder"
  // priority automatically set to true
/>

// ✅ Good - Below-the-fold images with lazy loading
<LazyImage
  src="/images/gallery.jpg"
  alt="Gallery image"
  lazy={true}
  priority={false}
  threshold={0.1}
/>
```

## Configuration Options

### Threshold Values
- `0.0` - Load as soon as any part enters viewport
- `0.1` - Load when 10% visible (default)
- `0.5` - Load when 50% visible
- `1.0` - Load when fully visible

### Root Margin Values
- `"0px"` - No margin
- `"50px"` - Start loading 50px before entering viewport (default)
- `"100px"` - Start loading 100px before entering viewport
- `"50px 0px"` - Only top/bottom margin

## Migration Guide

### From useImageLoader Hook

**Before:**
```tsx
const { imageUrl, isLoading } = useImageLoader(src);
// Manual loading state handling
```

**After:**
```tsx
<LazyImage
  src={src}
  alt={alt}
  // Automatic loading state handling
/>
```

### From Next.js Image

**Before:**
```tsx
import Image from 'next/image';

<Image
  src={src}
  alt={alt}
  width={400}
  height={300}
/>
```

**After:**
```tsx
import { LazyImage } from '@/components/ui';

<LazyImage
  src={src}
  alt={alt}
  width={400}
  height={300}
  lazy={true}  // Enable lazy loading
/>
```

## Best Practices

1. **Hero Images** - Use `lazy={false}` and `priority={true}` for above-the-fold images
2. **Gallery Images** - Use `lazy={true}` with appropriate threshold values
3. **Thumbnails** - Use smaller threshold values (0.1-0.3) for faster loading
4. **Large Images** - Use larger root margin values for smoother experience
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
  <LazyImage
    src="/image.jpg"
    alt="Description"
    fill
    className="object-cover"
  />
</div>
```

#### 2. Images Not Loading
- Check if the image URL is valid
- Verify S3 credentials and permissions
- Check browser console for network errors
- Ensure fallback image exists

#### 3. Performance Issues
- Adjust threshold values for better loading timing
- Use appropriate root margin for your use case
- Consider disabling lazy loading for critical above-the-fold images

#### 4. Loading Spinner Not Showing
- Ensure `showLoadingSpinner={true}` (default)
- Check if LoadingSpinner component is properly imported
- Verify CSS classes are not hiding the spinner

## Browser Support

The lazy loading implementation uses the Intersection Observer API, which is supported in:
- Chrome 51+
- Firefox 55+
- Safari 12.1+
- Edge 15+

For older browsers, the components gracefully fall back to immediate loading.

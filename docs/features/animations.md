# Animations System

This document describes the animation system used throughout the Slickage website, which provides consistent, performant animations with automatic reduced motion support.

## Overview

The animation system is centralized in `src/lib/animations.ts` and provides:

- **Motion React Integration**: Uses `motion/react` (not framer-motion) for all animations
- **Automatic Accessibility**: Respects user's `prefersReducedMotion` preference
- **Performance Optimized**: Focuses on transform/opacity properties for hardware acceleration
- **Consistent API**: Simple hooks for getting variants and transitions
- **Lazy Loading**: Motion features are loaded only when needed via `LazyMotionWrapper`

## Architecture

### Core Components

1. **`LazyMotionWrapper`** - Wraps the entire app to provide motion features
2. **`AnimatedSection`** - High-level component for page section animations
3. **`useMotionVariant`** - Hook to get motion-aware animation variants
4. **`useMotionTransition`** - Hook to get appropriate transition timing

### Motion Library

The project uses **Motion React** (`motion/react`) instead of Framer Motion, providing:
- Smaller bundle size
- Better tree-shaking
- Modern React patterns
- Same animation API

## Available Animation Variants

### Basic Variants

| Variant      | Description                | Properties                    | Best For              |
| ------------ | -------------------------- | ----------------------------- | --------------------- |
| `fade`       | Simple opacity transition  | `opacity: 0 → 1`             | Basic content reveals |
| `slideUp`    | Slide up from below        | `opacity: 0→1, y: 20→0`      | Content entrances     |
| `slideDown`  | Slide down from above      | `opacity: 0→1, y: -20→0`     | Dropdowns, modals     |
| `slideLeft`  | Slide in from right        | `opacity: 0→1, x: 20→0`      | Side panels           |
| `slideRight` | Slide in from left         | `opacity: 0→1, x: -20→0`     | Navigation menus      |

### Interactive Variants

| Variant      | Description                | Properties                    | Best For              |
| ------------ | -------------------------- | ----------------------------- | --------------------- |
| `card`       | Card with hover effects    | `opacity, y, scale, hover`   | Cards, tiles          |
| `image`      | Image with hover lift      | `opacity, y, hover`           | Images, galleries     |
| `modal`      | Modal entrance/exit        | `opacity, scale, y`           | Dialogs, overlays     |
| `tag`        | Tag with hover effects     | `opacity, scale, hover`       | Tags, badges          |

## Available Transitions

| Transition        | Type   | Properties                    | Best For              |
| ----------------- | ------ | ----------------------------- | --------------------- |
| `fade`            | tween  | `duration: 0.3s, easeOut`    | Simple transitions    |
| `modal`           | spring | `stiffness: 300, damping: 30`| Modal animations      |
| `contentEntrance` | spring | `stiffness: 100, damping: 30`| Page content          |
| `image`           | spring | `stiffness: 250, damping: 25`| Image interactions    |
| `card`            | spring | `stiffness: 300, damping: 20`| Card animations      |
| `tag`             | spring | `stiffness: 400, damping: 25`| Tag interactions     |

## Usage Examples

### 1. Basic Component Animation

```tsx
import { m } from 'motion/react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

function MyComponent() {
  const cardVariants = useMotionVariant('card');
  const transition = useMotionTransition('card');

  return (
    <m.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={transition}
    >
      Content
    </m.div>
  );
}
```

### 2. Interactive Elements with Hover

```tsx
import { m } from 'motion/react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

function InteractiveCard() {
  const cardVariants = useMotionVariant('card');
  const transition = useMotionTransition('card');

  return (
    <m.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      transition={transition}
      style={{ willChange: 'transform' }}
    >
      Hover me
    </m.div>
  );
}
```

### 3. Page Section Animations

```tsx
import AnimatedSection from '@/components/ui/AnimatedSection';

function MyPage() {
  return (
    <main>
      <AnimatedSection variant="slideUp">
        <HeroSection />
      </AnimatedSection>
      
      <AnimatedSection variant="slideUp">
        <ContentSection />
      </AnimatedSection>
    </main>
  );
}
```

### 4. Image Lightbox with Modal Animations

```tsx
import { m, AnimatePresence } from 'motion/react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

function ImageModal({ isOpen, onClose }) {
  const modalVariants = useMotionVariant('modal');
  const modalTransition = useMotionTransition('modal');

  return (
    <AnimatePresence>
      {isOpen && (
        <m.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          transition={modalTransition}
          style={{ willChange: 'transform, opacity' }}
        >
          Modal content
        </m.div>
      )}
    </AnimatePresence>
  );
}
```

### 5. List Items with Stagger

```tsx
import { m } from 'motion/react';
import { useMotionVariant, useMotionTransition } from '@/lib/animations';

function AnimatedList({ items }) {
  const cardVariants = useMotionVariant('card');
  const transition = useMotionTransition('card');

  return (
    <div>
      {items.map((item, index) => (
        <m.div
          key={item.id}
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{
            ...transition,
            delay: index * 0.1, // Stagger effect
          }}
        >
          {item.content}
        </m.div>
      ))}
    </div>
  );
}
```

## Accessibility Features

### Reduced Motion Support

All animations automatically adapt to user preferences:

- **Normal Motion**: Full spring-based animations with smooth transitions
- **Reduced Motion**: Simple opacity transitions with minimal movement
- **Automatic Detection**: Uses `useReducedMotion()` hook from Motion React

### Performance Optimizations

- **Hardware Acceleration**: Uses `willChange: 'transform, opacity'` for GPU acceleration
- **Efficient Properties**: Focuses on transform and opacity for smooth animations
- **Lazy Loading**: Motion features loaded only when needed
- **Viewport Detection**: `whileInView` for scroll-triggered animations

## Best Practices

### 1. Use the Right Hooks

```tsx
// ✅ Good - Selective loading
const cardVariants = useMotionVariant('card');
const transition = useMotionTransition('card');

// ❌ Avoid - Loading all variants
const allVariants = useMotionVariants();
```

### 2. Consistent State Names

```tsx
// ✅ Good - Standard states
<m.div initial="hidden" animate="visible" exit="exit">
  Content
</m.div>

// ❌ Avoid - Custom state names
<m.div initial="initial" animate="animate">
  Content
</m.div>
```

### 3. Performance Optimization

```tsx
// ✅ Good - Hardware acceleration
<m.div style={{ willChange: 'transform' }}>
  Content
</m.div>

// ✅ Good - Efficient properties
variants={{
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}}
```

### 4. Viewport Animations

```tsx
// ✅ Good - Scroll-triggered with performance
<m.div
  whileInView="visible"
  viewport={{ once: true, margin: '-50px' }}
  initial="hidden"
>
  Content
</m.div>
```

## Component Integration

### AnimatedSection Component

The `AnimatedSection` component provides a high-level interface for page animations:

```tsx
interface AnimatedSectionProps {
  children: React.ReactNode;
  variant?: 'fadeIn' | 'slideUp' | 'slideDown' | 'slideLeft' | 'slideRight';
  delay?: number;
  duration?: number;
  className?: string;
}
```

**Features:**
- Automatic viewport detection
- Configurable delays and durations
- Performance optimizations
- Consistent animation behavior

### LazyMotionWrapper

Wraps the entire application to provide motion features:

```tsx
// In layout.tsx
<LazyMotionWrapper>
  <Header />
  {children}
  <Footer />
</LazyMotionWrapper>
```

**Benefits:**
- Motion features loaded only when needed
- Better initial page load performance
- Automatic tree-shaking
- Modern React patterns

## Troubleshooting

### Common Issues

1. **Animations not working**: Ensure `LazyMotionWrapper` is wrapping your app
2. **Performance issues**: Check for `willChange` styles and efficient properties
3. **Reduced motion not respected**: Verify `useReducedMotion()` is being used
4. **Bundle size concerns**: Motion features are lazy-loaded and tree-shaken

### Debugging Tips

- Use browser dev tools to check for `willChange` styles
- Verify motion variants are being applied correctly
- Check console for any motion-related errors
- Test with reduced motion preferences enabled

## Migration Notes

### From Framer Motion

The API is nearly identical to Framer Motion:

```tsx
// Old (Framer Motion)
import { motion } from 'framer-motion';

// New (Motion React)
import { m } from 'motion/react';
```

### From Custom Animations

Replace custom animation logic with the standardized system:

```tsx
// Old - Custom animations
const customVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0 }
};

// New - Standardized system
const variants = useMotionVariant('slideUp');
const transition = useMotionTransition('contentEntrance');
```

## Future Enhancements

Potential improvements for the animation system:

1. **Gesture Support**: Add drag, pinch, and swipe animations
2. **Layout Animations**: Automatic layout transition animations
3. **Spring Physics**: More sophisticated spring configurations
4. **Animation Orchestration**: Better control over animation sequences
5. **Performance Monitoring**: Track animation performance metrics

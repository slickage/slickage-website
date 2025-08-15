import { useState, useEffect, useCallback } from 'react';

interface UseScrollPositionOptions {
  threshold?: number;
  debounceMs?: number;
}

export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const { threshold = 0, debounceMs = 16 } = options;
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  // Memoize the scroll handler to prevent recreation on every render
  const handleScroll = useCallback(() => {
    const currentScrollY = window.scrollY;

    // Only update state if values actually changed
    setScrollY((prev) => {
      if (Math.abs(prev - currentScrollY) > 1) {
        return currentScrollY;
      }
      return prev;
    });

    setIsScrolled((prev) => {
      const newIsScrolled = currentScrollY > threshold;
      return prev !== newIsScrolled ? newIsScrolled : prev;
    });
  }, [threshold]);

  useEffect(() => {
    let rafId: number;
    let timeoutId: NodeJS.Timeout;

    const throttledScrollHandler = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        rafId = requestAnimationFrame(handleScroll);
      }, debounceMs);
    };

    window.addEventListener('scroll', throttledScrollHandler, { passive: true });

    // Initial call
    handleScroll();

    return () => {
      window.removeEventListener('scroll', throttledScrollHandler);
      clearTimeout(timeoutId);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [handleScroll, debounceMs]);

  return {
    scrollY,
    isScrolled,
  };
}

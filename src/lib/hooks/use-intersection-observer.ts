import { useState, useEffect, useRef, useCallback } from 'react';

interface UseIntersectionObserverOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
  onIntersect?: (isIntersecting: boolean) => void;
}

interface UseIntersectionObserverReturn {
  elementRef: React.RefObject<HTMLDivElement | null>;
  isIntersecting: boolean;
  hasTriggered: boolean;
}

/**
 * Custom hook for intersection observer that triggers when elements enter viewport
 * @param options - Configuration options for the intersection observer
 * @returns Object with ref, intersection state, and trigger state
 */
export function useIntersectionObserver(
  options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  const {
    threshold = 0.1,
    rootMargin = '200px', // Start loading 200px before visible
    triggerOnce = true,
    onIntersect,
  } = options;

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (!entry) return;
      
      const isVisible = entry.isIntersecting;
      
      setIsIntersecting(isVisible);
      
      if (isVisible && triggerOnce && !hasTriggered) {
        setHasTriggered(true);
      }
      
      onIntersect?.(isVisible);
    },
    [triggerOnce, hasTriggered, onIntersect]
  );

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
    });

    observer.observe(element);
    
    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, handleIntersection]);

  return { elementRef, isIntersecting, hasTriggered };
}

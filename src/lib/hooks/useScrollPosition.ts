import { useState, useEffect } from 'react';

interface UseScrollPositionOptions {
  threshold?: number;
  debounceMs?: number;
}

export function useScrollPosition(options: UseScrollPositionOptions = {}) {
  const { threshold = 0, debounceMs = 10 } = options;
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        const currentScrollY = window.scrollY;
        setScrollY(currentScrollY);
        setIsScrolled(currentScrollY > threshold);
      }, debounceMs);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, [threshold, debounceMs]);

  return {
    scrollY,
    isScrolled,
  };
}

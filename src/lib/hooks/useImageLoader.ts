import { useState, useEffect, useRef, useCallback } from 'react';
import { getS3ImageUrl } from '@/lib/utils';

interface UseImageLoaderOptions {
  defaultImage?: string;
  fallbackImage?: string;
  lazy?: boolean;
  threshold?: number;
  rootMargin?: string;
}

export function useImageLoader(imageUrl: string | undefined, options: UseImageLoaderOptions = {}) {
  const { 
    defaultImage = '/placeholder.svg', 
    fallbackImage = '/placeholder.svg',
    lazy = false,
    threshold = 0.1,
    rootMargin = '50px'
  } = options;
  
  const [imageUrlState, setImageUrlState] = useState<string>(defaultImage);
  const [isLoading, setIsLoading] = useState(!lazy);
  const [isInView, setIsInView] = useState(!lazy);
  const [hasError, setHasError] = useState(false);
  const imageRef = useRef<HTMLDivElement>(null);

  const loadImage = useCallback(async (url: string) => {
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
      console.error('Error loading image:', error);
      setImageUrlState(fallbackImage);
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackImage]);

  // Handle lazy loading with Intersection Observer
  useEffect(() => {
    if (!lazy) {
      loadImage(imageUrl || '');
      return;
    }

    if (!imageRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            loadImage(imageUrl || '');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold,
        rootMargin,
      }
    );

    observer.observe(imageRef.current);

    return () => {
      if (imageRef.current) {
        observer.unobserve(imageRef.current);
      }
    };
  }, [imageUrl, lazy, threshold, rootMargin, loadImage]);

  // Handle non-lazy loading
  useEffect(() => {
    if (!lazy && imageUrl !== undefined) {
      loadImage(imageUrl);
    }
  }, [imageUrl, lazy, loadImage]);

  return {
    imageUrl: imageUrlState,
    isLoading,
    isInView,
    hasError,
    imageRef,
  };
}

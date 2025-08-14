import { useState, useEffect, useCallback } from 'react';
import { getS3ImageUrl } from '@/lib/utils';

interface UseImageLoaderOptions {
  placeholderImage?: string;
}

export function useImageLoader(imageUrl: string | undefined, options: UseImageLoaderOptions = {}) {
  const {
    placeholderImage = '/placeholder.svg',
  } = options;

  const [imageUrlState, setImageUrlState] = useState<string>(placeholderImage);
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
        console.error('Error loading image:', error);
        setImageUrlState(placeholderImage);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    },
    [placeholderImage],
  );

  // Load image when URL changes
  useEffect(() => {
    if (imageUrl !== undefined) {
      loadImage(imageUrl);
    }
  }, [imageUrl, loadImage]);

  return {
    imageUrl: imageUrlState,
    isLoading,
    hasError,
  };
}

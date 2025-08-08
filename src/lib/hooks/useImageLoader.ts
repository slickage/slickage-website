import { useState, useEffect } from 'react';
import { getS3ImageUrl } from '@/lib/utils';

interface UseImageLoaderOptions {
  defaultImage?: string;
  fallbackImage?: string;
}

export function useImageLoader(imageUrl: string | undefined, options: UseImageLoaderOptions = {}) {
  const { defaultImage = '/placeholder.svg', fallbackImage = '/placeholder.svg' } = options;
  const [imageUrlState, setImageUrlState] = useState<string>(defaultImage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!imageUrl) {
      setImageUrlState(fallbackImage);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setImageUrlState(imageUrl);

    const loadImage = async () => {
      try {
        if (imageUrl === '/placeholder.svg') {
          setImageUrlState('/placeholder.svg');
          setIsLoading(false);
          return;
        }

        const url = await getS3ImageUrl(imageUrl);
        setImageUrlState(url);
      } catch (error) {
        console.error('Error loading image:', error);
        setImageUrlState(fallbackImage);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [imageUrl, fallbackImage]);

  return {
    imageUrl: imageUrlState,
    isLoading,
  };
}

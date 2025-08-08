import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a presigned URL for accessing private S3 images
 * @param path - The path to the image within the S3 bucket (e.g., 'images/case-studies/example.jpg')
 * @param fallbackUrl - Optional fallback URL to use if S3 bucket URL is not configured
 * @returns Promise that resolves to either the presigned URL or fallback URL
 */
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
      console.warn(`Failed to generate presigned URL for ${path}. Using fallback URL.`);
      return fallbackUrl;
    }

    const { url } = await response.json();
    return url;
  } catch (error) {
    console.error('Error generating presigned URL:', error);
    return fallbackUrl;
  }
}

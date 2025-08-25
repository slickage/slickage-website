import { logger } from '../utils/logger';

/**
 * S3 Service
 * Handles secure access to private S3 images via presigned URLs
 */

/**
 * Gets a presigned S3 URL for an image path
 * @param path - The image path within the S3 bucket
 * @param fallbackUrl - Optional fallback URL (defaults to '/placeholder.svg')
 * @returns Promise that resolves to the presigned URL or fallback URL
 */
export async function getS3ImageUrl(
  path: string,
  fallbackUrl: string = '/placeholder.svg',
): Promise<string> {
  try {
    if (!path || path === '/placeholder.svg') {
      return fallbackUrl;
    }

    const response = await fetch(`/api/s3-url?key=${encodeURIComponent(path)}`);

    if (!response.ok) {
      throw new Error(`Failed to get S3 URL: ${response.status}`);
    }

    const data = await response.json();
    return data.url || fallbackUrl;
  } catch (error) {
    logger.error('Error getting S3 image URL:', error);
    return fallbackUrl;
  }
}

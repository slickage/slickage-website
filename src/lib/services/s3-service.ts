import { logger } from '@/lib/utils/logger';

/**
 * S3 Service
 * Handles secure access to private S3 images via presigned URLs with enhanced caching
 */

const s3UrlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (half of 1-hour presigned URL expiration)
const CACHE_STORAGE_KEY = 's3-url-cache';

function loadCacheFromStorage() {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CACHE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();
        for (const [key, value] of Object.entries(parsed)) {
          if (now - (value as { timestamp: number }).timestamp < CACHE_DURATION) {
            s3UrlCache.set(key, value as { url: string; timestamp: number });
          }
        }
      }
    }
  } catch (error) {
    console.warn('Failed to load cache from localStorage:', error);
  }
}

function saveCacheToStorage() {
  try {
    if (typeof window !== 'undefined') {
      const cacheData = Object.fromEntries(s3UrlCache.entries());
      localStorage.setItem(CACHE_STORAGE_KEY, JSON.stringify(cacheData));
    }
  } catch (error) {
    console.warn('Failed to save cache to localStorage:', error);
  }
}

loadCacheFromStorage();

/**
 * Clean up expired cache entries
 */
function cleanupCache() {
  const now = Date.now();
  for (const [key, value] of s3UrlCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      s3UrlCache.delete(key);
    }
  }
  saveCacheToStorage();
}

/**
 * Gets a presigned S3 URL for an image path with enhanced caching
 * @param path - The image path within the S3 bucket
 * @param fallbackUrl - Optional fallback URL (defaults to '/placeholder.svg')
 * @returns Promise that resolves to the presigned URL or fallback URL
 */
export async function getS3ImageUrl(
  path: string,
  fallbackUrl: string = '/placeholder.svg',
): Promise<string> {
  if (!path || path === '/placeholder.svg' || path === fallbackUrl) {
    return fallbackUrl;
  }

  const cached = s3UrlCache.get(path);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.info(`Cache HIT for ${path}: ${cached.url.substring(0, 50)}...`);
    return cached.url;
  }

  logger.info(`Cache MISS for ${path}, generating new presigned URL...`);

  try {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;
    const response = await fetch(`/api/s3-url?key=${encodeURIComponent(normalizedPath)}`, {
      headers: {
        'Cache-Control': 'public, max-age=1800', // 30 minutes
      },
    });

    if (!response.ok) {
      logger.warn(`Failed to generate presigned URL for ${path}. Using fallback URL.`);
      return fallbackUrl;
    }

    const { url } = await response.json();

    s3UrlCache.set(path, { url, timestamp: Date.now() });
    logger.info(`Cached S3 URL for ${path}, cache size: ${s3UrlCache.size}`);

    saveCacheToStorage();

    cleanupCache();

    return url;
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    return fallbackUrl;
  }
}

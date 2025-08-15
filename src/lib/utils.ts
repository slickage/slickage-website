import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { logger } from './utils/logger';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Cache for S3 image URLs with localStorage persistence
const s3UrlCache = new Map<string, { url: string; timestamp: number }>();
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes (half of 1-hour presigned URL expiration)
const CACHE_STORAGE_KEY = 's3-url-cache';

// Load cache from localStorage on initialization
function loadCacheFromStorage() {
  try {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(CACHE_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const now = Date.now();

        // Only load non-expired entries
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

// Save cache to localStorage
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

// Initialize cache from localStorage
loadCacheFromStorage();

/**
 * Generates a presigned URL for accessing private S3 images with caching
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

  // Check cache first
  const cached = s3UrlCache.get(path);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    logger.info(`Cache HIT for ${path}: ${cached.url.substring(0, 50)}...`);
    return cached.url;
  }

  logger.info(`Cache MISS for ${path}, generating new presigned URL...`);

  try {
    const normalizedPath = path.startsWith('/') ? path.slice(1) : path;

    const response = await fetch(`/api/s3-url?key=${encodeURIComponent(normalizedPath)}`);

    if (!response.ok) {
      logger.warn(`Failed to generate presigned URL for ${path}. Using fallback URL.`);
      return fallbackUrl;
    }

    const { url } = await response.json();

    // Cache the successful result
    s3UrlCache.set(path, { url, timestamp: Date.now() });
    logger.info(`Cached S3 URL for ${path}, cache size: ${s3UrlCache.size}`);

    // Save to localStorage
    saveCacheToStorage();

    // Clean up old cache entries
    cleanupCache();

    return url;
  } catch (error) {
    logger.error('Error generating presigned URL:', error);
    return fallbackUrl;
  }
}

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
  saveCacheToStorage(); // Save after cleanup
}

/**
 * Get cache statistics for debugging
 */
export function getS3UrlCacheStats() {
  const now = Date.now();
  const entries = Array.from(s3UrlCache.entries()).map(([key, value]) => ({
    key,
    age: Math.round((now - value.timestamp) / 1000),
    url: value.url.substring(0, 50) + '...',
  }));

  return {
    size: s3UrlCache.size,
    entries,
    maxAge: Math.round(CACHE_DURATION / 1000),
  };
}

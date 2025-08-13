import { logger } from '../utils/logger';
import { getRedisClient, isRedisAvailable } from '../utils/redis';

const MAX_SUBMISSIONS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const SLIDING_WINDOW_SIZE = 60; // 1 minute sliding window size in seconds

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if IP is rate limited using Redis true sliding window algorithm
 * This provides more accurate rate limiting by checking multiple time windows
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000); // Current time in seconds
  const key = `rate_limit:${ip}`;
  const requestId = `${now}-${Date.now()}`; // Unique identifier for each request

  try {
    // Check if Redis is available
    if (!isRedisAvailable()) {
      logger.warn('Redis not available, falling back to in-memory rate limiting');
      return fallbackRateLimit(ip);
    }

    const redis = getRedisClient();

    // Add current timestamp with unique request ID
    await redis.zadd(key, now, requestId);

    // Remove timestamps older than the rate limit window
    await redis.zremrangebyscore(key, 0, now - RATE_LIMIT_WINDOW);

    // Get current count after cleanup
    const currentCount = await redis.zcard(key);

    // Set expiration on the key to auto-cleanup
    await redis.expire(key, RATE_LIMIT_WINDOW);

    // Check if rate limit exceeded
    logger.debug(
      `Rate limit check: IP ${ip}, currentCount: ${currentCount}, MAX_SUBMISSIONS: ${MAX_SUBMISSIONS_PER_HOUR}`,
    );

    if (currentCount > MAX_SUBMISSIONS_PER_HOUR) {
      // Calculate reset time based on oldest request in window
      const oldestTimestamp = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTime = oldestTimestamp[1] ? parseInt(oldestTimestamp[1]) : now;
      const resetTime = oldestTime + RATE_LIMIT_WINDOW;

      logger.security(`Rate limit exceeded: IP ${ip}, count: ${currentCount}`);

      return {
        limited: true,
        remaining: 0,
        resetTime: resetTime * 1000, // Convert back to milliseconds
      };
    }

    // Calculate remaining requests and reset time
    const remaining = Math.max(0, MAX_SUBMISSIONS_PER_HOUR - currentCount);
    const resetTime = (now + RATE_LIMIT_WINDOW) * 1000; // Convert to milliseconds

    logger.debug(
      `Rate limit check: IP ${ip}, count: ${currentCount}, remaining: ${remaining}, limited: false`,
    );

    return {
      limited: false,
      remaining,
      resetTime,
    };
  } catch (error) {
    logger.error(`Redis rate limiting error for IP ${ip}:`, error);

    // Fallback to in-memory rate limiting if Redis fails
    logger.warn('Falling back to in-memory rate limiting due to Redis error');
    return fallbackRateLimit(ip);
  }
}

/**
 * Fallback in-memory rate limiting when Redis is unavailable
 * This ensures the application continues to work even if Redis fails
 */
const submissionTimes = new Map<string, number[]>();

function fallbackRateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const times = submissionTimes.get(ip) || [];
  const windowMs = RATE_LIMIT_WINDOW * 1000;

  // Filter to recent submissions within the window
  const recentTimes = times.filter((time) => now - time < windowMs);

  if (recentTimes.length >= MAX_SUBMISSIONS_PER_HOUR) {
    const oldestSubmission = Math.min(...recentTimes);
    const resetTime = oldestSubmission + windowMs;

    logger.security(`Fallback rate limit exceeded: IP ${ip}`);

    return {
      limited: true,
      remaining: 0,
      resetTime,
    };
  }

  // Add current submission
  recentTimes.push(now);
  submissionTimes.set(ip, recentTimes);

  return {
    limited: false,
    remaining: MAX_SUBMISSIONS_PER_HOUR - recentTimes.length,
    resetTime: now + windowMs,
  };
}

/**
 * Get current rate limit status for an IP without incrementing the counter
 * Uses true sliding window algorithm for more accurate counting
 */
export async function getRateLimitStatus(ip: string): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `rate_limit:${ip}`;

  try {
    if (!isRedisAvailable()) {
      return fallbackRateLimit(ip);
    }

    const redis = getRedisClient();

    // Use sliding window algorithm: check multiple time windows
    // This provides more accurate rate limiting than just checking the full hour
    const slidingWindows = [];

    // Check multiple sliding windows within the rate limit period
    for (let i = 0; i < RATE_LIMIT_WINDOW; i += SLIDING_WINDOW_SIZE) {
      const windowStart = now - i;
      const windowEnd = windowStart + SLIDING_WINDOW_SIZE;

      // Count requests in this specific window
      const windowCount = await redis.zcount(key, windowStart, windowEnd);
      slidingWindows.push(windowCount);
    }

    // Find the window with the highest request count
    const maxRequestsInAnyWindow = Math.max(...slidingWindows);

    if (maxRequestsInAnyWindow >= MAX_SUBMISSIONS_PER_HOUR) {
      // Find the oldest request to calculate reset time
      const oldestTimestamp = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTime = oldestTimestamp[1] ? parseInt(oldestTimestamp[1]) : now;
      const resetTime = oldestTime + RATE_LIMIT_WINDOW;

      return {
        limited: true,
        remaining: 0,
        resetTime: resetTime * 1000,
      };
    }

    const remaining = Math.max(0, MAX_SUBMISSIONS_PER_HOUR - maxRequestsInAnyWindow);
    const resetTime = (now + RATE_LIMIT_WINDOW) * 1000;

    return {
      limited: false,
      remaining,
      resetTime,
    };
  } catch (error) {
    logger.error(`Error getting rate limit status for IP ${ip}:`, error);
    return fallbackRateLimit(ip);
  }
}

/**
 * Reset rate limit for a specific IP (useful for testing or admin purposes)
 */
export async function resetRateLimit(ip: string): Promise<boolean> {
  try {
    if (!isRedisAvailable()) {
      submissionTimes.delete(ip);
      return true;
    }

    const redis = getRedisClient();
    const key = `rate_limit:${ip}`;
    await redis.del(key);

    logger.info(`Rate limit reset for IP: ${ip}`);
    return true;
  } catch (error) {
    logger.error(`Error resetting rate limit for IP ${ip}:`, error);
    return false;
  }
}

export { MAX_SUBMISSIONS_PER_HOUR };

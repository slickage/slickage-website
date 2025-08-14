import { logger } from '../utils/logger';
import { getRedisClient, isRedisAvailable } from '../utils/redis';

const MAX_SUBMISSIONS_PER_HOUR = 3;
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check if IP is rate limited using Redis true sliding window algorithm
 * This provides accurate rate limiting by checking a rolling time window
 */
export async function checkRateLimit(ip: string): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `rate_limit:${ip}`;
  const requestId = `${now}-${Date.now()}`;

  try {
    if (!isRedisAvailable()) {
      logger.warn('Redis not available, falling back to in-memory rate limiting');
      return fallbackRateLimit(ip);
    }

    const redis = getRedisClient();

    // Use Redis pipeline for atomic operations and optimal performance
    // This reduces network round-trips from 4 to 1 and ensures atomicity
    const windowStart = now - RATE_LIMIT_WINDOW;

    try {
      // Create pipeline for atomic execution
      const pipeline = redis.pipeline();

      // Add operations to pipeline in correct order:
      // 1. Remove old entries (cleanup)
      // 2. Count existing requests BEFORE adding current request
      // 3. Add current request
      // 4. Set expiration
      pipeline.zremrangebyscore(key, 0, windowStart);
      pipeline.zcount(key, windowStart, now);
      pipeline.zadd(key, now, requestId);
      pipeline.expire(key, RATE_LIMIT_WINDOW);

      // Execute all operations atomically
      const results = await pipeline.exec();

      // Validate pipeline results
      if (!results || results.length !== 4) {
        throw new Error(
          `Pipeline execution failed: expected 4 results, got ${results?.length || 0}`,
        );
      }

      // Extract the count result (index 1 in our pipeline)
      // results[0] = zremrangebyscore result
      // results[1] = zcount result (what we need)
      // results[2] = zadd result
      // results[3] = expire result
      const countResult = results[1];
      if (!countResult || countResult[0]) {
        throw new Error(`Pipeline count operation failed: ${countResult?.[0] || 'unknown error'}`);
      }

      const existingRequestCount = (countResult[1] as number) || 0;

      // Check if adding this request would exceed the limit
      if (existingRequestCount >= MAX_SUBMISSIONS_PER_HOUR) {
        // Calculate reset time based on oldest request in window
        const oldestTimestamp = await redis.zrange(key, 0, 0, 'WITHSCORES');
        const oldestTime = oldestTimestamp[1] ? parseInt(oldestTimestamp[1]) : now;
        const resetTime = oldestTime + RATE_LIMIT_WINDOW;

        logger.security(
          `Rate limit exceeded: IP ${ip}, existingRequestCount: ${existingRequestCount}`,
        );

        return {
          limited: true,
          remaining: 0,
          resetTime: resetTime * 1000, // Convert back to milliseconds
        };
      }

      // Calculate remaining requests based on total count after adding current request
      // After adding this request, we'll have (existingRequestCount + 1) requests
      // So remaining = MAX_SUBMISSIONS_PER_HOUR - (existingRequestCount + 1)
      const remaining = Math.max(0, MAX_SUBMISSIONS_PER_HOUR - (existingRequestCount + 1));
      const resetTime = (now + RATE_LIMIT_WINDOW) * 1000; // Convert to milliseconds

      logger.debug(
        `Rate limit check: IP ${ip}, existingRequestCount: ${existingRequestCount}, remaining: ${remaining}, limited: false`,
      );

      return {
        limited: false,
        remaining,
        resetTime,
      };
    } catch (pipelineError) {
      logger.error(`Pipeline execution failed for IP ${ip}:`, pipelineError);

      // Fallback to sequential operations if pipeline fails
      logger.warn('Falling back to sequential operations due to pipeline error');

      try {
        // Sequential fallback for reliability
        await redis.zremrangebyscore(key, 0, windowStart);
        const existingRequestCount = await redis.zcount(key, windowStart, now);

        if (existingRequestCount >= MAX_SUBMISSIONS_PER_HOUR) {
          const oldestTimestamp = await redis.zrange(key, 0, 0, 'WITHSCORES');
          const oldestTime = oldestTimestamp[1] ? parseInt(oldestTimestamp[1]) : now;
          const resetTime = oldestTime + RATE_LIMIT_WINDOW;

          logger.security(
            `Rate limit exceeded (fallback): IP ${ip}, existingRequestCount: ${existingRequestCount}`,
          );

          return {
            limited: true,
            remaining: 0,
            resetTime: resetTime * 1000,
          };
        }

        await redis.zadd(key, now, requestId);
        await redis.expire(key, RATE_LIMIT_WINDOW);

        const remaining = Math.max(0, MAX_SUBMISSIONS_PER_HOUR - (existingRequestCount + 1));
        const resetTime = (now + RATE_LIMIT_WINDOW) * 1000;

        return {
          limited: false,
          remaining,
          resetTime,
        };
      } catch (fallbackError) {
        logger.error(`Sequential fallback also failed for IP ${ip}:`, fallbackError);
        throw fallbackError; // Re-throw to trigger in-memory fallback
      }
    }
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
 * Uses true sliding window algorithm for accurate counting
 */
export async function getRateLimitStatus(ip: string): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `rate_limit:${ip}`;

  try {
    if (!isRedisAvailable()) {
      return fallbackRateLimit(ip);
    }

    const redis = getRedisClient();

    // Use true sliding window algorithm: check rolling 1-hour window ending at current time
    const windowStart = now - RATE_LIMIT_WINDOW; // 1 hour ago
    const windowEnd = now; // current time

    // Count requests in the rolling 1-hour window
    const requestCount = await redis.zcount(key, windowStart, windowEnd);

    if (requestCount > MAX_SUBMISSIONS_PER_HOUR) {
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

    const remaining = Math.max(0, MAX_SUBMISSIONS_PER_HOUR - requestCount);
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

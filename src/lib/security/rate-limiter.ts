import { logger } from '../utils/logger';
import { getRedisClient, isRedisAvailable } from '../utils/redis';

const MAX_REQUESTS_PER_WINDOW = 3;
const WINDOW_SIZE_SECONDS = 60 * 60; // 1 hour in seconds

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetTime: number;
}

// In-memory fallback rate limiting for when Redis is unavailable
class InMemoryRateLimiter {
  private store = new Map<string, { count: number; windowStart: number }>();
  private cleanupInterval: NodeJS.Timeout;

  constructor() {
    // Clean up expired entries every 5 minutes
    this.cleanupInterval = setInterval(
      () => {
        this.cleanup();
      },
      5 * 60 * 1000,
    );
  }

  private cleanup() {
    const now = Date.now();
    const windowMs = WINDOW_SIZE_SECONDS * 1000;

    for (const [key, value] of this.store.entries()) {
      if (now - value.windowStart > windowMs) {
        this.store.delete(key);
      }
    }
  }

  checkLimit(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowMs = WINDOW_SIZE_SECONDS * 1000;
    const entry = this.store.get(identifier);

    if (!entry || now - entry.windowStart > windowMs) {
      // New window or expired window
      this.store.set(identifier, { count: 1, windowStart: now });
      return {
        limited: false,
        remaining: MAX_REQUESTS_PER_WINDOW - 1,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
      // Rate limit exceeded
      return {
        limited: true,
        remaining: 0,
        resetTime: entry.windowStart + windowMs,
      };
    }

    // Increment count
    entry.count++;
    return {
      limited: false,
      remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
      resetTime: entry.windowStart + windowMs,
    };
  }

  getStatus(identifier: string): RateLimitResult {
    const now = Date.now();
    const windowMs = WINDOW_SIZE_SECONDS * 1000;
    const entry = this.store.get(identifier);

    if (!entry || now - entry.windowStart > windowMs) {
      return {
        limited: false,
        remaining: MAX_REQUESTS_PER_WINDOW,
        resetTime: now + windowMs,
      };
    }

    if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
      return {
        limited: true,
        remaining: 0,
        resetTime: entry.windowStart + windowMs,
      };
    }

    return {
      limited: false,
      remaining: MAX_REQUESTS_PER_WINDOW - entry.count,
      resetTime: entry.windowStart + windowMs,
    };
  }

  reset(identifier: string): boolean {
    return this.store.delete(identifier);
  }

  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
    this.store.clear();
  }
}

// Global in-memory fallback instance
const inMemoryLimiter = new InMemoryRateLimiter();

/**
 * Sliding window rate limiter using Redis sorted sets
 * Falls back to in-memory rate limiting when Redis is unavailable
 */
export async function checkRateLimit(identifier: string): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `rate_limit:${identifier}`;
  const windowStart = now - WINDOW_SIZE_SECONDS;

  try {
    if (!isRedisAvailable()) {
      logger.debug('Redis not available, falling back to in-memory rate limiting');
      return inMemoryLimiter.checkLimit(identifier);
    }

    const redis = getRedisClient();

    // Use Redis pipeline for atomic operations
    const pipeline = redis.pipeline();

    // 1. Remove expired entries outside the sliding window
    pipeline.zremrangebyscore(key, 0, windowStart);

    // 2. Count current requests in the window
    pipeline.zcount(key, windowStart, now);

    // 3. Add current request timestamp
    pipeline.zadd(key, now, `${now}-${Date.now()}`);

    // 4. Set expiration to prevent memory leaks
    pipeline.expire(key, WINDOW_SIZE_SECONDS);

    // Execute all operations atomically
    const results = await pipeline.exec();

    if (!results) {
      throw new Error('Redis pipeline execution failed');
    }

    // Extract the count result (index 1 from zcount)
    const requestCount = (results[1]?.[1] as number) || 0;

    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      // Calculate reset time based on oldest request in window
      const oldestTimestamp = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTime = oldestTimestamp[1] ? parseInt(oldestTimestamp[1]) : now;
      const resetTime = oldestTime + WINDOW_SIZE_SECONDS;

      logger.security(`Rate limit exceeded: ${identifier}, requestCount: ${requestCount}`);

      return {
        limited: true,
        remaining: 0,
        resetTime: resetTime * 1000,
      };
    }

    const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - (requestCount + 1));
    const resetTime = (now + WINDOW_SIZE_SECONDS) * 1000;

    logger.debug(
      `Rate limit check: ${identifier}, requestCount: ${requestCount}, remaining: ${remaining}`,
    );

    return {
      limited: false,
      remaining,
      resetTime,
    };
  } catch (error) {
    logger.error(`Rate limiting error for ${identifier}:`, error);

    // Fall back to in-memory rate limiting on Redis errors
    logger.debug('Falling back to in-memory rate limiting due to Redis error');
    return inMemoryLimiter.checkLimit(identifier);
  }
}

/**
 * Get current rate limit status without incrementing the counter
 * Falls back to in-memory rate limiting when Redis is unavailable
 */
export async function getRateLimitStatus(identifier: string): Promise<RateLimitResult> {
  const now = Math.floor(Date.now() / 1000);
  const key = `rate_limit:${identifier}`;

  try {
    if (!isRedisAvailable()) {
      return inMemoryLimiter.getStatus(identifier);
    }

    const redis = getRedisClient();
    const windowStart = now - WINDOW_SIZE_SECONDS;

    // Count requests in the current sliding window
    const requestCount = await redis.zcount(key, windowStart, now);

    if (requestCount >= MAX_REQUESTS_PER_WINDOW) {
      // Find oldest request to calculate reset time
      const oldestTimestamp = await redis.zrange(key, 0, 0, 'WITHSCORES');
      const oldestTime = oldestTimestamp[1] ? parseInt(oldestTimestamp[1]) : now;
      const resetTime = oldestTime + WINDOW_SIZE_SECONDS;

      return {
        limited: true,
        remaining: 0,
        resetTime: resetTime * 1000,
      };
    }

    const remaining = Math.max(0, MAX_REQUESTS_PER_WINDOW - requestCount);
    const resetTime = (now + WINDOW_SIZE_SECONDS) * 1000;

    return {
      limited: false,
      remaining,
      resetTime,
    };
  } catch (error) {
    logger.error(`Error getting rate limit status for ${identifier}:`, error);

    // Fall back to in-memory rate limiting on Redis errors
    return inMemoryLimiter.getStatus(identifier);
  }
}

/**
 * Reset rate limit for a specific identifier
 * Resets both Redis and in-memory rate limits
 */
export async function resetRateLimit(identifier: string): Promise<boolean> {
  try {
    // Always reset in-memory rate limit
    inMemoryLimiter.reset(identifier);

    if (!isRedisAvailable()) {
      return true;
    }

    const redis = getRedisClient();
    const key = `rate_limit:${identifier}`;
    await redis.del(key);

    logger.info(`Rate limit reset for: ${identifier}`);
    return true;
  } catch (error) {
    logger.error(`Error resetting rate limit for ${identifier}:`, error);
    return false;
  }
}

/**
 * Cleanup function to be called when shutting down the application
 */
export function cleanupRateLimiter(): void {
  inMemoryLimiter.destroy();
}

export { MAX_REQUESTS_PER_WINDOW, WINDOW_SIZE_SECONDS };

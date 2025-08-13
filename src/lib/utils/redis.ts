import Redis from 'ioredis';
import { logger } from './logger';

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
      redis = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        lazyConnect: false,
        connectTimeout: 10000,
        commandTimeout: 5000,
      });

      redis.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      redis.on('close', () => {
        logger.warn('Redis connection closed');
      });

      redis.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      redis.on('ready', () => {
        logger.info('Redis is ready');
      });
    } catch (error) {
      logger.error('Failed to create Redis client:', error);
      throw error;
    }
  }

  return redis;
}

export async function closeRedisConnection(): Promise<void> {
  if (redis) {
    try {
      await redis.quit();
      redis = null;
      logger.info('Redis connection closed');
    } catch (error) {
      logger.error('Error closing Redis connection:', error);
    }
  }
}

export function isRedisAvailable(): boolean {
  try {
    return redis !== null && redis.status === 'ready';
  } catch (error) {
    logger.error('Error checking Redis availability:', error);
    return false;
  }
}

// Initialize Redis connection on module load
export async function initializeRedis(): Promise<void> {
  try {
    const client = getRedisClient();
    await client.ping();
    logger.info('Redis initialization successful');
  } catch (error) {
    logger.error('Redis initialization failed:', error);
  }
}

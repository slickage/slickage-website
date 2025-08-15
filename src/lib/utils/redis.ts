import Redis from 'ioredis';
import { logger } from './logger';

// Redis connection configuration for optimal performance and reliability
const redisOptions = {
  // Connection settings
  lazyConnect: true,
  family: 4, // IPv4 for better performance
  connectTimeout: 10000,
  commandTimeout: 5000,
  // Retry and resilience settings
  maxRetriesPerRequest: 3,
  retryDelayOnFailover: 100,
  enableReadyCheck: true,
  maxLoadingTimeout: 10000,
  // Connection pool and performance settings
  keepAlive: 30000,
  enableOfflineQueue: true,
  // Health monitoring and maintenance
  healthCheckInterval: 30000,
};

let redis: Redis | null = null;

export function getRedisClient(): Redis {
  if (!redis) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    try {
      redis = new Redis(redisUrl, redisOptions);

      // Enhanced event handling for better monitoring
      redis.on('connect', () => {
        logger.info('Redis connected successfully');
      });

      redis.on('error', (error) => {
        logger.error('Redis connection error:', error);
      });

      redis.on('close', () => {
        logger.warn('Redis connection closed');
        redis = null; // Reset for reconnection
      });

      redis.on('reconnecting', () => {
        logger.info('Redis reconnecting...');
      });

      redis.on('ready', () => {
        logger.info('Redis is ready');
      });

      redis.on('end', () => {
        logger.warn('Redis connection ended');
        redis = null;
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

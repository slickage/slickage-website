# Redis Rate Limiting Implementation

## Overview

This project implements a sophisticated rate limiting system using Redis with a sliding window algorithm. The system provides more accurate rate limiting than traditional fixed-window approaches and includes automatic fallback to in-memory rate limiting when Redis is unavailable.

## Features

- **Sliding Window Algorithm**: Prevents traffic bursts at window boundaries
- **Redis Persistence**: Rate limit data survives server restarts
- **Automatic Fallback**: Gracefully degrades to in-memory rate limiting if Redis fails
- **Atomic Operations**: Uses Redis pipelines for consistent rate limiting
- **Auto-cleanup**: Automatically expires old rate limit data
- **Multi-instance Support**: Works across multiple server instances

## Architecture

### Rate Limiting Algorithm

The **true sliding window algorithm** works by:

1. **Storing timestamps** in a Redis sorted set for each request
2. **Creating multiple time windows** based on `SLIDING_WINDOW_SIZE` (e.g., 60 one-minute windows in an hour)
3. **Checking each window** to find the one with the highest request count
4. **Enforcing rate limits** based on the highest count found in any window
5. **Automatically expiring** old data to prevent memory buildup

### Why This Approach is Better

- **Prevents Traffic Bursts**: Unlike fixed windows, this catches rapid requests even if they're spread across the time period
- **More Accurate**: Provides granular rate limiting that adapts to actual usage patterns
- **Configurable**: `SLIDING_WINDOW_SIZE` can be adjusted for different use cases
- **Efficient**: Uses Redis sorted sets for fast timestamp operations

### Key Components

- **Redis Client** (`src/lib/utils/redis.ts`): Manages Redis connections
- **Rate Limiter** (`src/lib/security/rate-limiter.ts`): Core rate limiting logic with true sliding window
- **Fallback System**: In-memory rate limiting when Redis is unavailable

## Setup

### 1. Docker Configuration

Redis is automatically configured in `docker-compose.yml`:

```yaml
redis:
  image: 'redis:7-alpine'
  ports:
    - '6379:6379'
  volumes:
    - ./data/redis:/data
  command: redis-server --appendonly yes --maxmemory 128mb --maxmemory-policy allkeys-lru
  healthcheck:
    test: ['CMD', 'redis-cli', 'ping']
    interval: 5s
    timeout: 3s
    retries: 5
```

### 2. Environment Variables

Add to your `.env` file:

```bash
# Redis Configuration
REDIS_URL=redis://localhost:6379
```

### 3. Dependencies

The following packages are required:

```bash
bun add ioredis
bun add -d @types/ioredis
```

## Configuration

### Rate Limiting Parameters

```typescript
const MAX_SUBMISSIONS_PER_HOUR = 3; // Maximum requests per hour
const RATE_LIMIT_WINDOW = 60 * 60; // 1 hour in seconds
const SLIDING_WINDOW_SIZE = 60; // 1 minute sliding window size in seconds
```

**How the Sliding Window Works:**

- **RATE_LIMIT_WINDOW**: The total time period (1 hour = 3600 seconds)
- **SLIDING_WINDOW_SIZE**: The size of each sliding window (1 minute = 60 seconds)
- The system checks **60 different 1-minute windows** within the 1-hour period
- Rate limiting is enforced based on the **highest count** found in any of these windows
- This prevents traffic bursts that could occur with simple fixed-window rate limiting

### Example Sliding Window Calculation

With 1-hour rate limit and 1-minute sliding windows:

- Window 1: 00:00-01:00 (requests: 2)
- Window 2: 00:01-02:00 (requests: 3) ← **Rate limit exceeded!**
- Window 3: 00:02-03:00 (requests: 1)
- ... and so on for 60 windows

The system would detect that Window 2 has 3 requests and enforce the rate limit, even though the total over the full hour might be lower.

### Redis Configuration

```typescript
const redis = new Redis(redisUrl, {
  retryDelayOnFailover: 100, // Retry delay on failover
  maxRetriesPerRequest: 3, // Max retries per request
  lazyConnect: true, // Connect only when needed
  connectTimeout: 10000, // Connection timeout (10s)
  commandTimeout: 5000, // Command timeout (5s)
});
```

## Usage

### Basic Rate Limiting

```typescript
import { checkRateLimit } from '@/lib/security/rate-limiter';

// Check if IP is rate limited
const rateLimitResult = await checkRateLimit(clientIp);

if (rateLimitResult.limited) {
  // Handle rate limit exceeded
  const minutesUntilReset = Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000 / 60);
  return `Too many requests. Try again in ${minutesUntilReset} minutes.`;
}
```

### Check Rate Limit Status

```typescript
import { getRateLimitStatus } from '@/lib/security/rate-limiter';

// Get current status without incrementing counter
const status = await getRateLimitStatus(clientIp);
console.log(`Remaining requests: ${status.remaining}`);
```

### Reset Rate Limit

```typescript
import { resetRateLimit } from '@/lib/security/rate-limiter';

// Reset rate limit for specific IP (admin/testing)
const success = await resetRateLimit(clientIp);
```

## API Response Headers

The rate limiting system provides standard HTTP headers:

```typescript
{
  'Retry-After': '45',                    // Seconds until retry
  'X-RateLimit-Limit': '3',               // Maximum requests per hour
  'X-RateLimit-Remaining': '2',           // Remaining requests
  'X-RateLimit-Reset': '2024-01-01T12:00:00.000Z' // Reset time
}
```

## Fallback System

When Redis is unavailable, the system automatically falls back to in-memory rate limiting:

1. **Automatic Detection**: System detects Redis connection status
2. **Seamless Fallback**: Switches to in-memory rate limiting
3. **Graceful Degradation**: Application continues to function
4. **Automatic Recovery**: Returns to Redis when connection is restored

## Monitoring and Debugging

### Redis Health Check

```typescript
import { isRedisAvailable } from '@/lib/utils/redis';

if (isRedisAvailable()) {
  console.log('Redis is healthy');
} else {
  console.log('Redis is unavailable, using fallback');
}
```

### Logging

The system provides comprehensive logging:

- **Info**: Redis connections, rate limit resets
- **Warning**: Redis unavailable, fallback usage
- **Error**: Redis errors, connection failures
- **Security**: Rate limit violations
- **Debug**: Rate limit checks, remaining counts

## Performance Considerations

### Redis Optimizations

- **Pipeline Operations**: Uses Redis pipelines for atomic operations
- **Sorted Sets**: Efficient timestamp storage and retrieval
- **Auto-expiration**: Automatic cleanup of old data
- **Memory Limits**: 128MB max memory with LRU eviction

### Fallback Performance

- **In-Memory Map**: Fast local storage when Redis unavailable
- **Minimal Overhead**: Fallback adds negligible performance impact
- **Automatic Cleanup**: Prevents memory leaks

## Security Features

### Rate Limiting

- **IP-based Limiting**: Prevents abuse from individual IPs
- **Configurable Limits**: Adjustable request thresholds
- **Time-based Windows**: Flexible time period configuration

### Data Protection

- **No Sensitive Data**: Only stores IP addresses and timestamps
- **Automatic Expiration**: Data automatically cleaned up
- **Isolated Storage**: Rate limit data separate from application data

## Troubleshooting

### Common Issues

1. **Redis Connection Failed**
   - Check if Redis container is running
   - Verify Redis URL in environment variables
   - Check Docker logs: `docker-compose logs redis`

2. **Rate Limiting Not Working**
   - Verify Redis health status
   - Check application logs for Redis errors
   - Ensure environment variables are set correctly

3. **Performance Issues**
   - Monitor Redis memory usage
   - Check Redis connection pool settings
   - Verify rate limiting parameters

4. **Error Message Duplication**
   - **Fixed**: The system now prevents duplicate retry messages
   - **Before**: "Too many submissions. Please try again in 59 minutes. Please try again in 59 minutes."
   - **After**: "Too many submissions. Please try again in 59 minutes."
   - **Location**: Fixed in `src/components/contact/contact-form.tsx` by checking if error already contains retry info

### Debug Commands

```bash
# Check Redis container status
docker-compose ps redis

# View Redis logs
docker-compose logs redis

# Connect to Redis CLI
docker-compose exec redis redis-cli

# Monitor Redis operations
docker-compose exec redis redis-cli monitor
```

## Migration from In-Memory

### Before (In-Memory)

```typescript
// Old implementation
const submissionTimes = new Map<string, number[]>();
const rateLimitResult = checkRateLimit(clientIp); // Synchronous
```

### After (Redis)

```typescript
// New implementation
const rateLimitResult = await checkRateLimit(clientIp); // Asynchronous
// Automatic fallback to in-memory if Redis unavailable
```

## Best Practices

1. **Environment Configuration**: Always set `REDIS_URL` in production
2. **Error Handling**: Implement proper error handling for Redis failures
3. **Monitoring**: Monitor Redis health and performance metrics
4. **Testing**: Test both Redis and fallback scenarios
5. **Documentation**: Keep rate limiting parameters documented

## Future Enhancements

- **Distributed Rate Limiting**: Support for multiple Redis instances
- **Custom Algorithms**: Configurable rate limiting algorithms
- **Rate Limit Analytics**: Detailed usage statistics and reporting
- **Dynamic Limits**: Adjustable limits based on user roles or conditions
- **Rate Limit Bypass**: Admin override capabilities for testing

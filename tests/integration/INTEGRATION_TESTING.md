# Integration Tests

This directory contains integration tests that require external services or dependencies to run properly.

## Rate Limiter Redis Integration Tests

**File**: `rate-limiter-redis.test.ts`

### What These Tests Cover

- ✅ Redis-based rate limiting functionality
- ✅ True sliding window algorithm implementation
- ✅ Redis connection handling and error scenarios
- ✅ Fallback mechanism when Redis fails
- ✅ Distributed rate limiting behavior
- ✅ Redis performance and concurrency
- ✅ Redis key expiration and cleanup

### Prerequisites

- Redis server running (locally or in CI)
- Redis connection available via `REDIS_URL` environment variable

### Running These Tests

```bash
# Run only integration tests (requires Redis)
bun test tests/integration/

# Run all tests including unit tests
bun test

# Run with specific Redis configuration
REDIS_URL=redis://localhost:6379 bun test tests/integration/
```

### Test Environment

These tests require a Redis instance and will:

1. Initialize Redis connection
2. Test Redis-based rate limiting
3. Validate fallback behavior when Redis fails
4. Clean up Redis connections and data

### CI/CD Integration

These tests are designed to run in CI environments with Redis services:

- GitHub Actions with Redis service container
- Docker Compose with Redis
- Local development with Redis instance

## Test Organization

- **Unit Tests**: `tests/unit/` - Fast, no external dependencies
- **Integration Tests**: `tests/integration/` - Comprehensive, requires services

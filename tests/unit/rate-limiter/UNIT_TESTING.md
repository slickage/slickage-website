# Rate Limiter Unit Tests

This directory contains **unit tests** for the rate limiter functionality, specifically testing the **in-memory fallback behavior** when Redis is unavailable.

## What These Tests Cover

- ✅ In-memory rate limiting fallback
- ✅ Fallback algorithm correctness
- ✅ Error handling and edge cases
- ✅ Performance under load
- ✅ Memory efficiency
- ✅ Fallback reset and recovery

## What These Tests DON'T Cover

- ❌ Redis-based rate limiting
- ❌ Redis connection handling
- ❌ Distributed rate limiting
- ❌ Network failure scenarios

## Running These Tests

```bash
# Run only unit tests (fast, no Redis required)
bun test tests/unit/

# Run all tests including integration tests
bun test
```

## Test Environment

These tests run **without Redis** and validate that the fallback mechanism works correctly when the primary Redis-based rate limiter is unavailable.

## Related Tests

For Redis integration testing, see: `tests/integration/rate-limiter-redis.test.ts`

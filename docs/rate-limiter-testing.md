# Rate Limiter Testing

This document describes the testing strategy and implementation for the rate limiting system in the Slickage website.

## Test Structure

The tests are organized into two main categories:

### Core Tests (`tests/core/`)

- **Unit tests** for individual rate limiter functions
- **Fallback mechanism tests** for when Redis is unavailable
- **Configuration validation** tests
- **Data structure validation** tests

### Integration Tests (`tests/integration/`)

- **Redis integration tests** with actual Redis instance
- **Sliding window algorithm tests** for accurate rate limiting
- **Concurrent request handling** tests
- **Edge case testing** for boundary conditions

## Test Environment

### Local Testing

- Uses `bun test` for running tests
- Redis container started via Docker Compose
- Tests run against local Redis instance

### CI/CD Testing

- GitHub Actions runs tests in parallel
- Separate Redis instances for each test matrix
- Matrix strategy for different test suites

## Key Test Scenarios

### 1. Sliding Window Algorithm

Tests the true sliding window implementation that provides accurate rate limiting by:

- Counting requests in rolling time windows
- Properly handling window boundaries
- Maintaining data integrity under load

### 2. Rate Limit Enforcement

Verifies that the rate limiter correctly:

- Allows requests up to the limit (`MAX_SUBMISSIONS_PER_HOUR = 3`)
- Blocks requests when the limit is exceeded
- Provides accurate remaining count and reset time

### 3. Edge Cases

Tests critical boundary conditions:

- Exactly `MAX_SUBMISSIONS_PER_HOUR` requests
- Window boundary transitions
- Concurrent request handling
- Rapid successive requests

## Running Tests

### All Tests

```bash
bun test
```

### Core Tests Only

```bash
bun test tests/core/
```

### Integration Tests Only

```bash
bun test tests/integration/
```

### Specific Test File

```bash
bun test tests/integration/sliding-window.test.ts
```

## Test Coverage

The tests provide comprehensive coverage of:

- **Function coverage**: 85.71% for rate-limiter.ts
- **Line coverage**: 52.00% for rate-limiter.ts
- **Edge cases**: Boundary conditions and error scenarios
- **Integration**: Real Redis operations and concurrent handling

## Debugging Failed Tests

When tests fail, check:

1. **Redis availability**: Ensure Redis container is running
2. **Timing issues**: Some tests have built-in delays for CI environments
3. **Rate limit state**: Use `resetRateLimit()` to ensure clean test state
4. **Logs**: Check console output for Redis connection issues

## Performance Considerations

- **Integration tests** can take 15-30 seconds due to Redis operations
- **Sliding window tests** include realistic timing scenarios
- **Concurrent tests** validate race condition handling
- **CI environment** uses separate Redis instances to avoid conflicts

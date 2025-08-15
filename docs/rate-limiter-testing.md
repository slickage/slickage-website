# Rate Limiter Testing

This document describes the testing strategy and implementation for the rate limiting system in the Slickage website.

## Test Structure

The tests are organized into a single, comprehensive test suite:

### Rate Limiter Test Suite (`tests/rate-limiter/`)

- **Comprehensive test coverage** in a single, well-organized file
- **All functionality tested** including core operations, sliding window algorithm, error handling, and fallback behavior
- **Performance and scalability tests** for production readiness
- **Edge case coverage** for boundary conditions and resilience

## Test Categories

The consolidated test suite covers all aspects of the rate limiter:

### 1. Core Functionality

- Basic rate limiting operations
- Rate limit enforcement
- Status checking without incrementing
- Reset functionality

### 2. Sliding Window Algorithm

- Redis-based sliding window implementation
- Window boundary conditions
- Reset time calculations

### 3. Error Handling and Fallback

- Graceful degradation when Redis is unavailable
- Invalid identifier handling
- Consistent error responses

### 4. Concurrent Request Handling

- Performance under load
- Race condition handling
- Rapid successive calls

### 5. Performance and Scalability

- Consistent performance under load
- Memory usage optimization
- Large-scale request handling

### 6. Secure Fallback Behavior

- In-memory fallback system
- Rate limiting without Redis
- Fallback reset functionality

### 7. Edge Cases and Resilience

- Rapid state transitions
- Various identifier formats
- Empty/whitespace handling

### 8. Configuration and Maintenance

- Constant validation
- Mathematical soundness
- Result structure validation
- Cleanup function handling

### 9. Reset and Recovery

- Post-reset recovery
- Multiple reset handling

## Test Environment

### Local Testing

- Uses `bun test` for running tests
- Redis container started via Docker Compose
- Tests run against local Redis instance with fallback to in-memory

### CI/CD Testing

- GitHub Actions runs tests in parallel
- Single Redis instance for all tests
- Optimized for efficiency and maintainability

## Key Test Scenarios

### 1. Sliding Window Algorithm

Tests the true sliding window implementation that provides accurate rate limiting by:

- Counting requests in rolling time windows
- Properly handling window boundaries
- Maintaining data integrity under load

### 2. Rate Limit Enforcement

Verifies that the rate limiter correctly:

- Allows requests up to the limit (`MAX_REQUESTS_PER_WINDOW = 3`)
- Blocks requests when the limit is exceeded
- Provides accurate remaining count and reset time

### 3. Edge Cases

Tests critical boundary conditions:

- Exactly `MAX_REQUESTS_PER_WINDOW` requests
- Window boundary transitions
- Concurrent request handling
- Rapid successive requests

### 4. Fallback System

Tests the secure in-memory fallback when Redis is unavailable:

- Rate limiting continues to work
- Separate counters for different identifiers
- Proper reset functionality
- Memory efficiency

## Running Tests

### All Rate Limiter Tests

```bash
bun test tests/rate-limiter/
```

### Specific Test Category

```bash
# Run only core functionality tests
bun test tests/rate-limiter/ --grep "Core Functionality"

# Run only performance tests
bun test tests/rate-limiter/ --grep "Performance"

# Run only fallback behavior tests
bun test tests/rate-limiter/ --grep "Secure Fallback"
```

### With Coverage

```bash
bun test tests/rate-limiter/ --coverage
```

### All Tests

```bash
bun test tests/
```

## Test Coverage

The consolidated test suite provides comprehensive coverage of:

- **Function coverage**: 85.71% for rate-limiter.ts
- **Line coverage**: 94.67% for rate-limiter.ts
- **Edge cases**: Boundary conditions and error scenarios
- **Integration**: Real Redis operations and concurrent handling
- **Fallback system**: In-memory rate limiting when Redis is unavailable

## Test Organization Benefits

### Before (Separate Files)

- `tests/core/rate-limiter.test.ts` (17 tests)
- `tests/integration/sliding-window.test.ts` (18 tests)
- `tests/core/fallback-rate-limiter.test.ts` (18 tests - removed as redundant)
- **Total**: 53 tests across 3 files

### After (Consolidated)

- `tests/rate-limiter/rate-limiter.test.ts` (27 tests)
- **Total**: 27 tests in 1 file

### Benefits Achieved

- **Eliminated duplication**: Removed 26 redundant tests
- **Single source of truth**: All rate limiter testing in one place
- **Easier maintenance**: No duplicate setup/teardown logic
- **Better organization**: Logical grouping by functionality
- **Simplified CI**: Single Redis instance for all tests

## Debugging Failed Tests

When tests fail, check:

1. **Redis availability**: Ensure Redis container is running
2. **Timing issues**: Some tests have built-in delays for CI environments
3. **Rate limit state**: Use `resetRateLimit()` to ensure clean test state
4. **Logs**: Check console output for Redis connection issues

## Performance Considerations

- **Consolidated tests** run efficiently in ~154ms
- **Sliding window tests** include realistic timing scenarios
- **Concurrent tests** validate race condition handling
- **CI environment** uses single Redis instance for efficiency

## Maintenance

- Tests are organized by logical categories with clear separators
- Comprehensive cleanup and teardown after each test
- Performance benchmarks included
- Memory usage validation
- Clear documentation of test purpose and organization

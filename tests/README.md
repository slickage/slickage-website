# Testing Guide

This project uses **Bun's built-in test runner** for all testing needs. The test suite is organized by feature and test type to provide comprehensive coverage of the application.

## Quick Start

Run all tests:

```bash
bun test
```

## Testing Structure

The test suite is organized as follows:

```
tests/
├── security/           # Security-related unit tests
│   ├── rate-limiter.test.ts
│   └── fallback-rate-limiter.test.ts
├── integration/        # Integration tests requiring external services
│   ├── redis-rate-limiting.test.ts
│   └── sliding-window.test.ts
├── utils/             # Utility function tests
│   └── redis.test.ts
└── README.md          # This file
```

## Test Categories

### Unit Tests (`tests/security/`)

- **Rate Limiter Tests**: Core rate limiting logic and constants
- **Fallback Rate Limiter Tests**: In-memory fallback mechanism when Redis is unavailable

### Integration Tests (`tests/integration/`)

- **Redis Rate Limiting**: Tests requiring a running Redis instance
- **Sliding Window Algorithm**: Comprehensive testing of the sliding window implementation

### Utility Tests (`tests/utils/`)

- **Redis Utilities**: Mocked Redis functionality tests

## Running Specific Test Categories

Run all tests in a specific directory:

```bash
bun test tests/security/
bun test tests/integration/
bun test tests/utils/
```

Run a specific test file:

```bash
bun test tests/security/rate-limiter.test.ts
bun test tests/integration/redis-rate-limiting.test.ts
```

## Prerequisites

### For Integration Tests

Some tests require external services to be running:

```bash
# Start Redis for integration tests
docker-compose up -d redis

# Wait for Redis to be ready, then run tests
bun test tests/integration/
```

### For Unit Tests

Unit tests can run without external dependencies:

```bash
bun test tests/security/
bun test tests/utils/
```

## Test Writing Guidelines

### Using Bun's Test Framework

All tests use Bun's built-in test framework:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Feature Name', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  it('should do something specific', () => {
    expect(actual).toBe(expected);
  });
});
```

### Test Organization

- Group related tests using `describe` blocks
- Use descriptive test names that explain the expected behavior
- Include setup and cleanup in `beforeEach` and `afterEach` hooks
- Mock external dependencies when appropriate

### Assertions

Use Bun's `expect` function for assertions:

```typescript
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toContain(expected);
expect(value).toBeGreaterThan(expected);
expect(value).toHaveProperty('propertyName');
```

## Continuous Integration

The test suite is designed to work in CI environments:

1. **Unit tests** run without external dependencies
2. **Integration tests** are skipped when services aren't available
3. **Mock-based tests** provide reliable coverage

## Troubleshooting

### Common Issues

**Tests fail with Redis connection errors:**

- Ensure Redis is running: `docker-compose up -d redis`
- Check Redis connection in `docker-compose.yml`
- Integration tests will be skipped if Redis is unavailable

**TypeScript errors in tests:**

- Ensure all imports are correct
- Check that test files use proper Bun test syntax
- Verify type definitions are available

**Tests run but show no output:**

- Ensure you're using `bun test`
- Check that test files export test functions properly
- Verify test file naming follows the `.test.ts` pattern

### Debug Mode

Run tests with verbose output:

```bash
bun test --verbose
```

## Adding New Tests

### For New Features

1. Create a new test file in the appropriate directory
2. Use Bun's test framework syntax
3. Follow the existing naming conventions
4. Add comprehensive test coverage

### For New Test Categories

1. Create a new directory under `tests/`
2. Add appropriate test files
3. Update this README with new category information

## Performance Testing

The test suite is optimized for fast execution:

- Unit tests run in parallel
- Integration tests are isolated
- Mock-based tests provide fast feedback
- External service tests are clearly marked

## Conclusion

This testing setup provides:

- **Fast execution** with Bun's optimized test runner
- **Comprehensive coverage** across all application features
- **Clear organization** by feature and test type
- **CI-friendly** design with proper fallbacks
- **Easy maintenance** with standard Bun test syntax

Run `bun test` to execute the full test suite and ensure your application is working correctly.

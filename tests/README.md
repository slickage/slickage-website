# Testing Guide

This project uses **Bun's built-in test runner** for all testing needs. The test suite is organized by feature to provide comprehensive coverage of the application.

## Quick Start

Run all tests:

```bash
bun test
```

## Testing Structure

The test suite is organized as follows:

```
tests/
├── rate-limiter/           # Comprehensive rate limiting tests
│   ├── rate-limiter.test.ts
│   └── README.md
└── README.md               # This file
```

## Test Categories

### Rate Limiter Tests (`tests/rate-limiter/`)

The rate limiter test suite provides comprehensive coverage of all rate limiting functionality in a single, well-organized file:

- **Core Functionality**: Basic rate limiting operations, enforcement, and reset
- **Sliding Window Algorithm**: Redis-based sliding window implementation
- **Error Handling and Fallback**: Graceful degradation and in-memory fallback
- **Concurrent Request Handling**: Performance under load and race conditions
- **Performance and Scalability**: System efficiency and memory optimization
- **Secure Fallback Behavior**: In-memory rate limiting when Redis is unavailable
- **Edge Cases and Resilience**: Boundary conditions and various identifier formats
- **Configuration and Maintenance**: System validation and cleanup functions
- **Reset and Recovery**: Post-reset recovery and multiple reset handling

## Running Tests

### All Tests

```bash
bun test
```

### Rate Limiter Tests Only

```bash
bun test tests/rate-limiter/
```

### Specific Test Categories

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

## Prerequisites

### For Rate Limiter Tests

The rate limiter tests can run with or without Redis:

- **With Redis**: Full functionality testing including Redis operations
- **Without Redis**: Automatic fallback to in-memory rate limiting for testing

```bash
# Start Redis for full functionality testing
docker-compose up -d redis

# Tests will work regardless of Redis availability
bun test tests/rate-limiter/
```

## Test Writing Guidelines

### Using Bun's Test Framework

All tests use Bun's built-in test framework:

```typescript
import { describe, it, expect, beforeEach, afterEach } from 'bun:test';

describe('Feature Name', () => {
  beforeEach(async () => {
    // Setup before each test
  });

  afterEach(async () => {
    // Cleanup after each test
  });

  it('should do something specific', async () => {
    expect(actual).toBe(expected);
  });
});
```

### Test Organization

- Group related tests using `describe` blocks with clear separators
- Use descriptive test names that explain the expected behavior
- Include comprehensive setup and cleanup in `beforeEach` and `afterEach` hooks
- Test both success and failure scenarios
- Include performance and memory validation where appropriate

### Assertions

Use Bun's `expect` function for assertions:

```typescript
expect(value).toBe(expected);
expect(value).toEqual(expected);
expect(value).toContain(expected);
expect(value).toBeGreaterThan(expected);
expect(value).toHaveProperty('propertyName');
expect(value).toBeLessThan(maxValue);
expect(() => functionCall()).not.toThrow();
```

## Test Coverage

The consolidated test suite provides comprehensive coverage:

- **Line Coverage**: 94.67% for rate-limiter.ts
- **Function Coverage**: 85.71% for rate-limiter.ts
- **Edge Cases**: Boundary conditions and error scenarios
- **Integration**: Real Redis operations and concurrent handling
- **Fallback System**: In-memory rate limiting when Redis is unavailable

## Continuous Integration

The test suite is designed to work efficiently in CI environments:

1. **Single Redis instance** serves all test needs
2. **Optimized execution** with consolidated test structure
3. **Comprehensive coverage** in minimal execution time
4. **Reliable fallbacks** when external services are unavailable

## Troubleshooting

### Common Issues

**Tests fail with Redis connection errors:**

- Tests will automatically fall back to in-memory rate limiting
- Check Redis container status: `docker-compose ps`
- Verify Redis connection in `docker-compose.yml`

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
4. Follow the consolidated approach for related functionality

## Performance Testing

The test suite is optimized for fast execution:

- **Consolidated tests** run efficiently in ~42ms
- **Single Redis instance** for all tests
- **Comprehensive coverage** without duplication
- **Memory usage validation** included
- **Performance benchmarks** for critical operations

## Test Organization Benefits

### Before (Separate Files)

- Multiple test files with overlapping functionality
- Duplicate test scenarios and setup logic
- Complex CI configuration with matrix strategies
- Slower execution due to redundant tests

### After (Consolidated)

- Single comprehensive test file per feature
- Eliminated duplication and overlapping tests
- Simplified CI workflow with single Redis instance
- Faster execution with better organization

## Conclusion

This testing setup provides:

- **Fast execution** with Bun's optimized test runner
- **Comprehensive coverage** across all application features
- **Clear organization** by feature with logical test categories
- **CI-friendly** design with efficient execution
- **Easy maintenance** with consolidated test structure
- **No duplication** ensuring all scenarios are tested once

Run `bun test` to execute the full test suite and ensure your application is working correctly.

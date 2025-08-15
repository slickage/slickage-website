# Rate Limiter Test Suite

This directory contains the comprehensive test suite for the rate limiting system in the Slickage website.

## Overview

The test suite consolidates all rate limiter testing into a single, well-organized file that covers:

- **Core Functionality**: Basic rate limiting operations
- **Sliding Window Algorithm**: Redis-based sliding window implementation
- **Error Handling**: Graceful degradation and fallback behavior
- **Performance**: Scalability and memory efficiency
- **Edge Cases**: Boundary conditions and resilience
- **Security**: Fallback rate limiting when Redis is unavailable

## Test Categories

### 1. Core Functionality

Tests basic rate limiter operations:

- First request allowance
- Rate limit enforcement
- Status checking without incrementing
- Reset functionality

### 2. Sliding Window Algorithm

Tests the Redis-based sliding window implementation:

- True sliding window behavior
- Window boundary conditions
- Reset time calculations

### 3. Error Handling and Fallback

Tests graceful degradation:

- Redis unavailability handling
- Invalid identifier handling
- Consistent error responses

### 4. Concurrent Request Handling

Tests performance under load:

- Concurrent request processing
- Rapid successive calls
- Race condition handling

### 5. Performance and Scalability

Tests system efficiency:

- Consistent performance under load
- Memory usage optimization
- Large-scale request handling

### 6. Secure Fallback Behavior

Tests the in-memory fallback system:

- Rate limiting without Redis
- Fallback rate limit exhaustion
- Fallback reset functionality

### 7. Edge Cases and Resilience

Tests boundary conditions:

- Rapid state transitions
- Various identifier formats
- Empty/whitespace handling

### 8. Configuration and Maintenance

Tests system configuration:

- Constant validation
- Mathematical soundness
- Result structure validation
- Cleanup function handling

### 9. Reset and Recovery

Tests recovery mechanisms:

- Post-reset recovery
- Multiple reset handling

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
```

### With Coverage

```bash
bun test tests/rate-limiter/ --coverage
```

## Test Environment

- **Runtime**: Bun Test
- **Redis**: Uses local Redis instance (fallback to in-memory when unavailable)
- **Coverage**: Comprehensive coverage of all rate limiter functionality
- **Performance**: Tests designed to complete within reasonable time limits

## Test Data Management

- Each test uses unique identifiers to avoid conflicts
- Automatic cleanup after each test
- Reset functionality tested thoroughly
- Memory usage monitored and validated

## Coverage Goals

- **Line Coverage**: >94% (currently 94.67%)
- **Function Coverage**: >85% (currently 85.71%)
- **Edge Case Coverage**: Comprehensive boundary testing
- **Integration Coverage**: Full Redis and fallback testing

## Maintenance

- Tests are organized by logical categories
- Clear separation of concerns
- Comprehensive cleanup and teardown
- Performance benchmarks included
- Memory usage validation

## Integration with CI/CD

The test suite is designed to work with the CI/CD pipeline:

- Single Redis instance for all tests
- Optimized for parallel execution
- Clear error reporting
- Performance validation

# Test Suite

This directory contains the comprehensive test suite for the Slickage website.

## Test Organization

### Unit Tests (`tests/unit/`)

Fast, isolated tests that don't require external services:

- **Rate Limiter**: Tests in-memory fallback behavior when Redis is unavailable
- **Components**: UI component testing
- **Utilities**: Helper function testing

### Integration Tests (`tests/integration/`)

Comprehensive tests that require external services:

- **Rate Limiter Redis**: Tests Redis-based rate limiting functionality
- **API Endpoints**: End-to-end API testing
- **Database**: Database integration testing

## Running Tests

```bash
# Run all tests
bun test

# Run only unit tests (fast, no external dependencies)
bun test tests/unit/

# Run only integration tests (requires services)
bun test tests/integration/

# Run specific test file
bun test tests/unit/rate-limiter/rate-limiter.test.ts
```

## Test Environment

### Local Development

- Unit tests run without external dependencies
- Integration tests require local Redis instance
- Use `docker-compose up redis` to start Redis locally

### CI/CD Pipeline

- All tests run in GitHub Actions
- Redis service container provided automatically
- Environment variables configured for testing

## Test Coverage

- **Unit Tests**: Core functionality, edge cases, error handling
- **Integration Tests**: Real service interactions, performance, scalability
- **Fallback Testing**: Ensures graceful degradation when services fail

## Adding New Tests

1. **Unit Tests**: Place in `tests/unit/` for fast, isolated testing
2. **Integration Tests**: Place in `tests/integration/` for service-dependent testing
3. **Follow Naming**: Use descriptive names and organize by feature
4. **Documentation**: Update relevant README files

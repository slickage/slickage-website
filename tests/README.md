# Testing Structure

This directory contains all test files for the Slickage Website project, organized following testing best practices.

## Directory Structure

```
tests/
├── README.md                    # This file - testing documentation
├── run-tests.ts                 # Main test runner script
├── setup.ts                     # Test environment setup
├── security/                    # Security-related tests
│   └── rate-limiter.test.ts    # Rate limiting unit tests
├── utils/                       # Utility function tests
│   └── redis.test.ts           # Redis connection tests (placeholder)
└── integration/                 # Integration tests
    └── redis-rate-limiting.test.ts  # Redis rate limiting integration tests
```

## Test File Naming Conventions

- **Unit Tests**: `*.test.ts` - Test individual functions/components
- **Integration Tests**: `*.integration.test.ts` - Test component interactions
- **Test Runner**: `run-tests.ts` - Main script to run all tests

## Running Tests

### Run All Tests (Recommended)

```bash
bun run test
```

### Run Specific Test Categories

```bash
# Run only security tests
bun run test:security

# Run only integration tests
bun run test:integration

# Run only unit tests
bun run test:unit

# Run specific test file
bun run tests/integration/redis-rate-limiting.test.ts
```

### Test Runner Features

The main test runner (`run-tests.ts`) provides:

- **Sequential Execution**: Tests run in the proper order
- **Clear Output**: Easy-to-read test results
- **Summary Report**: Total tests, passed, and failed counts
- **Integration Check**: Verifies Redis availability for integration tests

## Test Types

### 1. Unit Tests (`tests/security/`)

- **Purpose**: Test individual functions in isolation
- **Dependencies**: Minimal, no external services
- **Speed**: Fast execution
- **Example**: Testing rate limiter constants and basic functionality

### 2. Integration Tests (`tests/integration/`)

- **Purpose**: Test component interactions and external services
- **Dependencies**: Redis, PostgreSQL, Docker
- **Speed**: Slower due to external dependencies
- **Example**: Testing Redis rate limiting with actual Redis instance

### 3. Test Runner (`tests/run-tests.ts`)

- **Purpose**: Orchestrate and run all tests
- **Features**: Sequential execution, clear reporting, error handling
- **Output**: Formatted test results with pass/fail counts

## Test Writing Guidelines

1. **Simple Structure**: Use basic JavaScript/TypeScript without complex testing frameworks
2. **Clear Output**: Provide readable console output with emojis and formatting
3. **Error Handling**: Catch and report errors gracefully
4. **Modular Design**: Each test file exports a test function
5. **Easy Maintenance**: Keep tests simple and focused

## Example Test Structure

```typescript
// tests/example.test.ts
export function testExample() {
  console.log('🧪 Testing Example...\n');

  let testsPassed = 0;
  let totalTests = 1;

  // Test logic here
  try {
    if (/* test condition */) {
      console.log('✅ Test passed');
      testsPassed++;
    } else {
      console.log('❌ Test failed');
    }
  } catch (error) {
    console.log('❌ Test error:', error);
  }

  // Report results
  console.log(`\n📊 Results: ${testsPassed}/${totalTests} tests passed`);
  return testsPassed === totalTests;
}
```

## Test Dependencies

- **Bun**: Runtime and package manager
- **Redis**: For integration tests (requires Docker)
- **PostgreSQL**: For database tests (requires Docker)

## Running Integration Tests

Integration tests require external services to be running:

```bash
# Start required services
docker-compose up -d redis postgres

# Run integration tests
bun run test:integration

# Or run specific integration test
bun run tests/integration/redis-rate-limiting.test.ts
```

## Adding New Tests

1. **Create Test File**: Add to appropriate directory (`security/`, `utils/`, `integration/`)
2. **Export Test Function**: Export a function that returns boolean success/failure
3. **Add to Runner**: Import and add to `tests/run-tests.ts`
4. **Update Scripts**: Add new npm scripts if needed

## Continuous Integration

Tests can be integrated into CI/CD pipelines by running:

```bash
bun run test
```

The test runner will exit with appropriate exit codes (0 for success, 1 for failure).

## Troubleshooting

### Common Issues

1. **Redis Not Available**: Start Redis with `docker-compose up -d redis`
2. **Test Import Errors**: Check file paths and import statements
3. **Permission Issues**: Ensure test files are executable

### Debug Mode

For debugging, run individual test files:

```bash
bun run tests/security/rate-limiter.test.ts
```

This provides detailed output for troubleshooting specific tests.

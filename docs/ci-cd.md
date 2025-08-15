# CI/CD Workflow Guide

## Overview

This document outlines the current CI/CD pipeline configuration for the Slickage website, including the CI workflow for code quality checks and testing, and the deployment workflow for production releases.

## Current Workflow Structure

### CI Workflow (`.github/workflows/ci.yml`)

The CI workflow runs on pull requests to `main` and `prod` branches, performing code quality checks and running the test suite.

#### Triggers

- **Pull Requests**: Triggers on PRs to `main` and `prod` branches
- **Concurrency**: Cancels outdated runs to prevent resource waste

#### Jobs

##### 1. Code Quality Check

- **Runner**: Ubuntu latest
- **Steps**:
  - Checkout code
  - Setup Bun (latest version)
  - Install dependencies
  - Format check (`bun run format:check`)
  - Lint (`bun run lint`)
  - Type check (`bun run tsc:check`)

##### 2. Test Suite

- **Runner**: Ubuntu latest
- **Services**: Redis 7-alpine with health checks
- **Steps**:
  - Checkout code
  - Setup Bun (latest version)
  - Install dependencies
  - Run tests (`bun test`)
  - Environment: `NODE_ENV=test`, `REDIS_URL=redis://localhost:6380`

### Deploy Workflow (`.github/workflows/deploy.yml`)

The deployment workflow automatically deploys to Amazon ECR when code is pushed to the `prod` branch.

#### Triggers

- **Push**: Triggers on pushes to `prod` branch
- **Concurrency**: Prevents multiple deployments (doesn't cancel in-progress)

#### Jobs

##### Deploy to ECR

- **Runner**: Ubuntu latest
- **Steps**:
  - Checkout code
  - Configure AWS credentials
  - Login to Amazon ECR
  - Build and push Docker image with both commit SHA and `latest` tags

## Current Performance Characteristics

### CI Workflow

- **Code Quality Job**: ~30-45 seconds (format, lint, type check)
- **Test Suite Job**: ~30-60 seconds (depends on test complexity)
- **Total CI Time**: ~60-105 seconds (sequential execution)
- **Redis Service**: Single Redis instance on port 6380

### Deploy Workflow

- **Deploy Time**: ~3-5 minutes (Docker build + push to ECR)
- **Image Tags**: Both commit SHA and `latest` tags for versioning

## Workflow Features

### Concurrency Management

- **CI Workflow**: Cancels outdated runs to prevent resource waste
- **Deploy Workflow**: Prevents multiple deployments but allows in-progress ones to complete

### Service Dependencies

- **Redis Service**: Health-checked Redis instance for test environment
- **Port Mapping**: Redis accessible on port 6380 for tests

### Security

- **Permissions**: Minimal required permissions for each workflow
- **Secrets**: AWS credentials and ECR repository information stored as secrets

## Implementation Status

### ✅ Current Implementation (COMPLETED)

1. **Basic CI Pipeline**: Code quality checks and test execution
2. **Redis Service**: Health-checked Redis service for tests
3. **ECR Deployment**: Automated Docker build and push to ECR
4. **Concurrency Control**: Prevents resource waste and deployment conflicts

### 🔄 Potential Future Optimizations

1. **Job Dependencies**: Make test job depend on code quality job
2. **Dependency Caching**: Cache dependencies between jobs
3. **Matrix Strategy**: Parallel test execution for different test types
4. **Enhanced Caching**: Cache Bun cache and node_modules
5. **Test Splitting**: Separate integration and unit tests

## Best Practices Implemented

### Code Quality

- **Format Check**: Ensures consistent code formatting
- **Linting**: Catches code quality issues early
- **Type Checking**: Validates TypeScript types before testing

### Testing

- **Service Health Checks**: Robust Redis service monitoring
- **Environment Isolation**: Test-specific environment variables
- **Dependency Management**: Fresh dependency installation for each run

### Deployment

- **Image Tagging**: Both versioned (SHA) and latest tags
- **AWS Security**: Proper credential management
- **Concurrency Control**: Prevents deployment conflicts

## Monitoring and Metrics

### Key Metrics to Track

- **CI Duration**: Total time from PR to completion
- **Test Execution Time**: Time for test suite completion
- **Deployment Success Rate**: Percentage of successful deployments
- **Build Time**: Docker image build duration

### Tools for Monitoring

- **GitHub Actions Analytics**: Built-in workflow metrics
- **AWS CloudWatch**: ECR push metrics and logs
- **GitHub Notifications**: Workflow status updates

## Configuration Files

### CI Workflow (`.github/workflows/ci.yml`)

```yaml
name: CI
on:
  pull_request:
    branches: [main, prod]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
# ... rest of configuration
```

### Deploy Workflow (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to ECR
on:
  push:
    branches: [prod]

concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: false
# ... rest of configuration
```

## Environment Variables

### CI Environment

- `NODE_ENV`: `test`
- `REDIS_URL`: `redis://localhost:6380`

### Deploy Environment

- `ECR_REPOSITORY`: ECR repository URL from secrets
- `IMAGE_TAG`: Git commit SHA
- `AWS_REGION`: AWS region from secrets

## Dependencies

### CI Dependencies

- **Bun**: Latest version for package management and testing
- **Redis**: 7-alpine for test environment
- **Node.js**: Provided by Bun runtime

### Deploy Dependencies

- **Docker**: For building and pushing images
- **AWS CLI**: For ECR authentication and operations

## References

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Bun CI/CD Integration](https://bun.sh/docs/ci)
- [Amazon ECR Documentation](https://docs.aws.amazon.com/ecr/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Concurrency](https://docs.github.com/en/actions/using-jobs/using-concurrency)

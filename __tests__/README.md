# Testing Setup

This project uses Jest with React Testing Library for testing. The setup follows the [Next.js testing guide](https://nextjs.org/docs/app/guides/testing/jest).

## Test Structure

- `__tests__/` - Root test directory
- `__tests__/components/` - Component tests
- `__tests__/utils/` - Utility function tests
- `__tests__/page.test.tsx` - Page component tests

## Running Tests

```bash
# Run all tests
bun run test

# Run tests in watch mode
bun run test:watch

# Run tests with coverage
bun run test:coverage

# Run specific test file
npx jest __tests__/components/button.test.tsx

# Run tests matching a pattern
npx jest --testNamePattern="Button"
```

## Writing Tests

### Component Tests

```tsx
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })
})
```

### Utility Function Tests

```tsx
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })
})
```

### Async Component Tests

For components that use async data fetching, mock the async components:

```tsx
// Mock async components
jest.mock('@/components/insights-section', () => {
  return function MockInsightsSection() {
    return <div data-testid="insights-section">Insights Section</div>
  }
})

describe('Home', () => {
  it('renders the home page', async () => {
    render(<Home />)
    
    // Wait for async content to load
    await screen.findByTestId('insights-section')
    
    expect(screen.getByTestId('insights-section')).toBeInTheDocument()
  })
})
```

## Testing Best Practices

1. **Test user behavior, not implementation details**
2. **Use semantic queries** (`getByRole`, `getByText`) over test-specific queries
3. **Test accessibility** by using role-based queries
4. **Mock external dependencies** and async operations
5. **Use descriptive test names** that explain the expected behavior
6. **Keep tests simple and focused** on one behavior per test

## Available Queries

- `getByRole` - Find elements by their ARIA role
- `getByText` - Find elements by their text content
- `getByLabelText` - Find form elements by their label
- `getByPlaceholderText` - Find inputs by placeholder
- `getByTestId` - Find elements by test ID (use sparingly)

## Configuration

The Jest configuration is in `jest.config.ts` and includes:

- Next.js integration via `next/jest`
- JSDOM environment for DOM testing
- Module path aliases (`@/` → `src/`)
- Custom matchers from `@testing-library/jest-dom`

## Coverage

To generate coverage reports:

```bash
bun run test:coverage
```

This will create a `coverage/` directory with detailed reports. 
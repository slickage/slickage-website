import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RootLayout from '../../src/app/layout'

// Mock the metadata
jest.mock('../../src/app/layout', () => {
  const originalModule = jest.requireActual('../../src/app/layout')
  return {
    ...originalModule,
    metadata: {
      title: 'Slickage - Software Engineering',
      description: 'Boutique software engineering company',
    }
  }
})

describe('RootLayout', () => {
  it('renders the layout with children', () => {
    render(
      <RootLayout>
        <div data-testid="test-child">Test Content</div>
      </RootLayout>
    )
    
    expect(screen.getByTestId('test-child')).toBeInTheDocument()
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('renders header component', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Check for header (it should be present in the layout)
    expect(screen.getByRole('banner')).toBeInTheDocument()
  })

  it('renders footer component', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Check for footer (it should be present in the layout)
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders main content area', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Check for main content area
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('applies proper HTML structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Check for proper HTML structure
    const html = document.querySelector('html')
    const body = document.querySelector('body')
    
    expect(html).toBeInTheDocument()
    expect(body).toBeInTheDocument()
  })

  it('includes proper language attribute', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    const html = document.querySelector('html')
    expect(html).toHaveAttribute('lang', 'en')
  })

  it('includes proper viewport meta tag', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    )
    
    // Check for viewport meta tag
    const viewportMeta = document.querySelector('meta[name="viewport"]')
    expect(viewportMeta).toBeInTheDocument()
  })
}) 
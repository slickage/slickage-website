import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Button } from '../../src/components/ui/button'

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>)
    
    const button = screen.getByRole('button', { name: /click me/i })
    expect(button).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Delete</Button>)
    
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button).toHaveClass('bg-destructive')
  })

  it('applies size classes correctly', () => {
    render(<Button size="sm">Small</Button>)
    
    const button = screen.getByRole('button', { name: /small/i })
    // Check for the actual class that should be applied for small size
    expect(button).toHaveClass('h-8')
  })

  it('handles disabled state', () => {
    render(<Button disabled>Disabled</Button>)
    
    const button = screen.getByRole('button', { name: /disabled/i })
    expect(button).toBeDisabled()
  })
}) 
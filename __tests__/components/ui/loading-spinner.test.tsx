import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import LoadingSpinner, { LoadingSpinnerOverlay } from '../../../src/components/ui/LoadingSpinner'

describe('LoadingSpinner', () => {
  describe('LoadingSpinner', () => {
    it('renders loading spinner with default size', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
    })

    it('renders loading spinner with small size', () => {
      render(<LoadingSpinner size="sm" />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-6', 'h-6')
    })

    it('renders loading spinner with medium size', () => {
      render(<LoadingSpinner size="md" />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-8', 'h-8')
    })

    it('renders loading spinner with large size', () => {
      render(<LoadingSpinner size="lg" />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toBeInTheDocument()
      expect(spinner).toHaveClass('w-12', 'h-12')
    })

    it('renders loading spinner with custom className', () => {
      render(<LoadingSpinner className="custom-spinner" />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toHaveClass('custom-spinner')
    })

    it('has correct accessibility attributes', () => {
      render(<LoadingSpinner />)
      
      const spinner = screen.getByRole('status', { hidden: true })
      expect(spinner).toHaveAttribute('aria-label', 'Loading')
    })
  })

  describe('LoadingSpinnerOverlay', () => {
    it('renders loading spinner overlay', () => {
      render(<LoadingSpinnerOverlay />)
      
      const overlay = screen.getByRole('status', { hidden: true })
      expect(overlay).toBeInTheDocument()
    })

    it('renders loading spinner overlay with custom className', () => {
      render(<LoadingSpinnerOverlay className="custom-overlay" />)
      
      const overlay = screen.getByRole('status', { hidden: true })
      expect(overlay).toHaveClass('custom-overlay')
    })

    it('has correct overlay styling', () => {
      render(<LoadingSpinnerOverlay />)
      
      const overlay = screen.getByRole('status', { hidden: true })
      expect(overlay).toHaveClass('absolute', 'inset-0', 'flex', 'items-center', 'justify-center')
    })
  })
}) 
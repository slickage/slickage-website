import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import ErrorPage from '../../src/app/error'

describe('ErrorPage', () => {
  const mockError = new Error('Test error message')
  const mockReset = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders error page with error message', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
    expect(screen.getByText(/test error message/i)).toBeInTheDocument()
  })

  it('renders reset button', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    
    const resetButton = screen.getByRole('button', { name: /try again/i })
    expect(resetButton).toBeInTheDocument()
  })

  it('calls reset function when button is clicked', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    
    const resetButton = screen.getByRole('button', { name: /try again/i })
    fireEvent.click(resetButton)
    
    expect(mockReset).toHaveBeenCalledTimes(1)
  })

  it('handles error without message', () => {
    const errorWithoutMessage = new Error()
    render(<ErrorPage error={errorWithoutMessage} reset={mockReset} />)
    
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument()
  })

  it('handles error with digest', () => {
    const errorWithDigest = new Error('Test error')
    errorWithDigest.digest = 'test-digest'
    
    render(<ErrorPage error={errorWithDigest} reset={mockReset} />)
    
    expect(screen.getByText(/test error/i)).toBeInTheDocument()
  })

  it('renders with proper styling', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    
    const container = screen.getByRole('main')
    expect(container).toHaveClass('flex', 'min-h-screen', 'flex-col', 'items-center', 'justify-center')
  })

  it('renders error icon', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />)
    
    // Check for error icon (usually an SVG or icon element)
    const errorIcon = screen.getByTestId('error-icon') || screen.getByRole('img', { hidden: true })
    expect(errorIcon).toBeInTheDocument()
  })
}) 
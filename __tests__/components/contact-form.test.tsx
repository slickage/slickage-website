import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ContactForm from '../../src/components/contact/contact-form'

// Mock the reCAPTCHA
global.grecaptcha = {
  execute: jest.fn().mockResolvedValue('mock-token'),
  ready: jest.fn((callback) => callback()),
} as any

// Mock fetch for API calls
global.fetch = jest.fn()

describe('ContactForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders the contact form', () => {
    render(<ContactForm />)
    
    expect(screen.getByRole('form')).toBeInTheDocument()
  })

  it('renders all required form fields', () => {
    render(<ContactForm />)
    
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/company or project name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/how can we help you/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    expect(submitButton).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    render(<ContactForm />)
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument()
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument()
      expect(screen.getByText(/message is required/i)).toBeInTheDocument()
    })
  })

  it('validates email format', async () => {
    render(<ContactForm />)
    
    const emailInput = screen.getByLabelText(/email/i)
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/invalid email address/i)).toBeInTheDocument()
    })
  })

  it('formats phone number correctly', () => {
    render(<ContactForm />)
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    fireEvent.change(phoneInput, { target: { value: '1234567890' } })
    
    expect(phoneInput).toHaveValue('(123) 456-7890')
  })

  it('handles form submission successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true, submissionId: 'test-id' })
    })
    
    render(<ContactForm />)
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/company or project name/i), { target: { value: 'Test Project' } })
    fireEvent.change(screen.getByLabelText(/how can we help you/i), { target: { value: 'Test message' } })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/thank you for your message/i)).toBeInTheDocument()
    })
  })

  it('handles form submission error', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: 'Submission failed' })
    })
    
    render(<ContactForm />)
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/company or project name/i), { target: { value: 'Test Project' } })
    fireEvent.change(screen.getByLabelText(/how can we help you/i), { target: { value: 'Test message' } })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/submission failed/i)).toBeInTheDocument()
    })
  })

  it('prevents multiple submissions', async () => {
    (global.fetch as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    
    render(<ContactForm />)
    
    // Fill in required fields
    fireEvent.change(screen.getByLabelText(/name/i), { target: { value: 'John Doe' } })
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'john@example.com' } })
    fireEvent.change(screen.getByLabelText(/company or project name/i), { target: { value: 'Test Project' } })
    fireEvent.change(screen.getByLabelText(/how can we help you/i), { target: { value: 'Test message' } })
    
    const submitButton = screen.getByRole('button', { name: /submit/i })
    fireEvent.click(submitButton)
    
    // Try to submit again
    fireEvent.click(submitButton)
    
    expect(submitButton).toBeDisabled()
  })

  it('renders in standalone mode', () => {
    render(<ContactForm standalone={true} />)
    
    // Should not have the contact section wrapper
    expect(screen.queryByTestId('contact-section')).not.toBeInTheDocument()
  })
}) 
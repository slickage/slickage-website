import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import ContactPage from '../../src/app/contact/page'

// Mock the contact components
jest.mock('../../src/components/contact/contact-hero', () => {
  return function MockContactHero() {
    return <div data-testid="contact-hero">Contact Hero</div>
  }
})

jest.mock('../../src/components/contact/contact-form', () => {
  return function MockContactForm() {
    return <div data-testid="contact-form">Contact Form</div>
  }
})

jest.mock('../../src/components/contact/contact-info', () => {
  return function MockContactInfo() {
    return <div data-testid="contact-info">Contact Info</div>
  }
})

jest.mock('../../src/components/contact/faq-section', () => {
  return function MockFaqSection() {
    return <div data-testid="faq-section">FAQ Section</div>
  }
})

describe('ContactPage', () => {
  it('renders the contact page', async () => {
    render(<ContactPage />)
    
    // Check if all sections are rendered
    expect(screen.getByTestId('contact-hero')).toBeInTheDocument()
    expect(screen.getByTestId('contact-form')).toBeInTheDocument()
    expect(screen.getByTestId('contact-info')).toBeInTheDocument()
    expect(screen.getByTestId('faq-section')).toBeInTheDocument()
  })

  it('renders page title', async () => {
    render(<ContactPage />)
    
    // Check for page title
    expect(screen.getByText(/get in touch/i)).toBeInTheDocument()
  })

  it('renders contact form in standalone mode', async () => {
    render(<ContactPage />)
    
    const contactForm = screen.getByTestId('contact-form')
    expect(contactForm).toBeInTheDocument()
  })
}) 
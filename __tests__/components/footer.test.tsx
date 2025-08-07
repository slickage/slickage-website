import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Footer from '../../src/components/footer'

describe('Footer', () => {
  it('renders the footer', () => {
    render(<Footer />)
    
    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
  })

  it('renders company section with links', () => {
    render(<Footer />)
    
    const companyHeading = screen.getByRole('heading', { name: /company/i })
    expect(companyHeading).toBeInTheDocument()
    
    const insightsLink = screen.getByRole('link', { name: /insights/i })
    expect(insightsLink).toHaveAttribute('href', '/#insights')
    
    const contactLink = screen.getByRole('link', { name: /contact us/i })
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('renders social media links', () => {
    render(<Footer />)
    
    const socialLinks = screen.getAllByRole('link')
    const socialLink = socialLinks.find(link => link.getAttribute('target') === '_blank')
    expect(socialLink).toBeInTheDocument()
  })

  it('renders copyright information', () => {
    render(<Footer />)
    
    const currentYear = new Date().getFullYear()
    expect(screen.getByText(new RegExp(`© ${currentYear} Slickage`))).toBeInTheDocument()
  })

  it('renders privacy policy link', () => {
    render(<Footer />)
    
    const privacyLink = screen.getByRole('link', { name: /privacy policy/i })
    expect(privacyLink).toHaveAttribute('href', '/privacy-policy')
  })

  it('renders cookie policy link', () => {
    render(<Footer />)
    
    const cookieLink = screen.getByRole('link', { name: /cookie policy/i })
    expect(cookieLink).toHaveAttribute('href', '/cookie-policy')
  })

  it('renders company name', () => {
    render(<Footer />)
    
    const companyName = screen.getByText('Slickage')
    expect(companyName).toBeInTheDocument()
  })

  it('renders company description', () => {
    render(<Footer />)
    
    expect(screen.getByText(/boutique software company/i)).toBeInTheDocument()
  })
}) 
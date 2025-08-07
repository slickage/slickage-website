import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import Header from '../../src/components/header'

describe('Header', () => {
  it('renders the header with logo', () => {
    render(<Header />)
    
    const logo = screen.getByAltText('Company Logo')
    expect(logo).toBeInTheDocument()
  })

  it('renders navigation with contact button', () => {
    render(<Header />)
    
    const contactButton = screen.getByRole('button', { name: /get in touch/i })
    expect(contactButton).toBeInTheDocument()
  })

  it('renders mobile menu button', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
    expect(mobileMenuButton).toBeInTheDocument()
  })

  it('opens mobile menu when menu button is clicked', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mobileMenuButton)
    
    const mobileMenu = screen.getByRole('menu', { name: /mobile navigation/i })
    expect(mobileMenu).toBeInTheDocument()
  })

  it('closes mobile menu when close button is clicked', () => {
    render(<Header />)
    
    const mobileMenuButton = screen.getByRole('button', { name: /open menu/i })
    fireEvent.click(mobileMenuButton)
    
    const closeButton = screen.getByRole('button', { name: /close menu/i })
    fireEvent.click(closeButton)
    
    expect(screen.queryByRole('menu', { name: /mobile navigation/i })).not.toBeInTheDocument()
  })

  it('has correct link to home page', () => {
    render(<Header />)
    
    const homeLink = screen.getByRole('link', { name: /company logo/i })
    expect(homeLink).toHaveAttribute('href', '/')
  })

  it('has correct link to contact page', () => {
    render(<Header />)
    
    const contactLink = screen.getByRole('link', { name: /get in touch/i })
    expect(contactLink).toHaveAttribute('href', '/contact')
  })
}) 
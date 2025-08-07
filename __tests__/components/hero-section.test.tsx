import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import HeroSection from '../../src/components/hero-section'

describe('HeroSection', () => {
  it('renders hero section', () => {
    render(<HeroSection />)
    
    // Check if the hero section renders with its content
    expect(screen.getByText(/We build software that works/i)).toBeInTheDocument()
  })

  it('contains call to action button', () => {
    render(<HeroSection />)
    
    // Check for the CTA button
    expect(screen.getByRole('button', { name: /view our work/i })).toBeInTheDocument()
  })

  it('contains hero description', () => {
    render(<HeroSection />)
    
    // Check for the description text
    expect(screen.getByText(/Fast, reliable, and beautifully crafted/i)).toBeInTheDocument()
  })
}) 
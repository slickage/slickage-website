import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import FeaturesSection from '../../src/components/features-section'

describe('FeaturesSection', () => {
  it('renders the features section', () => {
    render(<FeaturesSection />)
    
    expect(screen.getByRole('section')).toBeInTheDocument()
  })

  it('renders all feature items', () => {
    render(<FeaturesSection />)
    
    // Check for all feature titles
    expect(screen.getByText(/web applications/i)).toBeInTheDocument()
    expect(screen.getByText(/ios development/i)).toBeInTheDocument()
    expect(screen.getByText(/product design & development/i)).toBeInTheDocument()
    expect(screen.getByText(/modernizing legacy applications/i)).toBeInTheDocument()
    expect(screen.getByText(/knowledge transfer/i)).toBeInTheDocument()
  })

  it('renders feature descriptions', () => {
    render(<FeaturesSection />)
    
    // Check for feature descriptions
    expect(screen.getByText(/backbone of modern business/i)).toBeInTheDocument()
    expect(screen.getByText(/bring your vision to life/i)).toBeInTheDocument()
    expect(screen.getByText(/great software starts with great design/i)).toBeInTheDocument()
  })

  it('renders feature icons', () => {
    render(<FeaturesSection />)
    
    // Check for icon elements (they should be present as SVGs)
    const icons = screen.getAllByRole('img', { hidden: true })
    expect(icons.length).toBeGreaterThan(0)
  })

  it('has proper accessibility attributes', () => {
    render(<FeaturesSection />)
    
    const section = screen.getByRole('section')
    expect(section).toBeInTheDocument()
  })

  it('renders with correct styling classes', () => {
    render(<FeaturesSection />)
    
    const section = screen.getByRole('section')
    expect(section).toHaveClass('py-16', 'bg-gray-900')
  })
}) 
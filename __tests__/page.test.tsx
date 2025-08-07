import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import Home from '../src/app/page'

// Mock the async components
jest.mock('../src/components/insights-section', () => {
  return function MockInsightsSection() {
    return <div data-testid="insights-section">Insights Section</div>
  }
})

describe('Home', () => {
  it('renders the home page', async () => {
    render(<Home />)
    
    // Wait for async content to load
    await screen.findByTestId('insights-section')
    
    // Check if the page renders without crashing
    expect(screen.getByTestId('insights-section')).toBeInTheDocument()
  })

  it('renders hero section', async () => {
    render(<Home />)
    
    // Wait for async content to load
    await screen.findByTestId('insights-section')
    
    // Check for hero content - look for the main heading
    expect(screen.getByText(/We build software that works/i)).toBeInTheDocument()
  })
}) 
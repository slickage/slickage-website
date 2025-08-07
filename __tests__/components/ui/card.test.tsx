import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../../../src/components/ui/card'

describe('Card Components', () => {
  describe('Card', () => {
    it('renders card with default props', () => {
      render(<Card>Card content</Card>)
      
      const card = screen.getByText('Card content')
      expect(card).toBeInTheDocument()
    })

    it('renders card with custom className', () => {
      render(<Card className="custom-class">Card content</Card>)
      
      const card = screen.getByText('Card content').parentElement
      expect(card).toHaveClass('custom-class')
    })
  })

  describe('CardHeader', () => {
    it('renders card header', () => {
      render(<CardHeader>Header content</CardHeader>)
      
      const header = screen.getByText('Header content')
      expect(header).toBeInTheDocument()
    })

    it('renders card header with custom className', () => {
      render(<CardHeader className="custom-header">Header content</CardHeader>)
      
      const header = screen.getByText('Header content')
      expect(header).toHaveClass('custom-header')
    })
  })

  describe('CardTitle', () => {
    it('renders card title', () => {
      render(<CardTitle>Card Title</CardTitle>)
      
      const title = screen.getByText('Card Title')
      expect(title).toBeInTheDocument()
    })

    it('renders card title with custom className', () => {
      render(<CardTitle className="custom-title">Card Title</CardTitle>)
      
      const title = screen.getByText('Card Title')
      expect(title).toHaveClass('custom-title')
    })
  })

  describe('CardDescription', () => {
    it('renders card description', () => {
      render(<CardDescription>Card description</CardDescription>)
      
      const description = screen.getByText('Card description')
      expect(description).toBeInTheDocument()
    })

    it('renders card description with custom className', () => {
      render(<CardDescription className="custom-description">Card description</CardDescription>)
      
      const description = screen.getByText('Card description')
      expect(description).toHaveClass('custom-description')
    })
  })

  describe('CardContent', () => {
    it('renders card content', () => {
      render(<CardContent>Card content</CardContent>)
      
      const content = screen.getByText('Card content')
      expect(content).toBeInTheDocument()
    })

    it('renders card content with custom className', () => {
      render(<CardContent className="custom-content">Card content</CardContent>)
      
      const content = screen.getByText('Card content')
      expect(content).toHaveClass('custom-content')
    })
  })

  describe('CardFooter', () => {
    it('renders card footer', () => {
      render(<CardFooter>Footer content</CardFooter>)
      
      const footer = screen.getByText('Footer content')
      expect(footer).toBeInTheDocument()
    })

    it('renders card footer with custom className', () => {
      render(<CardFooter className="custom-footer">Footer content</CardFooter>)
      
      const footer = screen.getByText('Footer content')
      expect(footer).toHaveClass('custom-footer')
    })
  })

  describe('Card Composition', () => {
    it('renders complete card with all components', () => {
      render(
        <Card>
          <CardHeader>
            <CardTitle>Test Title</CardTitle>
            <CardDescription>Test Description</CardDescription>
          </CardHeader>
          <CardContent>Test Content</CardContent>
          <CardFooter>Test Footer</CardFooter>
        </Card>
      )
      
      expect(screen.getByText('Test Title')).toBeInTheDocument()
      expect(screen.getByText('Test Description')).toBeInTheDocument()
      expect(screen.getByText('Test Content')).toBeInTheDocument()
      expect(screen.getByText('Test Footer')).toBeInTheDocument()
    })
  })
}) 
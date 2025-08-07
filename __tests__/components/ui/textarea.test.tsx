import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Textarea } from '../../../src/components/ui/textarea'

describe('Textarea', () => {
  it('renders textarea with default props', () => {
    render(<Textarea />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeInTheDocument()
  })

  it('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Enter your message" />)
    
    const textarea = screen.getByPlaceholderText('Enter your message')
    expect(textarea).toBeInTheDocument()
  })

  it('renders textarea with value', () => {
    render(<Textarea value="test value" readOnly />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('test value')
  })

  it('renders textarea with custom className', () => {
    render(<Textarea className="custom-class" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('custom-class')
  })

  it('renders textarea with id', () => {
    render(<Textarea id="test-textarea" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('id', 'test-textarea')
  })

  it('renders textarea with name', () => {
    render(<Textarea name="test-name" />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('name', 'test-name')
  })

  it('renders disabled textarea', () => {
    render(<Textarea disabled />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeDisabled()
  })

  it('renders required textarea', () => {
    render(<Textarea required />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toBeRequired()
  })

  it('renders textarea with rows', () => {
    render(<Textarea rows={5} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('renders textarea with cols', () => {
    render(<Textarea cols={50} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveAttribute('cols', '50')
  })
}) 
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Input } from '../../../src/components/ui/input'

describe('Input', () => {
  it('renders input with default props', () => {
    render(<Input />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeInTheDocument()
  })

  it('renders input with custom type', () => {
    render(<Input type="email" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('type', 'email')
  })

  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter your name" />)
    
    const input = screen.getByPlaceholderText('Enter your name')
    expect(input).toBeInTheDocument()
  })

  it('renders input with value', () => {
    render(<Input value="test value" readOnly />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveValue('test value')
  })

  it('renders input with custom className', () => {
    render(<Input className="custom-class" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveClass('custom-class')
  })

  it('renders input with id', () => {
    render(<Input id="test-input" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('id', 'test-input')
  })

  it('renders input with name', () => {
    render(<Input name="test-name" />)
    
    const input = screen.getByRole('textbox')
    expect(input).toHaveAttribute('name', 'test-name')
  })

  it('renders disabled input', () => {
    render(<Input disabled />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
  })

  it('renders required input', () => {
    render(<Input required />)
    
    const input = screen.getByRole('textbox')
    expect(input).toBeRequired()
  })
}) 
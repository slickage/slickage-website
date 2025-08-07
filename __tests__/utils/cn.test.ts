import { cn } from '../../src/lib/utils'

describe('cn utility', () => {
  it('combines class names correctly', () => {
    const result = cn('class1', 'class2', 'class3')
    expect(result).toBe('class1 class2 class3')
  })

  it('handles conditional classes', () => {
    const isActive = true
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class active-class')
  })

  it('handles false conditional classes', () => {
    const isActive = false
    const result = cn('base-class', isActive && 'active-class')
    expect(result).toBe('base-class')
  })

  it('handles undefined and null values', () => {
    const result = cn('base-class', undefined, null, 'valid-class')
    expect(result).toBe('base-class valid-class')
  })
}) 
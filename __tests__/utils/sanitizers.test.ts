import { stripTags, escapeHtml, sanitizeInput, countLinks, isValidPhoneNumber } from '../../src/lib/utils/sanitizers'

describe('Sanitizer Utilities', () => {
  describe('stripTags', () => {
    it('removes HTML tags from string', () => {
      const input = '<p>Hello <strong>world</strong>!</p>'
      const result = stripTags(input)
      expect(result).toBe('Hello world!')
    })

    it('handles empty string', () => {
      const result = stripTags('')
      expect(result).toBe('')
    })

    it('handles string without tags', () => {
      const input = 'Plain text without tags'
      const result = stripTags(input)
      expect(result).toBe(input)
    })

    it('handles nested tags', () => {
      const input = '<div><span><b>Nested</b> tags</span></div>'
      const result = stripTags(input)
      expect(result).toBe('Nested tags')
    })
  })

  describe('escapeHtml', () => {
    it('escapes HTML special characters', () => {
      const input = '<script>alert("Hello")</script>'
      const result = escapeHtml(input)
      expect(result).toBe('&lt;script&gt;alert(&quot;Hello&quot;)&lt;/script&gt;')
    })

    it('handles empty string', () => {
      const result = escapeHtml('')
      expect(result).toBe('')
    })

    it('handles string without special characters', () => {
      const input = 'Plain text'
      const result = escapeHtml(input)
      expect(result).toBe(input)
    })

    it('escapes all HTML entities', () => {
      const input = '<>&"\''
      const result = escapeHtml(input)
      expect(result).toBe('&lt;&gt;&amp;&quot;&#39;')
    })
  })

  describe('sanitizeInput', () => {
    it('strips tags and escapes HTML', () => {
      const input = '<script>alert("Hello")</script>'
      const result = sanitizeInput(input)
      expect(result).toBe('alert(&quot;Hello&quot;)')
    })

    it('handles empty string', () => {
      const result = sanitizeInput('')
      expect(result).toBe('')
    })

    it('handles plain text', () => {
      const input = 'Plain text input'
      const result = sanitizeInput(input)
      expect(result).toBe(input)
    })
  })

  describe('countLinks', () => {
    it('counts links in text', () => {
      const input = 'Check out https://example.com and http://test.com'
      const result = countLinks(input)
      expect(result).toBe(2)
    })

    it('returns 0 for text without links', () => {
      const input = 'Plain text without any links'
      const result = countLinks(input)
      expect(result).toBe(0)
    })

    it('handles empty string', () => {
      const result = countLinks('')
      expect(result).toBe(0)
    })

    it('counts various link formats', () => {
      const input = 'https://example.com http://test.com ftp://files.com'
      const result = countLinks(input)
      expect(result).toBe(3)
    })
  })

  describe('isValidPhoneNumber', () => {
    it('validates US phone number format', () => {
      expect(isValidPhoneNumber('(555) 123-4567')).toBe(true)
      expect(isValidPhoneNumber('555-123-4567')).toBe(true)
      expect(isValidPhoneNumber('555.123.4567')).toBe(true)
      expect(isValidPhoneNumber('5551234567')).toBe(true)
    })

    it('rejects invalid phone numbers', () => {
      expect(isValidPhoneNumber('123')).toBe(false)
      expect(isValidPhoneNumber('abc-def-ghij')).toBe(false)
      expect(isValidPhoneNumber('555-123-456')).toBe(false) // Too short
      expect(isValidPhoneNumber('555-123-45678')).toBe(false) // Too long
    })

    it('handles empty string', () => {
      expect(isValidPhoneNumber('')).toBe(false)
    })

    it('validates international formats', () => {
      expect(isValidPhoneNumber('+1-555-123-4567')).toBe(true)
      expect(isValidPhoneNumber('1-555-123-4567')).toBe(true)
    })
  })
}) 